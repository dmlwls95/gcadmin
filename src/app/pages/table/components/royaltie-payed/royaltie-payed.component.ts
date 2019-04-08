import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataSource } from 'ng2-smart-table';
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
        type: 'string',
        filter: false
      }
      
    },
    attr: {
      class: 'table table-bordered'
    },
    pager : {
      display: true,
      perPage : 1
    }
  };

  source: ServerDataSource;
  editorForm: FormGroup;

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    this.source = new ServerDataSource(http, {
      endPoint: `${apiurl}/gcUnit/getpayed`, // 'http://localhost:4000/gcUnit/paylist',
    pagerLimitKey: 'limit',
    pagerPageKey: 'page',
    dataKey: 'docs',
    totalKey: 'pages',
    filterFieldKey: '#field#'
    });
    console.log(this.source);
    this.source.setPaging(1, 10);
   }

  updateRecord(event) {
    this.http.put<any>(`${apiurl}/gcUnit/editorchart/` + event.newData._id, event.newData).subscribe(
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
      this.http.delete<any>(`${apiurl}/gcUnit/editorchart/` + event.data._id).subscribe(
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

  createRecord(event) {
    this.http.post<any>(`${apiurl}/gcUnit/editorchart/` , event.newData).subscribe(
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
      }
    );
  }

  

}
