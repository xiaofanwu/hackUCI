import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FIREBASE_PROVIDERS, defaultFirebase, AngularFire} from 'angularfire2';
import {LoginPage} from "../login/login";
import {MyPagePage} from "../my-page/my-page";
import firebase from 'firebase'
import { Geolocation } from 'ionic-native';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {


  rating:any
  ratingTimestamp: any
  ratingItem:any
  userID:any
  question:any
  check:any
  stud:any
  constructor(public navCtrl: NavController, public af: AngularFire,private navParams: NavParams) {
    this.question=firebase.database().ref('/Classes/'+this.navParams.get('cid')+'/current');
    this.question.on("value",this.onChange,this);
    this.userID = this.af.auth.getAuth().uid;
    this.stud=firebase.database().ref('/Classes/' + this.navParams.get('cid') + '/Students/'+this.userID+'/rating')
    this.stud.once("value",function(snapshot){this.rating=snapshot.val()},this);

  }

  Rating() {
    const itemObservable = this.af.database.object('/item');
    //console.log(itemObservable);
    //console.log(this.rating);
    this.ratingItem = this.af.database.object('/Classes/' + this.navParams.get('cid') + '/Students/'+this.userID+'/rating', { preserveSnapshot: true });
    this.ratingItem.set(this.rating);
	
	this.ratingTimestamp = this.af.database.object('/Classes/' + this.navParams.get('cid') + '/Students/' + this.userID + '/timestamp', {preserveSnapshot: true});
	this.ratingTimestamp.set(Date.now() / 1000);
	
    //this.item.subscribe(snapshot => {
    //  console.log(snapshot.key)
    //  console.log(snapshot.val())
    //});
  }

  logout(){
    console.log("here");
    this.af.auth.logout();
    this.navCtrl.push(LoginPage);
  }

  onChange(snapshot){
    console.log("We Made It");
    if(snapshot.val()!=null) {
      console.log("snapstuff",snapshot.val());
      this.navCtrl.push(MyPagePage,{'class':this.navParams.get('cid'),'question':snapshot.val()});
    }
  }

  checkIn() {
    Geolocation.getCurrentPosition().then((position) => {
      console.log(position.coords.latitude,"position!!!!");

      this.check = this.af.database.object('/Classes/' + this.navParams.get('cid') + '/Attendence/' + this.userID, { preserveSnapshot: true });
      this.check.set({"lat":position.coords.latitude, "lng":position.coords.longitude});
    }, (err) => {
      console.log(err);
    });
  }
}
