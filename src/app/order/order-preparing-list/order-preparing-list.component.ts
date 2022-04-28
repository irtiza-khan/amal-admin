import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { NotifyService } from 'app/core/notify.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-order-preparing-list',
  templateUrl: './order-preparing-list.component.html',
  styleUrls: ['./order-preparing-list.component.css']
})
export class OrderPreparingListComponent implements OnInit {

  orderCol: AngularFirestoreCollection;
  orders:[any];
  constructor(private afs: AngularFirestore, private notify: NotifyService) { }

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
    this.orderCol = this.afs.collection('orders',(ref) => ref.where('status','==','preparing').orderBy('time','desc'));
    this.orders =  await this.getData(this.orderCol);
  
    this.orders.forEach((order) => {
      order.time =  order.time.toDate();
    })

    console.log('these ar orders ')
    console.log(this.orders)
  
  }

}