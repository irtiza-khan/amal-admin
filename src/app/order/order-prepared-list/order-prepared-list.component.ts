import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, Query } from '@angular/fire/firestore';
import { NotifyService } from 'app/core/notify.service';
import { cssHooks } from 'jquery';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-order-prepared-list',
  templateUrl: './order-prepared-list.component.html',
  styleUrls: ['./order-prepared-list.component.css']
})
export class OrderPreparedListComponent implements OnInit {
  orderCol: AngularFirestoreCollection;
  orders: [any];
  searchDate: any;
  searchStatus: boolean;
  noOrder: boolean;
  lastSnapshot: any;
  firstSnapshot: any;
  disablePagination: boolean;
  paginationLen: number = 5;
  pageNum: any;
  pageLen: any;
  wait: boolean;
  first: any;
  last: any;
  direction: string = "next";
  constructor(private afs: AngularFirestore, private notify: NotifyService) { }

  getData(collection: AngularFirestoreCollection<any>): Promise<any> {
    return collection.get().pipe(
      map((actions) => {
        const data = [];
        let first = false;
        let lastS: any;
        let count = 0;
        actions.forEach((a) => {
          if (!first) {
            this.firstSnapshot = a;
            first = true;
          }
          count++;
          if (count < this.paginationLen) {
            lastS = a;
            const item = a.data() as any;
            item.id = a.id;
            data.push(item);
          }

        });
        if (count < this.paginationLen && this.direction === 'next') {
          this.disablePagination = true;
        }
        if (lastS) {
          this.lastSnapshot = lastS
        } else {
          this.firstSnapshot = this.lastSnapshot;
        }
        return data;
      }),
    ).toPromise();
  }


  async search() {
    let orderCollection: any;
    let orders: any;
    if (this.searchDate !== undefined) {
      orderCollection = this.afs.collection('orders', (ref) => ref.where('status', '==', 'prepared').where('time', '==', this.searchDate));
      this.searchStatus = true;
      this.pageNum = 1;
    } if (this.searchDate == null) {
      orderCollection = this.afs.collection('orders', (ref) => ref.where('status', '==', 'prepared').orderBy('time', 'desc'));
      this.searchStatus = false;
      this.pageNum = 1;
    }

    orders = await this.getData(orderCollection);

    if (orders.length > 0) {
      this.orders = orders;
    } else {
      this.notify.update('No Orders Found', 'error');
    }
  }

  nextPage() {
    if (this.searchStatus == true) {
      return this.afs.collection('orders', ref => {
        let query: Query = ref;
        query = query.where('status', '==', 'prepared').where('time', '==', this.searchDate).startAfter(this.lastSnapshot).limit(this.paginationLen);
        return query;
      });
    } else {
      return this.afs.collection('orders', ref => {
        let query: Query = ref;
        query = query.where('status', '==', 'prepared').orderBy('time', 'desc').startAfter(this.lastSnapshot).limit(this.paginationLen);
        return query;
      });

    }
  }


  previousPage() {
    if (this.searchStatus == true) {
      return this.afs.collection('orders', ref => {
        let query: Query = ref;
        query = query.where('status', '==', 'prepared').where('time', '==', this.searchDate).endAt(this.firstSnapshot).limitToLast(this.paginationLen);
        return query;
      });
    } else {
      return this.afs.collection('orders', ref => {
        let query: Query = ref;
        query = query.where('status', '==', 'prepared').orderBy('time', 'desc').endAt(this.firstSnapshot).limitToLast(this.paginationLen);
        return query;
      });

    }

  }

  async previous() {
    this.wait = true;
    this.direction = 'previous'
    let previouseCollection = this.previousPage();
    this.orders = await this.getData(previouseCollection);
    this.orders.forEach((order) => {
      order.time = order.time.toDate();
    })
    this.pageNum--;
    this.pageLen = this.orders.length
    this.wait = false;

  }

  async next() {
    this.wait = true
    this.direction = 'next'
    let nextCollection = this.nextPage();
    this.orders = await this.getData(nextCollection);
    this.orders.forEach((order) => {
      order.time = order.time.toDate();
    })
    this.pageNum++;
    this.pageLen = this.orders.length;
    this.wait = false;
  }


  async ngOnInit() {
    let orders: any;
    this.orderCol = this.afs.collection('orders', (ref) => ref.where('status', '==', 'prepared').orderBy('time', 'desc'));
    orders = await this.getData(this.orderCol);
    if (orders.length > 0) {
      this.orders = orders;
      this.orders.forEach((order) => {
        order.time = order.time.toDate();
      })

      this.first = this.orders[0];
      this.last = this.orders[this.orders.length - 1];
      this.pageNum = 1;
      this.pageLen = this.orders.length

    } else {
      this.noOrder = true;
    }

  }

}
