import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';
import { apiurl } from '../../../../../environments/apiservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-pay-check',
  templateUrl: './pay-check.component.html',
  styleUrls: ['./pay-check.component.scss']
})
export class PayCheckComponent {

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
      일자: {
        title: '일자',
        type: 'string',
        filter:false
      },
      바코드: {
        title: '바코드',
        type: 'string',
        filter:false
      },
      도서명: {
        title: '도서명',
        type: 'string'
      },
      정가: {
        title: '정가',
        type: 'string',
        filter:false
      },
      서점명: {
        title: '서점명',
        type: 'string'
      },
      /*제본소입고부수: {
        title: '제본소입고부수',
        type: 'string',
        filter: false
      },
      제본소_외_입고부수: {
        title: '제본소_외_입고부수',
        type: 'string',
        filter: false
      }*/
      매출부수: {
        title: '매출부수',
        type: 'string',
        filter: false
      },
      매출금액: {
        title: '매출금액',
        type: 'string',
        filter: false
      },
      /*본사이동부수: {
        title: '본사이동부수',
        type: 'string',
        filter: false
      },
      증정부수: {
        title: '증정부수',
        type: 'string',
        filter: false
      },
      반품부수: {
        title: '반품부수',
        type: 'string',
        filter: false
      },
      반품금액: {
        title: '반품금액',
        type: 'string',
        filter: false
      },
      폐기부수: {
        title: '폐기부수',
        type: 'string',
        filter: false
      },
      현정품재고: {
        title: '현정품재고',
        type: 'string',
        filter: false
      },
      현반품재고: {
        title: '현반품재고',
        type: 'string',
        filter: false
      },
      순매출부수: {
        title: '순매출부수',
        type: 'string',
        filter: false
      },
      순매출금액: {
        title: '순매출금액',
        type: 'string',
        filter: false
      },*/
      신간일자: {
        title: '신간일자',
        type: 'string',
        filter: false
      },
      /*저자: {
        title: '저자',
        type: 'string',
        filter: false
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

  lsettings = {
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
      일자: {
        title: '일자',
        type: 'string',
        filter:false
      },
      바코드: {
        title: '바코드',
        type: 'string',
        filter:false
      },
      도서명: {
        title: '도서명',
        type: 'string'
      },
      정가: {
        title: '정가',
        type: 'string',
        filter:false
      },
      서점명: {
        title: '서점명',
        type: 'string'
      },
      제본소입고부수: {
        title: '제본소입고부수',
        type: 'string',
        filter: false
      },
      제본소_외_입고부수: {
        title: '제본소_외_입고부수',
        type: 'string',
        filter: false
      },
      매출부수: {
        title: '매출부수',
        type: 'string',
        filter: false
      },
      매출금액: {
        title: '매출금액',
        type: 'string',
        filter: false
      },
      본사이동부수: {
        title: '본사이동부수',
        type: 'string',
        filter: false
      },
      증정부수: {
        title: '증정부수',
        type: 'string',
        filter: false
      },
      반품부수: {
        title: '반품부수',
        type: 'string',
        filter: false
      },
      반품금액: {
        title: '반품금액',
        type: 'string',
        filter: false
      },
      폐기부수: {
        title: '폐기부수',
        type: 'string',
        filter: false
      },
      현정품재고: {
        title: '현정품재고',
        type: 'string',
        filter: false
      },
      현반품재고: {
        title: '현반품재고',
        type: 'string',
        filter: false
      },
      순매출부수: {
        title: '순매출부수',
        type: 'string',
        filter: false
      },
      순매출금액: {
        title: '순매출금액',
        type: 'string',
        filter: false
      },
      신간일자: {
        title: '신간일자',
        type: 'string',
        filter: false
      },
    },
    attr: {
      class: 'table table-bordered'
    },
    pager : {
      display: true,
      perPage : 10
    }
  };
  source: ServerDataSource;
  lsource: LocalDataSource;
  date: any;

  constructor(private http: HttpClient) { 
    this.source = new ServerDataSource(http, {
      endPoint: `${apiurl}/gcUnit/payday`,
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
  }
  public daterange: any = {};
 
  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  public options: any = {
      locale: { format: 'YYYY-MM-DD' },
      alwaysShowCalendars: false,
  };

  public selectedDate(value: any, datepicker?: any) {
    // this is the date the iser selected
    this.selected(value);
      // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;
    // or manupulat your own internal property
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
  }
  selected(value: any){
    this.date = value;
    this.http.post(`${apiurl}/gcUnit/revenuerangeNcalc`, value)
    .map(res=>res)
    .subscribe(res => {
      let tmp: any[] = Array.of(res);
      console.log(tmp);
      this.lsource = new LocalDataSource();
      this.lsource.load(tmp[0]);
    });
  }


  updateRecord(event) {
    this.http.put<any>(`${apiurl}/gcUnit/payday/` + event.newData._id, event.newData).subscribe(
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
        this.http.delete<any>(`${apiurl}/gcUnit/payday/` + event.data._id).subscribe(
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
      this.http.post<any>(`${apiurl}/gcUnit/payday/` , event.newData).subscribe(
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
