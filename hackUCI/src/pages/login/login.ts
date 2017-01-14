import { Component } from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {

  }

}
