import { Component } from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = AboutPage;
  tab3Root: any = ContactPage;

  classes: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public af: AngularFire) {
  	this.classes = af.database.list('/Users/' + this.af.auth.getAuth().uid + '/Enrolled');
  	console.log(this.classes)
  }

  classSelect(cid:any) {
  	this.navCtrl.push(AboutPage, {
  		cid:cid
  	});
  }
}
