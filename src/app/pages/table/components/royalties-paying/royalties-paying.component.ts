import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';
import { apiurl } from '../../../../../environments/apiservice';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-royalties-paying',
  templateUrl: './royalties-paying.component.html',
  styleUrls: ['./royalties-paying.component.scss']
})
export class RoyaltiesPayingComponent implements OnInit {

  paysettings = {
    add: {
      addButtonContent: '<span class="fa fa-plus"></span>',
      createButtonContent: '<span class="fa fa-check"></span>',
      cancelButtonContent: '<span class="fa fa-times"></span>',
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<span class="fa fa-edit"></span>',
      saveButtonContent: '<span class="fa fa-check"></span>',
      cancelButtonContent: '<span class="fa fa-times"></span>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<span class="fa fa-trash"></span>',
      confirmDelete: true
    },
    selectMode: 'multi',
    action: {
      select: true,
      add: false,
      delete: false
    },
    region: {
      class: 'wide'
    },
    columns: {
      /*_id: {
        title: '_id',
        type: 'string',
        hideHeader: true,
        hideSubHeader: true
      },
      일자: {
        title: '일자',
        type: 'shortDate'
      },*/
      저자: {
        title: '저자',
        type: 'string'
      },
      도서명: {
        title: '도서명',
        type: 'string'
      },
      /*서점명: {
        title: '서점명',
        type: 'string'
      },*/
      인세금액: {
        title: '인세금액',
        type: 'string',
        filter: false
      },/*
      payed: {
        title: '정산유무',
        filter: {
          type: 'checkbox',
          config: {
            true: 'true',
            false: 'false',
            resetText: 'clear'
          }
        }
      }*/
    },
    attr: {
      class: 'table table-bordered'
    },
    pager : {
      display: true,
      perPage : 30
    }
  };
  paysource: LocalDataSource;
  gridSelected: any;
  nowrange: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  date: any;
  public daterange: any = {};
  public options: any = {
    locale: { format: 'YYYY-MM-DD' },
    alwaysShowCalendars: false,
  };
  public payselectedDate(value: any, datepicker?: any) {
    // this is the date the iser selected
    this.payselected(value);
      // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;
    // or manupulat your own internal property
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
    this.nowrange = value;
  }

  payselected(value: any){
    this.date = value;
    this.http.post(`${apiurl}/gcUnit/daterangeNcalc`, value)
    .map(res=>res)
    .subscribe(res => {
      let tmp: any[] = Array.of(res);
      console.log(tmp);
      this.paysource = new LocalDataSource();
      this.paysource.load(tmp[0]);
    });
  }
  onSubmit(){
    if(this.gridSelected){
      this.http.post(`${apiurl}/gcUnit/paying`, this.gridSelected)
      .subscribe(res => {
        console.log(res);
        this.payselected(this.date);
      })
    }else{
      console.log('err');
    }
  }

  
  excel(){
    this.http.post(`${apiurl}/gcUnit/daterangeNcalc`, this.nowrange)
    .map(res=>res)
    .subscribe(res => {
      let tmp: any[] = Array.of(res);
      console.log(tmp);
      //this.paysource = new LocalDataSource();
      //this.paysource.load(tmp[0]);
      this.exportExcel(tmp[0]);
    });
    
  }
  exportExcel(data: any[]){
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'my_file.xls', { bookType: 'xls', type: 'buffer' });
 }

  onUserRowSelect(event) {
    this.gridSelected = event.selected;
    
  }

}
