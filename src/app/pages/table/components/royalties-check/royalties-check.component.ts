import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';
import { apiurl } from '../../../../../environments/apiservice';

@Component({
  selector: 'app-royalties-check',
  templateUrl: './royalties-check.component.html',
  styleUrls: ['./royalties-check.component.scss']
})
export class RoyaltiesCheckComponent implements OnInit {
  tableData: Array<any>;

  /* pagination Info */
  pageSize = 10;
  pageNumber = 1;
  settings = {
    add: {
      addButtonContent: '<span class="fa fa-plus"></span>',
      createButtonContent: '<span class="fa fa-check"></span>',
      cancelButtonContent: '<span class="fa fa-times"></span>',
      confirmCreate: false
    },
    edit: {
      editButtonContent: '<span class="fa fa-edit"></span>',
      saveButtonContent: '<span class="fa fa-check"></span>',
      cancelButtonContent: '<span class="fa fa-times"></span>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<span class="fa fa-trash"></span>',
      confirmDelete: false
    },
    
    region: {
      class: 'wide'
    },
    columns: {
      일자: {
        title: '일자',
        type: 'Date',
        filter: false
      },
      저자: {
        title: '저자',
        type: 'string',
        filter: true
      },
      도서명: {
        title: '도서명',
        type: 'string',
        filter: true
      },
      /*서점명: {
        title: '서점명',
        type: 'string',
        filter: false
      },*/
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
        title: '_id',
        type: 'string',
        hideHeader: true,
        hideSubHeader: true
      },*/
      일자: {
        title: '일자',
        type: 'shortDate'
      },
      저자: {
        title: '저자',
        type: 'string'
      },
      도서명: {
        title: '도서명',
        type: 'string'
      },
      /*서점명: {
        title: '서점명',
        type: 'string'
      },*/
      인세금액: {
        title: '인세금액',
        type: 'string',
        filter: false
      },
      payed: {
        title: '정산유무',
        filter: {
          type: 'checkbox',
          config: {
            true: 'true',
            false: 'false',
            resetText: 'clear'
          }
        }
      }
    },
    attr: {
      class: 'table table-bordered'
    },
    pager : {
      display: true,
      perPage : 30
    }
  };

  source: ServerDataSource;
  lsource: LocalDataSource;

  

  
  date: any;
  constructor(private http: HttpClient) {
    this.source = new ServerDataSource(http, {
      endPoint: `${apiurl}/gcUnit/getpayed`, // 'http://localhost:4000/gcUnit/paylist',
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
    this.http.post(`${apiurl}/gcUnit/daterange`, value)
    .map(res=>res)
    .subscribe(res => {
      let tmp: any[] = Array.of(res);
      console.log(tmp);
      this.lsource = new LocalDataSource();
      this.lsource.load(tmp[0]);
    });
  }

}
