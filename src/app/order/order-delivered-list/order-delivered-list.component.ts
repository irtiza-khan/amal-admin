import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-order-delivered-list',
  templateUrl: './order-delivered-list.component.html',
  styleUrls: ['./order-delivered-list.component.css']
})
export class OrderDeliveredListComponent implements OnInit {

  orderCol: AngularFirestoreCollection;
  orders:[any];
  
  constructor(private afs: AngularFirestore) { }

  getData(collection: AngularFirestoreCollection<any>): Promise<any> {
    return collection.get().pipe(
      map((actions) => {
        const data = [];
        actions.forEach((a) => {
          const item =  a.data() as any;
          item.id = a.id;
          data.push(item);

        });
        return data;
      }),
    ).toPromise();
  }

 async ngOnInit() {
    this.orderCol = this.afs.collection('orders',(ref) => ref.where('status','==','delivered').orderBy('time','desc'));
    this.orders =  await this.getData(this.orderCol);

    this.orders.forEach((order) => {
      order.time =  order.time.toDate();
    })


  }

}
