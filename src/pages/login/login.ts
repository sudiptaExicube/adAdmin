import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { CustomService } from './../../app/customservice';
import * as firebase from 'firebase';
//Plugins
import { HTTP } from '@ionic-native/http';
declare var require: any;
var convert = require('xml-js');

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email: any = "";
  password: any = "";
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserServiceProvider,
    public cs: CustomService, ) {
  }

  loginUser() {
    if (!this.email.trim()) {
      this.cs.presentToast('Email Can\'t be blank');
   } else if (!this.cs.EMAIL_VALID_CHECK.test(this.email.trim())) {
     this.cs.presentToast('Invalid email format');
   } else if (!this.password.trim()) {
      this.cs.presentToast('Password Can\'t be blank');
    }else if(this.password.trim().length < 6) {
      this.cs.presentToast('Password field must be at least 6 characters in length.');
    } else {
      this.cs.presentLoadingDefault()
     // 
     firebase.auth().signInWithEmailAndPassword(this.email,this.password).then(()=>{
      this.navCtrl.setRoot("HomePage");
      this.cs.presentLoadingClose()
     }).catch((err)=>{
      this.cs.presentToast(err);
      this.cs.presentLoadingClose()
     })
     
    }
  }

}
