import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth.service';
import { NotifyService } from 'app/core/notify.service';
import { Observable } from 'rxjs';
import { finalize, map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-item-add-page',
  templateUrl: './item-add-page.component.html',
  styleUrls: ['./item-add-page.component.css']
})
export class ItemAddPageComponent implements OnInit {

  categories: any;
  menuForm: FormGroup;
  itemDoc: AngularFirestoreDocument<any>;
  wait: boolean = false;
  control: any;
  id: any;

  profileImg: string | ArrayBuffer;
  noImage = true;
  uploadTasks: any;



  constructor(private route: ActivatedRoute,
    private afs: AngularFirestore, private fb: FormBuilder,
    public auth: AuthService, private notify: NotifyService,
    private storage: AngularFireStorage, private router: Router) { }

  buildForm() {
    this.menuForm = this.fb.group({
      'category': ['', [Validators.required]],
      'name': ['', [Validators.required]],
      'price': [0.00, [Validators.required]],
      'imageUrl': '',
      'description': ['', [Validators.required]],
    });

  }


  get fromControl() {
    return this.menuForm.controls;
  }

  uploadImg(event) {
    event = event.target.files[0];

    // file size validation
    var _size = event.size / 1000000;
    if (_size > 1.5) {
      this.notify.update('Please Use an Image Smaller than 1.5 mb', 'error');
      return;
    }
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
          se.imageUrl = url;
          resolve('resolved');
        }),
      ).subscribe();

    });
  }


  async createMenu() {
    if (this.noImage) {
      this.notify.update('Menu Image  is Required', 'error');
      return;
    }
    const menu = this.menuForm.value;
    this.wait = true;
    try {
      if (!this.noImage) {
        await this.getImgUrl(menu);
      }
      menu.itemId = this.id;
      await this.itemDoc.set(menu)
      this.wait = false;
      this.buildForm();
      this.profileImg = null;
      //TODO: Route to Menu List page
      //this.router.navigate(['/menu'])
      this.notify.update('Menu Created Successfully', 'success');

    } catch (error) {
      this.handleError(error)
    }

  }

  private handleError(error: Error) {
    console.error(error);
    this.notify.update(error.message, 'error');
    throw new Error('Oh no!');
  }

  ngOnInit() {
    this.buildForm();
    this.id = this.afs.createId();
    //we have to get the list of stylists for the we will query all of the stylists
    this.itemDoc = this.afs.collection('items').doc(this.id);
  }

}
