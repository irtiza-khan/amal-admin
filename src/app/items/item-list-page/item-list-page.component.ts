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

  menuCollection: AngularFirestoreCollection<any>;
  login: any;
  userSub: any;
  menus: [any];
  activeCategory: string;
  categories: Observable<any[]>;
  catType = {};


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


  getCategories(): Observable<any[]> {
    return this.afs.collection('clients').doc('CB').collection('categories').valueChanges().pipe(
      map((data: any) => {
        console.log(data);
        data.forEach(element => {
          this.catType[element.categoryId] = element.name;
        });
        return data;

      })
    );
  }

  async ngOnInit() {
    this.activeCategory = 'all';
    this.categories = this.getCategories();
    this.menuCollection = this.afs.collection('clients').doc('CB').collection('menu');
    this.menus = await this.getData(this.menuCollection);
  }

}
