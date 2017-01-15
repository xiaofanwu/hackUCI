import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { ModalController,Modal } from 'ionic-angular';
/*
  Generated class for the AddClass page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-class',
  templateUrl: 'add-class.html'
})
export class AddClassPage {

  userID: any
  classes: FirebaseListObservable<any>;
  classesAvailable: FirebaseListObservable<any>;
  enroll: any;
  selected:String;
  classesCanEnroll: string[] = [];
  courseCode = {cc:''}
  classEnrolled:string[] = [];


  constructor(public navCtrl: NavController, public af: AngularFire, public navParams: NavParams,public viewCtrl: ViewController
) {

  	this.classes = af.database.list('/Users/' + this.af.auth.getAuth().uid + '/Enrolled');
    this.classesAvailable = af.database.list('/Classes');

    af.database.list('/Users/' + this.af.auth.getAuth().uid + '/Enrolled', { preserveSnapshot: true})
    .subscribe(snapshots=>{
        snapshots.forEach(snapshot => {
          this.classEnrolled.push(snapshot.val());
         
        });
    })
    console.log(this.classEnrolled,"classava enrolled******");

    this.classesCanEnroll=[];
    af.database.list('/Classes', { preserveSnapshot: true})
    .subscribe(snapshots=>{
        snapshots.forEach(snapshot => {
          //if the class is already enrolled, do nothing
          if (this.classEnrolled.indexOf(snapshot.key)==-1){
            this.classesCanEnroll.push(snapshot.key);
          }
        });
    })
    console.log(this.classesCanEnroll);
    console.log("after this********");

    // for (let entry of this.classes) {
    // console.log(entry); // 1, "string", false
    // }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddClassPage');
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }

  classSelect(cid:any) {
  	this.navCtrl.push(AboutPage, {
  		cid:cid
  	});
  }

   showSelectValue(mySelect) {
    this.selected = mySelect;
  }


  classEnroll(cid:any) {
  	this.userID = this.af.auth.getAuth().uid;
    this.enroll = this.af.database.list('/Users/' + this.userID + '/Enrolled');

    // this.enroll = this.af.database.list('/Users/' + this.userID + '/Enrolled/').push('new enrollment');
    //console.log(this.courseCode.cc);
    this.enroll.push(this.selected);
    this.viewCtrl.dismiss();

    // this.enroll.set(this.selected);

    // this.navCtrl.push(AboutPage, {
    //   cid:this.selected
    // });
  }


}
