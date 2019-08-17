import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';
import { apiurl } from '../../../../../environments/apiservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chart-only-check',
  templateUrl: './chart-only-check.component.html',
  styleUrls: ['./chart-only-check.component.scss']
})
export class ChartOnlyCheckComponent {

  tableData: Array<any>;

  /* pagination Info */
  pageSize = 10;
  pageNumber = 1;

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
      /*_id: {
        title: 'ID',
        type: 'string'
      },*/
      저자: {
        title: '성명',
        type: 'string'
      },
      소속: {
        title: '소속',
        type: 'string'
      },
      직위: {
        title: '직위',
        type: 'string'
      },
      연락처_휴대전화: {
        title: '연락처_휴대전화',
        type: 'string',
        filter: false,
        width: "200px"
      },
      연락처_02: {
        title: '연락처_02',
        type: 'string',
        filter: false
      },
      팩스: {
        title: '팩스',
        type: 'string',
        filter: false
      },
      /*팩스: {
        title: '팩스',
        type: 'string'
      },*/
      이메일: {
        title: '이메일',
        type: 'string',
        filter: false
      },
      사업자번호: {
        title: '사업자번호',
        type: 'string'
      },
      구분: {
        title: '구분',
        type: 'string',
        filter: false
      },
      주민번호: {
        title: '주민번호',
        type: 'string'
      },
      은행: {
        title: '은행',
        type: 'string'
      },
      계좌번호: {
        title: '계좌번호',
        type: 'string',
        width: "200px"
      },
      예금주: {
        title: '예금주',
        type: 'string'
      },
      주소_직장: {
        title: '주소_직장',
        type: 'string',
        width: "500px"
      },
      주소_자택: {
        title: '주소_자택',
        type: 'string'
      },
      비고_01: {
        title: '비고_01',
        type: 'string'
      },
      비고_02: {
        title: '비고_02',
        type: 'string'
      },
      전공: {
        title: '전공',
        type: 'string'
      },
      기념일: {
        title: '기념일',
        type: 'string'
      },
      id: {
        title: 'id',
        type: 'string'
      },
      pw: {
        title: 'pw',
        type: 'string'
      }
    },
    attr: {
      class: 'table table-bordered'
    },
    pager : {
      display: true,
      perPage : 10  
    }
  };
  source: LocalDataSource;
  constructor(private http: HttpClient) {
    this.loadeditordata();
   }

  loadeditordata(){
    this.http.get(`${apiurl}/gcUnit/editorsearch`)
      .map(res=>res)
      .subscribe(res=>{
        let tmp: any[] = Array.of(res);
        console.log(tmp);
        this.source = new LocalDataSource();
        this.source.load(tmp[0]);
    })
  }

}
