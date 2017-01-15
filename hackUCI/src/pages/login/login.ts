import { Component } from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import { NavController, AlertController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  registerCredentials = {email: '', password: ''};


  constructor(public navCtrl: NavController, public af: AngularFire, public alertCtrl: AlertController) {

  }


 	public login(){
 		this.af.auth.login(this.registerCredentials,{
		  provider: AuthProviders.Password,
		  method: AuthMethods.Password,
		}).then(
        (success) => {
        console.log(success);
		this.navCtrl.push(TabsPage);
      }).catch(
        (err) => {
        	let alert = this.alertCtrl.create({
		      title: 'Something is wrong!',
		      subTitle: err.message,
		      buttons: ['OK']
		    });
		    alert.present();

        console.log(err);
      })
  	}
 
  	public register(){

  	this.navCtrl.push(RegisterPage);


  	}

}
