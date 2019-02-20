import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataSource } from 'ng2-smart-table';
import { apiurl } from '../../../../../environments/apiservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompleterService, CompleterData } from 'ng2-completer';
@Component({
  selector: 'app-book-check',
  templateUrl: './book-check.component.html',
  styleUrls: ['./book-check.component.scss']
})
export class BookCheckComponent {

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
      신간일: {
        title: '신간일',
        type: 'string'
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
      총재고: {
        title: '총재고',
        type: 'string',
        filter: false
      },
      본사재고: {
        title: '본사재고',
        type: 'string',
        filter: false
      },
      정품재고: {
        title: '정품재고',
        type: 'string',
        filter: false
      },
      반품재고: {
        title: '반품재고',
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

  bookForm: FormGroup;
  bookData = {
      barcode: '',
      bookcode: '',
      bookname: '',
      author: '',
      relday: '',
      from: '',
      price: '',
      totalnumber: '',
      homenumber: '',
      genuinenumber: '',
      refundnumber: ''
  };

  protected searchStr: String;
  protected dataService: CompleterData;
  protected searchData;
  constructor(private http: HttpClient, private completerService: CompleterService) { 
    this.source = new ServerDataSource(http, {
      endPoint: `${apiurl}/gcUnit/bookcode`,
    pagerLimitKey: 'limit',
    pagerPageKey: 'page',
    dataKey: 'docs',
    totalKey: 'pages',
    filterFieldKey: '#field#'
    });
    this.source.setPaging(1, 10);
    this.dataService = completerService.local(this.searchData, '저자', '저자');
    this.http.get(`${apiurl}/gcUnit/editorsearch`)
    .map(res =>res)
    .subscribe(res => {
      let tmp: any[] = Array.of(res);
      let stack = new Array();
      tmp.forEach(element => {
        element.forEach(result => {
          stack.push(result.저자);
        });
      });
      this.searchData = stack;
      console.log(this.searchData);
    })
  }

  onSubmit(){
    this.http.post(`${apiurl}/gcUnit/bookadd`, this.bookData)
    .subscribe(res => {
      console.log(res);
      this.source.refresh();
    })
}

  updateRecord(event) {
    this.http.put<any>(`${apiurl}/gcUnit/bookcode/` + event.newData._id, event.newData).subscribe(
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
        this.http.delete<any>(`${apiurl}/gcUnit/bookcode/` + event.data._id).subscribe(
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
    // console.log(data);
      this.http.post<any>(`${apiurl}/gcUnit/bookcode/` , event.newData).subscribe(
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
      
      this.bookData.barcode = event.data.바코드;
      this.bookData.bookcode = event.data.도서코드;
      this.bookData.bookname = event.data.도서명;
      this.bookData.author = event.data.저자;
      this.bookData.relday = event.data.신간일;
      this.bookData.from = event.data.발행처;
      this.bookData.price = event.data.정가;
      this.bookData.totalnumber = event.data.총재고;
      this.bookData.homenumber = event.data.본사재고;
      this.bookData.genuinenumber = event.data.정품재고;
      this.bookData.refundnumber = event.data.반품재고;
    }
}

