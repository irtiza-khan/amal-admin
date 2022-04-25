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

  constructor(private route: ActivatedRoute,
    private afs: AngularFirestore, private fb: FormBuilder,
    public auth: AuthService, private notify: NotifyService,
    private storage: AngularFireStorage) { }

  getData(collection: AngularFirestoreCollection<any>): Promise<any> {
    return collection.get({ source: 'default' }).pipe(
      map((actions) => {
        const data = [];
        actions.forEach((a) => {
          const item = a.data() as any;
          item.id = a.id;
          data.push(item);

        });
        return data;
      }),
    ).toPromise();

  }


  async ngOnInit() {
    this.itemCollection = this.afs.collection('items');
    this.items = await this.getData(this.itemCollection);



    //check if description is has more characters than, we us substring
    this.items.forEach((item) => {
      const desc = item.description ? (item.description.length <= 100 ? item.description : `${item.description.substring(0, 75)}...`) : '';
      item.description =  desc;
    })

    console.log(this.items)
  }

}
