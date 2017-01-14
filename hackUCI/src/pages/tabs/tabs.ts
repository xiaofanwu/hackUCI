import { Component } from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  // tab1Root: any = HomePage;
  // tab2Root: any = AboutPage;
  // tab3Root: any = ContactPage;
  userID: any
  classes: FirebaseListObservable<any>;
  enroll: any;
  courseCode = {cc:''}

  constructor(public navCtrl: NavController, public af: AngularFire) {
  	this.classes = af.database.list('/Users/' + this.af.auth.getAuth().uid + '/Enrolled');
  	console.log(this.classes)
  }

  classSelect(cid:any) {
  	this.navCtrl.push(AboutPage, {
  		cid:cid
  	});
  }

  classEnroll(cid:any) {
  	this.userID = this.af.auth.getAuth().uid;
    this.enroll = this.af.database.list('/Users/' + this.userID + '/Enrolled/').push('new enrollment');
    //console.log(this.courseCode.cc);
    this.enroll.set(this.courseCode.cc);
  }
}
