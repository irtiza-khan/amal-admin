import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from 'app/components/confirm-dialog/confirm-dialog.component';
import { AuthService } from 'app/core/auth.service';
import { NotifyService } from 'app/core/notify.service';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-item-view-page',
  templateUrl: './item-view-page.component.html',
  styleUrls: ['./item-view-page.component.css']
})
export class ItemViewPageComponent implements OnInit {

  categories: any;
  menuForm: FormGroup;
  menuCol: AngularFirestoreCollection;
  wait: boolean;
  control: any;

  profileImg: string | ArrayBuffer;
  noImage = true;
  uploadTasks: any;
  sub: any;
  menuDoc: any;
  menu: any;



  constructor(private route: ActivatedRoute, private router: Router,
    private afs: AngularFirestore, private fb: FormBuilder,
    public auth: AuthService, private notify: NotifyService,
    private storage: AngularFireStorage, private dialog: MatDialog) { }

  buildForm() {
    this.menuForm = this.fb.group({
      'menuId': '',//
      'name': '',//
      'price': 0.00,//
      'imgUrl': '',//
      'categoryId': '',
      "webUrl": '',
      'description': '',
      'order': Number,
      'options': this.fb.array([])
    });
    this.control = <FormArray>this.menuForm.controls['options'];
  }

  addOptions() {
    this.control.push(this.fb.group({ 'title': '', 'price': 0.00 }));
  }
  removeOption(ind) {
    this.control.removeAt(ind);
  }

  uploadImg(event) {
    event = event.target.files[0];
    // this.status.profile = true;
    let reader = new FileReader();
    // use to display image in the html code
    reader.readAsDataURL(event);
    reader.onload = (_event) => {
      this.profileImg = reader.result;
    }
    // let type = '_profile'

    let filePath = '';

    filePath = `menu/${event.name}`;

    console.log(filePath);
    this.noImage = false;
    const ref = this.storage.ref(filePath);
    const task = ref.put(event);

    this.uploadTasks = { task: task, ref: ref };

  }

  // use to get image url 
  getImgUrl(se) {
    return new Promise(resolve => {
      this.uploadTasks.task.snapshotChanges().pipe(
        // The file's download URL
        finalize(async () => {
          let url = await this.uploadTasks.ref.getDownloadURL().toPromise();
          console.log(url);
          se.imgUrl = url;
          resolve('resolved');
        }),
      ).subscribe();

    });
  }


  async updateMenu() {
    const menu = this.menuForm.value;
    this.wait = true;
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Update Menu',
        message: 'Are you sure, you want to Update menu: ' + menu.name,
        operation: true
      }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.menuDoc.update(menu).then(() => {
          this.wait = false;
          this.noImage = true;
          this.router.navigate(['/menu'])
          this.notify.update('Menu Updated Successfully', 'success');
        })
          .catch(error => this.handleError(error));
      }
    });
    //if user uploaded the image then get image url and store in iif obj
    if (!this.noImage) {
      await this.getImgUrl(menu);
    }


  }

  deleteMenu() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Remove Menu',
        message: 'Are you sure, you want to remove menu: ' + this.menuForm.value.name,
        operation: false
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.menuDoc.delete().then(() => {
          this.wait = false;
          this.router.navigate(['/menu']);
          this.notify.update('Menu Deleted Successfully', 'info');
        })
          .catch(error => this.handleError(error));
      }
    });

  }

  private handleError(error: Error) {
    console.error(error);
    this.notify.update(error.message, 'error');
    throw new Error('Oh no!');
  }

  ngOnInit() {

    this.buildForm();
    this.sub = this.route.params.subscribe(params => {
      this.menuDoc = this.afs.collection('clients').doc('CB').collection('menu').doc(params.id);
      this.menuDoc.valueChanges().pipe(first()).subscribe(data => {
        this.menu = data;
        console.log(data);
        this.menuForm.patchValue(data);
        this.noImage = true;
        this.profileImg = data.imgUrl;
        data.options.forEach(element => {
          this.control.push(this.fb.group({ 'title': element.title, 'price': element.price }));
        });
        // console.log(this.menuForm);
      })

    });

    this.categories = this.afs.collection('clients').doc('CB').collection('categories').valueChanges();

  }

}
