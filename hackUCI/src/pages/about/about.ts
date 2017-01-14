import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AngularFire} from 'angularfire2';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {


  rating:any
  item:any
  constructor(public navCtrl: NavController, public af: AngularFire) {
  }

  Rating(){
    const itemObservable = this.af.database.object('/item');
    console.log(itemObservable);
    console.log(this.rating);
    this.item = this.af.database.object('/item', { preserveSnapshot: true });
    this.item.set(this.rating);
    this.item.subscribe(snapshot => {
      console.log(snapshot.key)
      console.log(snapshot.val())
    });
  }

}
