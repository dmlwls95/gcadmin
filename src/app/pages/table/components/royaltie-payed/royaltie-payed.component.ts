import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';
import { apiurl } from '../../../../../environments/apiservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-royaltie-payed',
  templateUrl: './royaltie-payed.component.html',
  styleUrls: ['./royaltie-payed.component.scss']
})
export class RoyaltiePayedComponent {

  
  tableData: Array<any>;

  /* pagination Info */
  pageSize = 10;
  pageNumber = 1;

  settings = {
    add: {
      addButtonContent: '<span class="fa fa-plus"></span>',
      createButtonContent: '<span class="fa fa-check"></span>',
      cancelButtonContent: '<span class="fa fa-times"></span>',
      confirmCreate: false
    },
    edit: {
      editButtonContent: '<span class="fa fa-edit"></span>',
      saveButtonContent: '<span class="fa fa-check"></span>',
      cancelButtonContent: '<span class="fa fa-times"></span>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<span class="fa fa-trash"></span>',
      confirmDelete: false
    },
    
    region: {
      class: 'wide'
    },
    columns: {
      일자: {
        title: '일자',
        type: 'Date',
        filter: false
      },
      저자: {
        title: '저자',
        type: 'string',
        filter: true
      },
      도서명: {
        title: '도서명',
        type: 'string',
        filter: true
      },
      /*서점명: {
        title: '서점명',
        type: 'string',
        filter: false
      },*/
      인세금액: {
        title: '인세금액',
        type: 'Number',
        filter: false
      },
      comment:{
        title: '코멘트',
        type: 'string',
        filter: false
      }
      
    },
    attr: {
      class: 'table table-bordered'
    },
    pager : {
      display: true
    }
  };

  source: LocalDataSource;
  editorForm: FormGroup;
  paylast = [];
  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    this.source = new LocalDataSource();
    this.callPayed();
  }
   

  callPayed(){
    this.http.get(`${apiurl}/gcUnit/getpayed`)
    .map(res=>res)
    .subscribe(res => {
      let tmp: any[] = Array.of(res);
      console.log(tmp[0]);
      tmp[0].forEach((data)=>{
        let day = new Date(data.일자);
        let topush = {
          _id: data._id,
          일자: day.toLocaleDateString('ko-KR'),
          저자: data.저자,
          도서명: data.도서명,
          인세금액: data.인세금액,
          코멘트: data.코멘트
        };
        this.paylast.push(topush);
      })
      
      this.source.load(this.paylast);
    }, err => {
      console.log(err);
    });
  }
  updateRecord(event) {
    this.http.put<any>(`${apiurl}/gcUnit/getpayed/` + event.newData._id, event.newData).subscribe(
          res => {
            console.log(res);
            event.confirm.resolve(event.newData);
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Client-side error occured.');
          } else {
            console.log('Server-side error occured.');
          }
        });
    }

  deleteRecord(event) {
       console.log(event.data);
      this.http.delete<any>(`${apiurl}/gcUnit/getpayed/` + event.data._id).subscribe(
          res => {
            console.log(res);
            event.confirm.resolve(event.source.data);
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Client-side error occured.');
          } else {
            console.log('Server-side error occured.');
          }
        });
      // event.confirm.resolve(event.source.data);}
  }

  

}
