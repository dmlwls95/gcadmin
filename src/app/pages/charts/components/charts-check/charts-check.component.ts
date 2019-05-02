import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';
import { apiurl } from '../../../../../environments/apiservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-charts-check',
  templateUrl: './charts-check.component.html',
  styleUrls: ['./charts-check.component.scss'],
  providers: [DatePipe]
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
        title: '성명',
        type: 'string'
      },
      소속: {
        title: '소속',
        type: 'string',
        filter: false
      },
      직위: {
        title: '직위',
        type: 'string',
        filter: false
      },
      연락처_휴대전화: {
        title: '연락처_휴대전화',
        type: 'string',
        filter: false
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
        type: 'string'
      },
      예금주: {
        title: '예금주',
        type: 'string'
      },
      주소_직장: {
        title: '주소_직장',
        type: 'string',
        width: '200px'
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
      perPage : 3
    }
  };
  today: number = Date.now();
  counselsettings = {
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
      /*저자:{
        title: '저자id',
        type: 'string'
      },*/
      연월일: {
        title: '연월일',
        type: 'string',
        valuePrepareFunction: (date) => {
          if(date){
            return date;
          }
          return this.datepipe.transform(new Date(), 'yyyy MM dd');
        }
      },
      내용: {
        title: '내용',
        type: 'string'
      },
      담당자: {
        title: '담당자',
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
  counselsource: LocalDataSource;
  source: ServerDataSource;
  lsource: LocalDataSource;
  editorForm: FormGroup;
  editorData = {
      author: '',
      org: '',
      hierarchy: '',
      cel1: '',
      cel2: '',
      fax: '',
      email: '',
      busn: '',
      cate: '',
      RRN: '',
      bank: '',
      bankaccount: '',
      bankaccount_owner: '',
      addr_comp: '',
      addr_home: '',
      bigo_01: '',
      bigo_02: '',
      major: '',
      anniversary: '',
      id: '',
      pw: ''
  };
  searchFname = {
    author: ''
  }

  eventid ='';
  searchForm: FormGroup;
  searchData = { query: ''};
  date;
  constructor(public datepipe: DatePipe,private http: HttpClient, private formBuilder: FormBuilder) {
    this.date = new Date();
    console.log(this.date)
    /*this.source = new ServerDataSource(http, {
      endPoint: `${apiurl}/gcUnit/editorchart`,
    pagerLimitKey: 'limit',
    pagerPageKey: 'page',
    dataKey: 'docs',
    totalKey: 'pages',
    filterFieldKey: '#field#'
    });
    this.source.setPaging(1, 10);*/
    
    
    //console.log(this.source);
    this.loadeditordata()
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

  loadeditordata(){
    this.http.get(`${apiurl}/gcUnit/editorsearch`)
      .map(res=>res)
      .subscribe(res=>{
        let tmp: any[] = Array.of(res);
        console.log(tmp);
        this.lsource = new LocalDataSource();
        this.lsource.load(tmp[0]);
    })
  }

  onSubmit(){
    this.http.post(`${apiurl}/gcUnit/editoradd`, this.editorData)
    .subscribe(res => {
      console.log(res);
    },
    (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        alert('Client-side error occured.');
      } else {
        alert('Server-side error occured.');
      }
    },
    ()=>{
      this.loadeditordata();
      alert('저장완료');
      
    })
  }

  onNew(){
    this.http.post(`${apiurl}/gcUnit/editoraddnew`, this.editorData)
    .subscribe(res=>{
      console.log(res);
    },(err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        alert('Client-side error occured.');
      } else {
        alert('Server-side error occured.');
      }
    },
    ()=>{
      this.loadeditordata();
      alert('신규추가완료');
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
    counselupdateRecord(event) {
      this.http.put<any>(`${apiurl}/gcUnit/counsel/` + event.newData._id, event.newData).subscribe(
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
    
    counseldeleteRecord(event) {
           console.log(event.data);
          this.http.delete<any>(`${apiurl}/gcUnit/counsel` + event.data._id).subscribe(
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
    
      counselcreateRecord(event) {
        this.http.post<any>(`${apiurl}/gcUnit/counsel/` , {newdata: event.newData, id: this.eventid}).subscribe(
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
      console.log(event.data._id)
      this.eventid = event.data._id;
      this.editorData.author = event.data.저자;
      this.editorData.org = event.data.소속;
      this.editorData.hierarchy = event.data.직위;
      this.editorData.cel1 = event.data.연락처_휴대전화;
      this.editorData.cel2 = event.data.연락처_02;
      this.editorData.fax = event.data.팩스;
      this.editorData.email = event.data.이메일;
      this.editorData.busn = event.data.사업자번호;
      this.editorData.cate = event.data.구분;
      this.editorData.RRN = event.data.주민번호;
      this.editorData.bank = event.data.은행;
      this.editorData.bankaccount = event.data.계좌번호;
      this.editorData.bankaccount_owner = event.data.예금주;
      this.editorData.addr_comp = event.data.주소_직장;
      this.editorData.addr_home = event.data.주소_자택;
      this.editorData.bigo_01 = event.data.비고_01;
      this.editorData.bigo_02 = event.data.비고_02;
      this.editorData.major = event.data.전공;
      this.editorData.anniversary = event.data.기념일;
      this.editorData.id = event.data.id;
      this.editorData.pw = event.data.pw;
      
      
      
      
      this.http.get<any>(`${apiurl}/gcUnit/counsel` + event.data._id)
      .subscribe(res=>{
        console.log(res);
        this.counselsource = new LocalDataSource();
        this.counselsource.load(res.docs);
      })
      /*.map(res=>res)
      .subscribe(res => {
        console.log(res);
        let tmp: any[] = Array.of(res);
        console.log(tmp);
        this.counselsource = new LocalDataSource();
        this.counselsource.load(tmp[0]);
      });*/
    }

    authorKeyup(event){
      let tmp = this.searchFname.author;
      this.lsource.setFilter([{ field:'저자', search: tmp}]);
    }
      
}
