import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataSource } from 'ng2-smart-table';
import { apiurl } from '../../../../../environments/apiservice';

@Component({
  selector: 'app-royalties-check',
  templateUrl: './royalties-check.component.html',
  styleUrls: ['./royalties-check.component.scss']
})
export class RoyaltiesCheckComponent implements OnInit {

  settings = {
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
    region: {
      class: 'wide'
    },
    columns: {
      일자: {
        title: '일자',
        type: 'string'
      },
      저자: {
        title: '저자',
        type: 'string'
      },
      도서명: {
        title: '도서명',
        type: 'string'
      },
      서점명: {
        title: '서점명',
        type: 'string'
      },
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

  constructor(private http: HttpClient) {
    this.source = new ServerDataSource(http, {
      endPoint: `${apiurl}/gcUnit/royalti`, // 'http://localhost:4000/gcUnit/paylist',
    pagerLimitKey: 'limit',
    pagerPageKey: 'page',
    dataKey: 'docs',
    totalKey: 'pages',
    filterFieldKey: '#field#'
    });
    console.log(this.source);
    this.source.setPaging(1, 10);
   }

  ngOnInit() {
  }

}
