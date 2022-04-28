import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-order-delievering-list',
  templateUrl: './order-delievering-list.component.html',
  styleUrls: ['./order-delievering-list.component.css']
})
export class OrderDelieveringListComponent implements OnInit {

  
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
    this.orderCol = this.afs.collection('orders',(ref) => ref.where('status','==','delivering').orderBy('time','desc'));
    this.orders =  await this.getData(this.orderCol);

    this.orders.forEach((order) => {
      order.time =  order.time.toDate();
    })


  }

}
