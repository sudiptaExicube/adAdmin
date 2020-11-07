import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CustomService } from './../../app/customservice';
import * as firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-admin-info',
  templateUrl: 'admin-info.html',
})
export class AdminInfoPage {

  info={
    email:'',
    website:'',
    Mobile:'',
    opening_time:'',
    address:''
  }

 
  constructor(public navCtrl: NavController, public navParams: NavParams, public cs: CustomService, ) {
    this.loadData()
  }

  loadData() {
    this.cs.presentLoadingDefault()
    firebase.database().ref('adminInfo/').once('value',(snap)=>{
      if(snap.val()){
        this.info = snap.val();
        this.cs.presentLoadingClose()
      }
    })
  }
 
  
  addNew() {
   if (!this.info.Mobile.trim()) {
      this.cs.presentToast('Please enter mobile number');
    } else if (!this.info.email.trim()) {
      this.cs.presentToast('Please enter email');
    } else if (!this.cs.EMAIL_VALID_CHECK.test(this.info.email.trim())) {
      this.cs.presentToast('Invalid email format');
    }  else if (!this.info.website.trim()) {
      this.cs.presentToast('Please enter website');
    } else if (!this.info.address.trim()) {
      this.cs.presentToast('Please enter office address');
    } else if (!this.info.opening_time.trim()) {
      this.cs.presentToast('Please Office opening time');
    }else{
      this.cs.presentLoadingDefault()
      firebase.database().ref('adminInfo/').update(this.info).then((res)=>{
        this.cs.presentLoadingClose()
        this.loadData()
        this.cs.presentToast('Contact Us info successfully updated');
        
      })
     
    }
  }
}
