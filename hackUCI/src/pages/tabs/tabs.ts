import { Component } from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { NavController } from 'ionic-angular';
import { ModalController,Modal } from 'ionic-angular';
import { AddClassPage } from '../add-class/add-class';
import {LoginPage} from "../login/login";

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
  classesAvailable: FirebaseListObservable<any>;
  enroll: any;
  selected:String;
  classesCanEnroll: string[] = [];
  courseCode = {cc:''}
  classEnrolled:string[] = [];

  constructor(public navCtrl: NavController, public af: AngularFire,public modalCtrl: ModalController) {
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

  presentModal() {
    console.log("added moda;");
    let modal = this.modalCtrl.create(AddClassPage);
    // this.navCtrl.present(modal);

    modal.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ***********');
  }

  showSelectValue(mySelect) {
    this.selected = mySelect;
  }
  deleteClass(cid:any){
    console.log("delete does not work");
    let toBeDeleted = this.af.database.object('/Users/' + this.userID + '/Enrolled');

  }


  logout(){
    console.log("here,logout");
    this.af.auth.logout();
    this.navCtrl.push(LoginPage);
  }

  classSelect(cid:any) {
  	this.navCtrl.push(AboutPage, {
  		cid:cid
  	});
  }

  classEnroll(cid:any) {
  	this.userID = this.af.auth.getAuth().uid;
    this.enroll = this.af.database.list('/Users/' + this.userID + '/Enrolled');

    // this.enroll = this.af.database.list('/Users/' + this.userID + '/Enrolled/').push('new enrollment');
    //console.log(this.courseCode.cc);
    this.enroll.push(this.selected);

    // this.enroll.set(this.selected);
    this.navCtrl.push(AboutPage, {
      cid:this.selected
    });
  }
}
