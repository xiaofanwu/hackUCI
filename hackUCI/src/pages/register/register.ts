import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';

/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  registerCredentials = {email: '', password: ''};


  constructor(public navCtrl: NavController, public navParams: NavParams,public af: AngularFire) {}

    public register(){
	 	console.log("came to logi");
	 	console.log(this.registerCredentials);
		 	var email = "wuxiaofan1996@gmail.com";
		 	var password = "testdfddfdf";

		  this.af.auth.createUser(this.registerCredentials);

  	}


  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

}
