import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { CustomService } from './../../app/customservice';
import { CallNumber } from '@ionic-native/call-number';

@IonicPage()
@Component({
  selector: 'page-user-list',
  templateUrl: 'user-list.html',
})
export class UserListPage {
  public users=[];
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public cs: CustomService,
     private callNumber: CallNumber,
      public alertCtrl: AlertController
    ) {
    this.loadUsers()
  }

  loadUsers() {
    console.log('ionViewDidLoad UserListPage');
    this.cs.presentLoadingDefault()
    firebase.database().ref('users/').once('value',(snap)=>{
      if(snap.val()){
        let users = snap.val();
        this.users = [];
        for(let key in users){
          users[key].key = key
          if(users[key].type != 'admin'){
            this.users.push(users[key]);
            console.log(this.users)
          }
        }
        if(this.users){
          this.cs.presentLoadingClose()
        }
      }
    })
  }
  callnow(mobile){
    this.callNumber.callNumber(mobile, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }
  
  disableUserToggle(index,type){
    let actionType=type == true?'BLOCK':'UNBLOCK'
    const confirm = this.alertCtrl.create({
      title: 'Alert?',
      message: 'Are you sure to '+actionType+' the user?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Confim',
          handler: () => {
            this.cs.presentLoadingDefault()
              if(this.users[index].active == true){
                firebase.database().ref('users/' + this.users[index].key + '/').update({
                  active:false
                }).then(()=>{
                  this.cs.presentLoadingClose()
                  this.loadUsers()
                  this.cs.presentToast('User '+ actionType +' successfully');
                })
              }else{
                firebase.database().ref('users/' + this.users[index].key + '/').update({
                  active:true
                }).then(()=>{
                  this.cs.presentLoadingClose()
                  this.loadUsers()
                  this.cs.presentToast('User '+ actionType +' successfully');
                })
              }
            
          }

        }
      ]
    });
    confirm.present();
  }
}
