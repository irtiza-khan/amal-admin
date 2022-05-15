import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
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
  @Input() deliver: boolean;
  @Input() show: boolean;

  constructor(private afs: AngularFirestore, private notify: NotifyService, private router: Router) { }


  async updateStatus(id, status: any) {
    let newStatus: any;
    if (status === "preparing") {
      newStatus = "prepared";
    }

    if (status === "prepared") {
      console.log('In if')
      if (this.deliver === true) {
        newStatus = "delivering";
      }
      if (this.deliver === false) {
        newStatus = "delivered"
        await this.afs.collection('orders').doc(id).set({
          status: newStatus
        }, { merge: true })
        this.router.navigate(['/order/delivered'])
        this.notify.update('Status Updated', 'success');
        return;
      }
     
    }


    if (status === "delivering") {
      newStatus = "delivered"
    }


    await this.afs.collection('orders').doc(id).set({
      status: newStatus
    }, { merge: true })

    location.reload();
    this.notify.update('Status Updated', 'success');

  }

  ngOnInit() {
  }


}
