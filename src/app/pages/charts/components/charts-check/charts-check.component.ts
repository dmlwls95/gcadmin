import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataSource } from 'ng2-smart-table';
import { apiurl } from '../../../../../environments/apiservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-charts-check',
  templateUrl: './charts-check.component.html',
  styleUrls: ['./charts-check.component.scss']
})
export class ChartsCheckComponent {

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
        title: '이름',
        type: 'string'
      },
      소속: {
        title: '소속',
        type: 'string',
        filter: false
      },
      은행: {
        title: '은행',
        type: 'string',
        filter: false
      },
      계좌번호: {
        title: '계좌번호',
        type: 'string',
        filter: false
      },
      연락처_01: {
        title: '연락처_01',
        type: 'string',
        filter: false
      },
      연락처_02: {
        title: '연락처_02',
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
      주민번호: {
        title: '주민번호',
        type: 'string'
      },
      주소: {
        title: '주소',
        type: 'string',
        filter: false
      },
      /*비고_01: {
        title: '비고_01',
        type: 'string'
      },
      비고_02: {
        title: '비고_02',
        type: 'string'
      },
      비고_03: {
        title: '비고_03',
        type: 'string'
      },
      구분: {
        title: '구분',
        type: 'string'
      }*/
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
  editorData = {
      author: '',
      RRN: '',
      org: '',
      addr: '',
      bank: '',
      bankaccount: '',
      cel1: '',
      cel2: '',
      email: '',
      bigo: ''
  };
  searchForm: FormGroup;
  searchData = { query: ''};

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    this.source = new ServerDataSource(http, {
      endPoint: `${apiurl}/gcUnit/editorchart`,
    pagerLimitKey: 'limit',
    pagerPageKey: 'page',
    dataKey: 'docs',
    totalKey: 'pages',
    filterFieldKey: '#field#'
    });
    this.source.setPaging(1, 10);
    console.log(this.source);
   }

   ngOnInit() {
    /*this.editorForm = this.formBuilder.group({
      author: [''],
      RRN_1: [''],
      RRN_2: [''],
      org: [''],
      compaddr: [''],
      homeaddr: [''],
      bank: [''],
      bankaccount: [''],
      c_tel: [''],
      h_tel: [''],
      cel: [''],
      email: [''],
    })*/
  }

  onSubmit(){
      this.http.post(`${apiurl}/gcUnit/editoradd`, this.editorData)
      .subscribe(res => {
        console.log(res);
        this.source.refresh();
      })
  }
  
  onSearch() {
    console.log(this.searchData)
    this.http.post(`${apiurl}/gcUnit/editorsearch`, this.searchData)
    .subscribe(res => {
      console.log(res);
    })
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

    onRecordselected(event) {
      this.editorData.author = event.data.저자;
      this.editorData.RRN = event.data.주민번호;
      this.editorData.org = event.data.소속;
      this.editorData.addr = event.data.주소;
      this.editorData.bank = event.data.은행;
      this.editorData.bankaccount = event.data.계좌번호;
      this.editorData.cel1 = event.data.연락처_01;
      this.editorData.cel2 = event.data.연락처_02;
      this.editorData.email = event.data.이메일;
      this.editorData.bigo = event.data.비고_01;
    }
}
