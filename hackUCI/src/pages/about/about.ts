import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AngularFire} from 'angularfire2';
import {LoginPage} from "../login/login";
import {MyPagePage} from "../my-page/my-page";
import firebase from 'firebase'

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {


  rating:any
  item:any
  userID:any
  question:any
  constructor(public navCtrl: NavController, public af: AngularFire) {
    this.question=firebase.database().ref('/Classes/1/current');
    this.question.on("value",this.onChange,this);
  }



  Rating(){
    const itemObservable = this.af.database.object('/item');
    //console.log(itemObservable);
    //console.log(this.rating);
    this.userID = this.af.auth.getAuth().uid;
    this.item = this.af.database.object('/Classes/1/Students/'+this.userID+'/rating', { preserveSnapshot: true });
    this.item.set(this.rating);
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
      this.navCtrl.push(MyPagePage,{'class':1,'question':1});
    }
  }

}
