import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';
import { apiurl } from '../../../../../environments/apiservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompleterService, CompleterData } from 'ng2-completer';

@Component({
  selector: 'app-book-only-check',
  templateUrl: './book-only-check.component.html',
  styleUrls: ['./book-only-check.component.scss']
})
export class BookOnlyCheckComponent {

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
        type: 'string'
      },
      도서코드: {
        title: '도서코드',
        type: 'string'
      },
      도서명: {
        title: '도서명',
        type: 'string'
      },
      저자: {
        title: '저자',
        type: 'string'
      },
      계약일: {
        title: '신간일',
        type: 'string',
        filter: false
      },
      발행일: {
        title: '발행일',
        type: 'string',
        filter: false
      },
      발행처: {
        title: '발행처',
        type: 'string',
        filter: false
      },
      정가: {
        title: '정가',
        type: 'string',
        filter: false
      },
      계약기간: {
        title: '계약기간',
        type: 'string',
        filter: false
      },
      상태: {
        title: '상태',
        type: 'string',
        filter: false
      },
      인세율: {
        title: '인세율',
        type: 'number',
        filter: false
      },
      인세주기: {
        title: '인세주기',
        type: 'String',
        filter: false
      },
      판_쇄: {
        title: '판_쇄',
        type: 'String',
        filter: false
      },
      발행부수: {
        title: '발행부수',
        type: 'string',
        filter: false
      },
      저술_번역: {
        title: '저술_번역',
        type: 'String',
        filter: false
      },
      에이전시: {
        title: '에이전시',
        type: 'string',
        filter: false
      },
      원출판사: {
        title: '원출판사',
        type: 'string',
        filter: false
      },
      로열티: {
        title: '로열티',
        type: 'string',
        filter: false
      },
      판형: {
        title: '판형',
        type: 'string',
        filter: false
      },
      제본: {
        title: '제본',
        type: 'string',
        filter: false
      },
      비고: {
        title: '비고',
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

  constructor(private http: HttpClient,) {
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

}
