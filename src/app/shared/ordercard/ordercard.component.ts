import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotifyService } from 'app/core/notify.service';

@Component({
  selector: 'app-ordercard',
  templateUrl: './ordercard.component.html',
  styleUrls: ['./ordercard.component.css']
})
export class OrdercardComponent implements OnInit {

  @Input() id: string;
  @Input() time: any;
  @Input() name: string;
  @Input() items: any[];
  @Input() status: string;

  constructor(private afs: AngularFirestore, private notify: NotifyService) { }


  async updateStatus(id, status: any) {
    let newStatus: any;
    console.log(`Status ${status}`)
    if (status === "preparing") {
      newStatus = "prepared";
    } 

    if(status === "prepared"){
      newStatus = "delivering";
    }
    if(status === "delivering"){
      newStatus = "delivered"
    }
    console.log(`id ${id}`);

    await this.afs.collection('orders').doc(id).set({
      status:newStatus
    }, { merge: true })

    location.reload();
    this.notify.update('Status Updated', 'success');

  }

  ngOnInit() {
    console.log('Items ');
    console.log(this.items)
  }


}
