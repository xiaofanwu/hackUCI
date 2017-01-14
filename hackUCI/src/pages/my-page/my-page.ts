import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import {FIREBASE_PROVIDERS, defaultFirebase, AngularFire} from 'angularfire2';
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
  stuff:any;
  stud:any;
  userID:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public af:AngularFire)
  {
    this.qobj = '';
    this.class=navParams.get('class');
    this.questionNum = navParams.get('question');
    console.log(this.questionNum);
    this.qtext=firebase.database().ref('/Classes/'+this.class+'/questions/'+this.questionNum);
    this.qtext.once('value',this.setValues,this)
    console.log('qtext',this.qtext);
    this.stuff = af.database.list('/Classes/'+this.class+'/questions/'+this.questionNum+'/answers');
    console.log('stuff',this.stuff);


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

  submit(text){
    this.userID = this.af.auth.getAuth().uid;
    this.stud=firebase.database().ref('/Classes/'+this.class+'/questions/'+this.questionNum+'/answers/'+text+'/users/'+this.userID);
    this.stud.set('True');
    console.log(text);
    this.navCtrl.pop();
  }

}
