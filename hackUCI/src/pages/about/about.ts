import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFire} from 'angularfire2';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {


  rating:any
  item:any
  userID:any
  constructor(public navCtrl: NavController, public af: AngularFire, private navParams: NavParams) {
  }

  Rating(){
    const itemObservable = this.af.database.object('/item');
    //console.log(itemObservable);
    //console.log(this.rating);
    this.userID = this.af.auth.getAuth().uid;
    this.item = this.af.database.object('/Classes/' + this.navParams.get('cid') + '/Students/'+this.userID+'/rating', { preserveSnapshot: true });
    this.item.set(this.rating);
    //this.item.subscribe(snapshot => {
    //  console.log(snapshot.key)
    //  console.log(snapshot.val())
    //});
  }

}
