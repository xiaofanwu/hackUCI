import { Component } from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import { NavController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  registerCredentials = {email: '', password: ''};


  constructor(public navCtrl: NavController, public af: AngularFire) {

  }


 	public login(){
 	console.log("came here");
 		this.af.auth.login(this.registerCredentials,
		{
		  provider: AuthProviders.Password,
		  method: AuthMethods.Password,
		});
		this.navCtrl.push(TabsPage);

  	}
 
  	public register(){

  	this.navCtrl.push(RegisterPage);


  	}

}
