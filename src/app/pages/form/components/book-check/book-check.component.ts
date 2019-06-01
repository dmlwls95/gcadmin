import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';
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
        type: 'string',
        width: "200px"
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
      perPage : 3
    }
  };

  editionsettings = {
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
      날짜:{
        title: '날짜',
        type: 'string'
      },
      쇄: {
        title: '쇄',
        type: 'string'
      },
      부수: {
        title: '부수',
        type: 'Number'
      },
      인세: {
        title: '인세',
        type: 'string'
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

  processsettings = {
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
      항목:{
        title: '항목',
        type: 'string',
        width: '10%'
      },
      날짜: {
        title: '날짜',
        type: 'string',
        width: '10%'
      },
      담당자: {
        title: '담당자',
        type: 'string',
        width: '10%'
      },
      작업내용: {
        title: '작업내용',
        type: 'string',
        width: '70%'
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

  editionsource: LocalDataSource;
  processsource: LocalDataSource;
  source: ServerDataSource;
  lsource: LocalDataSource;

  sum: any;
  bookForm: FormGroup;
  bookData = {
      publisher: '',
      barcode: '',
      bookcode: '',
      bookname: '',
      author: '',
      contactdate: '',
      relday: '',
      from: '',
      price: '',
      contactrange: '',
      status: '',
      royaltipercent: 0,
      royaltijugi: '',
      edition: '',
      relnumber: '',
      translate: '',
      agency: '',
      originrel: '',
      royalti: '',
      panhyng: '',
      jaebon: '',
      page: '',
      bigo: '',
  };
  searchSelect = {
    author: '',
    bookname: ''
  }

  eventbarcode = '';
  protected searchStr: String;
  protected dataService: CompleterData;
  public searchData;
  protected bookNames;
  constructor(private http: HttpClient, private completerService: CompleterService) { 
    /*this.source = new ServerDataSource(http, {
      endPoint: `${apiurl}/gcUnit/bookcode`,
    pagerLimitKey: 'limit',
    pagerPageKey: 'page',
    dataKey: 'docs',
    totalKey: 'pages',
    filterFieldKey: '#field#'
    });*/
    this.loadbookdata();
    
    
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
    })
    this.http.get(`${apiurl}/gcUnit/bookcodesearch`)
    .map(res =>res)
    .subscribe(res => {
      let tmp: any[] = Array.of(res);
      let stack = new Array();
      tmp.forEach(element => {
        element.forEach(result => {
          stack.push(result.도서명);
        });
      });
      this.bookNames = stack;
    })
  }

  loadbookdata(){
    this.http.get(`${apiurl}/gcUnit/bookcodesearch`)
      .map(res=>res)
      .subscribe(res=>{
        let tmp: any[] = Array.of(res);
        console.log(tmp);
        this.lsource = new LocalDataSource();
        this.lsource.load(tmp[0]);
    })
  }

  onSubmit(){
    this.http.post(`${apiurl}/gcUnit/bookadd`, this.bookData)
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
      this.loadbookdata();
      alert('저장완료');
      
    })
}

  onNew(){
    console.log(this.bookData.royaltipercent)
    this.http.post(`${apiurl}/gcUnit/bookaddnew`, this.bookData)
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
      this.loadbookdata();
      alert('신규추가완료');
    })
  }

  updateRecord(event) {
    this.http.put<any>(`${apiurl}/gcUnit/bookcode/` + event.newData._id, event.newData).subscribe(
          res => {
            
            event.confirm.resolve(event.newData);
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            alert('Client-side error occured.');
          } else {
            alert('Server-side error occured.');
          }
        },
        ()=>{
          alert('successfully updated')
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

    editionupdateRecord(event) {
      this.http.put<any>(`${apiurl}/gcUnit/edition/` + event.newData._id, event.newData).subscribe(
            res => {
              console.log(res);
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
    
    editiondeleteRecord(event) {
           console.log(event.data);
          this.http.delete<any>(`${apiurl}/gcUnit/edition` + event.data._id).subscribe(
              res => {
                console.log(res);
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
    
      editioncreateRecord(event) {
        this.http.post<any>(`${apiurl}/gcUnit/edition/` , {newdata: event.newData, barcode: this.eventbarcode}).subscribe(
          res => {
            console.log(res);
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
      processupdateRecord(event) {
        this.http.put<any>(`${apiurl}/gcUnit/process/` + event.newData._id, event.newData).subscribe(
              res => {
                console.log(res);
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
      
        processdeleteRecord(event) {
             console.log(event.data);
            this.http.delete<any>(`${apiurl}/gcUnit/process` + event.data._id).subscribe(
                res => {
                  console.log(res);
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
      
        processcreateRecord(event) {
          this.http.post<any>(`${apiurl}/gcUnit/process/` , {newdata: event.newData, barcode: this.eventbarcode}).subscribe(
            res => {
              console.log(res);
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
    onRecordselected(event) {
      
      this.eventbarcode = event.data.바코드;

      this.bookData.barcode = event.data.바코드;
      this.bookData.bookcode = event.data.도서코드;
      this.bookData.bookname = event.data.도서명;
      this.bookData.author = event.data.저자;
      this.bookData.relday = event.data.발행일;
      this.bookData.from = event.data.발행처;
      this.bookData.price = event.data.정가;
      this.bookData.contactrange = event.data.계약기간;
      this.bookData.status = event.data.상태;
      this.bookData.royaltipercent = event.data.인세율;
      this.bookData.royaltijugi = event.data.인세주기;
      this.bookData.edition = event.data.판_쇄;
      this.bookData.relnumber = event.data.발행부수;
      this.bookData.translate = event.data.저술_번역;
      this.bookData.agency = event.data.에이전시;
      this.bookData.originrel = event.data.원출판사;
      this.bookData.royalti = event.data.로열티;
      this.bookData.panhyng = event.data.판형;
      this.bookData.jaebon = event.data.제본;
      this.bookData.page = event.data.페이지;
      this.bookData.bigo = event.data.비고;


      this.http.get<any>(`${apiurl}/gcUnit/edition` + event.data.바코드)
      .subscribe(res=>{
        console.log(res);
        this.editionsource = new LocalDataSource();
        this.editionsource.load(res.docs);

        this.sum = 0;
        let tmp = res.docs;
        tmp.forEach(element => {
          this.sum += element.부수;
        });
      })
      this.http.get<any>(`${apiurl}/gcUnit/process` + event.data.바코드)
      .subscribe(res=>{
        console.log(res);
        this.processsource = new LocalDataSource();
        this.processsource.load(res.docs);
      })
    }

    selectedAuthor(event){
      this.http.post(`${apiurl}/gcUnit/bookcodebyname`,{name:event})
      .map(res=>res)
      .subscribe(res=>{
        let tmp: any[] = Array.of(res);
        console.log(tmp);
        this.lsource = new LocalDataSource();
        this.lsource.load(tmp[0]);
      })
    }
    selectedBook(event){
      this.http.post(`${apiurl}/gcUnit/bookcodebybook`,{name:event})
      .map(res=>res)
      .subscribe(res=>{
        let tmp: any[] = Array.of(res);
        console.log(tmp);
        this.lsource = new LocalDataSource();
        this.lsource.load(tmp[0]);
      })
    }
    bookKeydown(event){
      let tmp = this.searchSelect.bookname;
      this.lsource.setFilter([{ field: '도서명', search: tmp }])

    }
    clear(){
      this.eventbarcode = null;
      this.bookData.barcode = null;
      this.bookData.bookcode = null;
      this.bookData.bookname = null;
      this.bookData.author = null;
      this.bookData.relday = null;
      this.bookData.from = null;
      this.bookData.price = null;
      this.bookData.contactrange = null;
      this.bookData.status = null;
      this.bookData.royaltipercent = null;
      this.bookData.royaltijugi = null;
      this.bookData.edition = null;
      this.bookData.relnumber = null;
      this.bookData.translate = null;
      this.bookData.agency = null;
      this.bookData.originrel = null;
      this.bookData.royalti = null;
      this.bookData.panhyng = null;
      this.bookData.jaebon = null;
      this.bookData.page = null;
      this.bookData.bigo = null;
    }
}

