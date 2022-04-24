import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
} from '@angular/fire/firestore';
import { NotifyService } from './notify.service';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface User {
  uid: string;
  email?: string | null;
  name?: string | null;
  role?: string;
}

@Injectable()
export class AuthService {
  user: Observable<User | null>;
  public email: string;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private notify: NotifyService
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc(`admin/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })

    );
  }




  emailLogin(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        this.email = email;
        this.notify.update('Welcome back!', 'success');
        return this.afs.doc(
          `admin/${credential.user.uid}`
        ).get().toPromise();
      })
      .catch(error => this.handleError(error));
  }


  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  // If error, console log and notify user
  private handleError(error: Error) {
    console.log('In Handle Error Function')
    console.error(error);
    this.notify.update(error.message, 'error');

  }


}
