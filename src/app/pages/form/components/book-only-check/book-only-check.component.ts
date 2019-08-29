import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';
import { apiurl } from '../../../../../environments/apiservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompleterService, CompleterData } from 'ng2-completer';
import { LoadingBarService } from '@ngx-loading-bar/core';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-book-only-check',
  templateUrl: './book-only-check.component.html',
  styleUrls: ['./book-only-check.component.scss']
})
export class BookOnlyCheckComponent {
  isbookshow = {
    arr : [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    arrcol: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ]
  }
  clone = {};
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
      바코드: {
        title: '바코드',
        type: 'string',
        seq: 1
      },
      도서코드: {
        title: '도서코드',
        type: 'string',
        seq: 2
      },
      도서명: {
        title: '도서명',
        type: 'string',
        seq: 3
      },
      저자: {
        title: '저자',
        type: 'string',
        seq: 4
      },
      계약일: {
        title: '신간일',
        type: 'string',
        filter: false,
        seq: 5
      },
      발행일: {
        title: '발행일',
        type: 'string',
        filter: false,
        seq: 6
      },
      발행처: {
        title: '발행처',
        type: 'string',
        seq: 7
      },
      정가: {
        title: '정가',
        type: 'string',
        filter: false,
        seq: 8
      },
      계약기간: {
        title: '계약기간',
        type: 'string',
        filter: false,
        seq: 9
      },
      상태: {
        title: '상태',
        type: 'string',
        seq: 10
      },
      인세율: {
        title: '인세율',
        type: 'number',
        filter: false,
        seq: 11
      },
      인세주기: {
        title: '인세주기',
        type: 'String',
        filter: false,
        seq: 12
      },
      판_쇄: {
        title: '판_쇄',
        type: 'String',
        filter: false,
        seq: 13
      },
      발행부수: {
        title: '발행부수',
        type: 'string',
        filter: false,
        seq: 14
      },
      저술_번역: {
        title: '저술_번역',
        type: 'String',
        seq: 15
      },
      에이전시: {
        title: '에이전시',
        type: 'string',
        seq: 16
      },
      원출판사: {
        title: '원출판사',
        type: 'string',
        seq: 17
      },
      로열티: {
        title: '로열티',
        type: 'string',
        filter: false,
        seq: 18
      },
      판형: {
        title: '판형',
        type: 'string',
        filter: false,
        seq: 19
      },
      제본: {
        title: '제본',
        type: 'string',
        filter: false,
        seq: 20
      },
      비고: {
        title: '비고',
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

  source: ServerDataSource;

  constructor(private http: HttpClient,public loader: LoadingBarService) {
    this.source = new ServerDataSource(http, {
      endPoint: `${apiurl}/gcUnit/bookcodebyten`,
    pagerLimitKey: 'limit',
    pagerPageKey: 'page',
    dataKey: 'docs',
    totalKey: 'pages',
    filterFieldKey: '#field#'
    });
   }

   updateRecord(event) {
    this.http.put<any>(`${apiurl}/gcUnit/bookcode/` + event.newData._id, event.newData).subscribe(
          res => {
            alert('successfully updated')
            event.confirm.resolve(event.newData);
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            alert('Client-side error occured.');
          } else {
            alert('Server-side error occured.');
          }
        });
    }

    deleteRecord(event) {
         console.log(event.data);
        this.http.delete<any>(`${apiurl}/gcUnit/bookcode/` + event.data._id).subscribe(
            res => {
              alert('successfully removed')
              event.confirm.resolve(event.source.data);
          },
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              alert('Client-side error occured.');
            } else {
              alert('Server-side error occured.');
            }
          });
        // event.confirm.resolve(event.source.data);}
    }

    createRecord(event) {
    // console.log(data);
      this.http.post<any>(`${apiurl}/gcUnit/bookcode/` , event.newData).subscribe(
        res => {
          alert('successfully created')
          event.confirm.resolve(event.newData);

        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
              alert('Client-side error occured.');
            } else {
              alert('Server-side error occured.');
            }
        }
      );
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
        tmpstr = '바코드';
      }else if(number === 1) tmpstr = '도서코드';
      else if(number === 2) tmpstr = '도서명';
      else if(number === 3) tmpstr = '저자';
      else if(number === 4) tmpstr = '계약일';
      else if(number === 5) tmpstr = '발행일';
      else if(number === 6) tmpstr = '발행처';
      else if(number === 7) tmpstr = '정가';
      else if(number === 8) tmpstr = '계약기간';
      else if(number === 9) tmpstr = '상태';
      else if(number === 10) tmpstr = '인세율';
      else if(number === 11) tmpstr = '인세주기';
      else if(number === 12) tmpstr = '인세방식';
      else if(number === 13) tmpstr = '발행부수';
      else if(number === 14) tmpstr = '저술_번역';
      else if(number === 15) tmpstr = '에이전시';
      else if(number === 16) tmpstr = '원출판사';
      else if(number === 17) tmpstr = '로열티';
      else if(number === 18) tmpstr = '판형';
      else if(number === 19) tmpstr = '제본';
      else if(number === 20) tmpstr = '비고';
      else if(number === 21) tmpstr = '담당자';
      else if(number === 22) tmpstr = '특기사항';
      this.isbookshow.arr[number]  = !this.isbookshow.arr[number];
      if (this.isbookshow.arr[number] == false) {
        this.isbookshow.arrcol[number] = this.settings.columns[tmpstr];
        delete this.settings.columns[tmpstr];
        this.settings = Object.assign({}, this.settings );
      }else{
        this.settings.columns[tmpstr] = this.isbookshow.arrcol[number];
      }
      this.ordering();
      this.settings = Object.assign({}, this.settings );
      //this.loadbookdata();
    }

    excel(){
      this.http.get(`${apiurl}/gcUnit/bookcodesearch`)
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
