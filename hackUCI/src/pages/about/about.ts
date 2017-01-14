import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFire} from 'angularfire2';
import { Geolocation } from 'ionic-native';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {


  rating:any
  item:any
  userID:any
  check:any

  constructor(public navCtrl: NavController, public af: AngularFire, private navParams: NavParams) {
    this.userID = this.af.auth.getAuth().uid;
  }

  Rating() {
    const itemObservable = this.af.database.object('/item');
    //console.log(itemObservable);
    //console.log(this.rating);
    this.item = this.af.database.object('/Classes/' + this.navParams.get('cid') + '/Students/'+this.userID+'/rating', { preserveSnapshot: true });
    this.item.set(this.rating);
    //this.item.subscribe(snapshot => {
    //  console.log(snapshot.key)
    //  console.log(snapshot.val())
    //});
  }

  checkIn() {
    Geolocation.getCurrentPosition().then((position) => {
      this.check = this.af.database.object('/Classes/' + this.navParams.get('cid') + '/Attendence/' + this.userID, { preserveSnapshot: true });
      this.check.set({"Date": new Date().toISOString(), "Lat":position.coords.latitude, "Long":position.coords.longitude});
    });
  }
}
