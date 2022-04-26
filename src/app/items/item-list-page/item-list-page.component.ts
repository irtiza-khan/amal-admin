import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/core/auth.service';
import { NotifyService } from 'app/core/notify.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-item-list-page',
  templateUrl: './item-list-page.component.html',
  styleUrls: ['./item-list-page.component.css']
})
export class ItemListPageComponent implements OnInit {

  itemCollection: AngularFirestoreCollection<any>;
  items: [any];
  lastSnapshot: any;
  disablePagination: boolean;
  paginationLen: number = 3;
  firstSnapshot: any;
  wait: boolean
  first: any;
  last: any;
  pageNum: number;
  pageLen: any;
  direction: string = "next";

  constructor(private route: ActivatedRoute,
    private afs: AngularFirestore, private fb: FormBuilder,
    public auth: AuthService, private notify: NotifyService,
    private storage: AngularFireStorage) { }

  getData(collection: AngularFirestoreCollection<any>): Promise<any> {
    return collection.get({ source: 'default' }).pipe(
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
          console.log('Disable Next Button')
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


  nextPage() {
    console.log(`The Last ${this.lastSnapshot}`)
    return this.afs.collection('items', (ref) => ref.orderBy('name', 'asc').startAfter(this.lastSnapshot).limit(this.paginationLen))
  }


  previousPage() {
    return this.afs.collection('items', (ref) => ref.orderBy('name', 'asc').endAt(this.firstSnapshot).limitToLast(this.paginationLen));
  }


  async next() {
    this.wait = true
    this.direction = 'next'
    let nextCollection = this.nextPage();
    this.items = await this.getData(nextCollection);
    this.items.forEach((item) => {
      const desc = item.description ? (item.description.length <= 100 ? item.description : `${item.description.substring(0, 75)}...`) : '';
      item.description = desc;
    })
    this.pageNum++;
    this.pageLen = this.items.length;
    this.wait = false;
  }


  async previous() {
    this.wait = true;
    this.direction = 'previous'
    let previousCollection = this.previousPage();
    this.items = await this.getData(previousCollection);
    this.items.forEach((item) => {
      const desc = item.description ? (item.description.length <= 100 ? item.description : `${item.description.substring(0, 75)}...`) : '';
      item.description = desc;
    })
    this.pageNum--;
    this.pageLen = this.items.length
    this.wait = false;
  }


  
  async ngOnInit() {
    this.itemCollection = this.afs.collection('items', (ref) => ref.orderBy('name', 'asc').limit(this.paginationLen));
    this.items = await this.getData(this.itemCollection);
    this.items.forEach((item) => {
      const desc = item.description ? (item.description.length <= 100 ? item.description : `${item.description.substring(0, 75)}...`) : '';
      item.description = desc;
    })
    this.first = this.items[0];
    this.last = this.items[this.items.length - 1];
    this.pageNum = 1;
    this.pageLen = this.items.length
    console.log(this.items)
  }

}
