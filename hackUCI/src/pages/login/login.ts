import { Component } from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import { NavController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  registerCredentials = {email: '', password: ''};


  constructor(public navCtrl: NavController, public af: AngularFire) {

  }


 	public login(){
 		this.af.auth.login({
		  email: 'wuxiaofan1996@gmail.com',
		  password: 'testdfddfdf',
		},
		{
		  provider: AuthProviders.Password,
		  method: AuthMethods.Password,
		});
		this.navCtrl.push(TabsPage);


  	}
 
  	public register(){
  	this.navCtrl.push(RegisterPage);
 	console.log("came to logi");
 	console.log(this.registerCredentials);
	 	var email = "wuxiaofan1996@gmail.com";
	 	var password = "testdfddfdf";

	  this.af.auth.createUser(this.registerCredentials);

  	}

}
