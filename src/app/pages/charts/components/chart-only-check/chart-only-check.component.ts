import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';
import { apiurl } from '../../../../../environments/apiservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LoadingBarService } from '@ngx-loading-bar/core';
import * as XLSX from 'xlsx';
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
  clone = {};
  isauthorshow = {
    arr : [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    arrcol: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ]
  }
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
        filter: false,
        width: "200px",
        seq: 4
      },
      연락처_02: {
        title: '연락처_02',
        type: 'string',
        filter: false,
        seq: 5
      },
      팩스: {
        title: '팩스',
        type: 'string',
        filter: false,
        seq: 6
      },
      /*팩스: {
        title: '팩스',
        type: 'string'
      },*/
      이메일: {
        title: '이메일',
        type: 'string',
        filter: false,
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
        filter: false,
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
      perPage : 10  
    }
  };
  source: LocalDataSource;
  constructor(private http: HttpClient, public loader: LoadingBarService) {
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

  excel(){
    this.http.get(`${apiurl}/gcUnit/editorsearch`)
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

}
