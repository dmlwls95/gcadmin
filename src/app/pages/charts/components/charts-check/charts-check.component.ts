import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';
import { apiurl } from '../../../../../environments/apiservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LoadingBarService } from '@ngx-loading-bar/core';

import 'rxjs/add/operator/map';
@Component({
  selector: 'app-charts-check',
  templateUrl: './charts-check.component.html',
  styleUrls: ['./charts-check.component.scss'],
  providers: [DatePipe]
})
export class ChartsCheckComponent {

  isauthorshow = {
    arr : [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    arrcol: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ]
  }
  clone = {};

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
        type: 'string',
        seq: 1
      },
      소속: {
        title: '소속',
        type: 'string',
        seq: 2
      },
      직위: {
        title: '직위',
        type: 'string',
        seq: 3
      },
      연락처_휴대전화: {
        title: '연락처_휴대전화',
        type: 'string',
        width: "200px",
        seq: 4
      },
      연락처_02: {
        title: '연락처_02',
        type: 'string',
        seq: 5
      },
      팩스: {
        title: '팩스',
        type: 'string',
        seq: 6
      },
      /*팩스: {
        title: '팩스',
        type: 'string'
      },*/
      이메일: {
        title: '이메일',
        type: 'string',
        seq: 7
      },
      사업자번호: {
        title: '사업자번호',
        type: 'string',
        seq: 8
      },
      구분: {
        title: '구분',
        type: 'string',
        seq: 9
      },
      주민번호: {
        title: '주민번호',
        type: 'string',
        seq: 10
      },
      은행: {
        title: '은행',
        type: 'string',
        seq: 11
      },
      계좌번호: {
        title: '계좌번호',
        type: 'string',
        width: "200px",
        seq: 12
      },
      예금주: {
        title: '예금주',
        type: 'string',
        seq: 13
      },
      주소_직장: {
        title: '주소_직장',
        type: 'string',
        width: "500px",
        seq: 14
      },
      주소_자택: {
        title: '주소_자택',
        type: 'string',
        seq: 15
      },
      비고_01: {
        title: '비고_01',
        type: 'string',
        seq: 16
      },
      비고_02: {
        title: '비고_02',
        type: 'string',
        seq: 17
      },
      전공: {
        title: '전공',
        type: 'string',
        seq: 18
      },
      기념일: {
        title: '기념일',
        type: 'string',
        seq: 19
      },
      id: {
        title: 'id',
        type: 'string',
        seq: 20
      },
      pw: {
        title: 'pw',
        type: 'string',
        seq: 21
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
        },
        width: "15%"
      },
      내용: {
        title: '내용',
        type: 'string',
        width: "75%"
      },
      담당자: {
        title: '담당자',
        type: 'string',
        width: "10%"
      }
    },
    attr: {
      class: 'table table-bordered'
    },
    pager : {
      display: true,
      perPage : 5
    }
  };

  booksettings = {
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
      저자: {
        title: '저자',
        type: 'string',
        width: "15%"
      },
      도서명: {
        title: '도서명',
        type: 'string',
        width: "75%"
      },
      상태: {
        title: '상태',
        type: 'string',
        width: "10%"
      }
    },
    attr: {
      class: 'table table-bordered'
    },
    pager : {
      display: true,
      perPage : 5
    }
  };
  
  counselsource: LocalDataSource;
  source: ServerDataSource;
  lsource: LocalDataSource;
  booksource: LocalDataSource;
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
  constructor(public datepipe: DatePipe,private http: HttpClient, private formBuilder: FormBuilder, public loader: LoadingBarService) {
    this.date = new Date();
    console.log(this.date)
    
    
    
    //console.log(this.source);
    this.loadeditordata();
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

  loadbookofsomeone(str){
    this.http.post(`${apiurl}/gcUnit/bookofsomeone`,{저자:str})
    .map(res=>res)
    .subscribe(res=>{
      let tmp: any[] = Array.of(res);
      this.booksource = new LocalDataSource();
      this.booksource.load(tmp[0]);
    })
  }

  loadeditordata(){
    /*this.http.get(`${apiurl}/gcUnit/editorsearch`)
      .map(res=>res)
      .subscribe(res=>{
        let tmp: any[] = Array.of(res);
        console.log(tmp);
        this.lsource = new LocalDataSource();
        this.lsource.load(tmp[0]);
    })*/
    this.source = new ServerDataSource(this.http, {
      endPoint: `${apiurl}/gcUnit/editorchart`,
    pagerLimitKey: 'limit',
    pagerPageKey: 'page',
    dataKey: 'docs',
    totalKey: 'pages',
    filterFieldKey: '#field#'
    });
    this.source.setPaging(1, 10);
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
      
      this.loadbookofsomeone(event.data.저자);
      
      
      this.http.get<any>(`${apiurl}/gcUnit/counsel` + event.data._id)
      /*.subscribe(res=>{
        console.log(res);
        this.counselsource = new LocalDataSource();
        this.counselsource.load(res.docs);
      })*/
      .map(res=>res)
      .subscribe(res => {
        console.log(res);
        let tmp: any[] = Array.of(res);
        console.log(tmp);
        this.counselsource = new LocalDataSource();
        this.counselsource.load(tmp[0]);
      });
    }

    authorKeyup(){
      let tmp = this.searchFname.author;
      this.lsource.setFilter([{ field:'저자', search: tmp}]);
    }
      
    clear(){
      this.eventid = null;
      this.editorData.author = null;
      this.editorData.org = null;
      this.editorData.hierarchy = null;
      this.editorData.cel1 = null;
      this.editorData.cel2 = null;
      this.editorData.fax = null;
      this.editorData.email = null;
      this.editorData.busn = null;
      this.editorData.cate = null;
      this.editorData.RRN = null;
      this.editorData.bank = null;
      this.editorData.bankaccount = null;
      this.editorData.bankaccount_owner = null;
      this.editorData.addr_comp = null;
      this.editorData.addr_home = null;
      this.editorData.bigo_01 = null;
      this.editorData.bigo_02 = null;
      this.editorData.major = null;
      this.editorData.anniversary = null;
      this.editorData.id = null;
      this.editorData.pw = null;
    }

    ordering(){
      let entries = Object.entries(this.settings.columns);
      let sorted = entries.sort((a, b) => a[1].seq - b[1].seq);
      sorted.forEach((val)=>{
        this.clone[val[0]] = val[1];
      })
      let tmp = {
        columns: this.clone
      }
      delete this.settings.columns;
      this.clone = {}
      Object.assign(this.settings, tmp)
      return console.log(this.settings)
    }
    hideorshow(number){
      let tmpstr ='';
      if(number === 0){
        tmpstr = '저자';
      }else if(number === 1) tmpstr = '소속';
      else if(number === 2) tmpstr = '직위';
      else if(number === 3) tmpstr = '연락처_휴대전화';
      else if(number === 4) tmpstr = '연락처_02';
      else if(number === 5) tmpstr = '팩스';
      else if(number === 6) tmpstr = '이메일';
      else if(number === 7) tmpstr = '사업자번호';
      else if(number === 8) tmpstr = '구분';
      else if(number === 9) tmpstr = '주민번호';
      else if(number === 10) tmpstr = '은행';
      else if(number === 11) tmpstr = '계좌번호';
      else if(number === 12) tmpstr = '예금주';
      else if(number === 13) tmpstr = '주소_직장';
      else if(number === 14) tmpstr = '주소_자택';
      else if(number === 15) tmpstr = '비고_01';
      else if(number === 16) tmpstr = '비고_02';
      else if(number === 17) tmpstr = '전공';
      else if(number === 18) tmpstr = '기념일';
      else if(number === 19) tmpstr = 'id';
      else if(number === 20) tmpstr = 'pw';
      this.isauthorshow.arr[number]  = !this.isauthorshow.arr[number];
      if (this.isauthorshow.arr[number] == false) {
        this.isauthorshow.arrcol[number] = this.settings.columns[tmpstr];
        delete this.settings.columns[tmpstr];
        this.settings = Object.assign({}, this.settings );
      }else{
        this.settings.columns[tmpstr] = this.isauthorshow.arrcol[number];
      }
      this.ordering();
      this.settings = Object.assign({}, this.settings );
      //this.loadeditordata();
    }
}
