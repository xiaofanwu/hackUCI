import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import {AngularFire} from 'angularfire2';

/*
  Generated class for the MyPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-page',
  templateUrl: 'my-page.html'
})
export class MyPagePage {
  class:any;
  questionNum:any;
  qtext:any
  qobj:any;
  answers:any;
  constructor(public navCtrl: NavController, public navParams: NavParams )
  {
    this.qobj = '';
    this.class=navParams.get('class');
    this.questionNum = navParams.get('question');
    console.log(this.questionNum);
    this.qtext=firebase.database().ref('/Classes/1/questions/'+this.questionNum);
    this.qtext.once('value',this.setValues,this)
    console.log('qtext',this.qtext);


  }

  setValues(snapshot){
    this.qobj=snapshot.val();
    this.answers=this.qobj.answers;
    console.log('answers',this.answers);
    console.log('qobj',this.qobj);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyPagePage');
  }

}
