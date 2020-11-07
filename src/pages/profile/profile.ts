import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { CustomService } from './../../app/customservice';
//Plugins
import { HTTP } from '@ionic-native/http';
declare var require: any;
var convert = require('xml-js');

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userData: any = {
    fullname: '',
    username: '',
    email: '',
    website: '',
    state: '',
    city: '',
    password:''
  };
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: HTTP,
    public userService: UserServiceProvider,
    public cs: CustomService,
  ) {
    this.fetchUserData()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  fetchUserData() {
    this.cs.presentLoadingDefault()
    let authKey = localStorage.getItem('authKey')
    let username = localStorage.getItem('username')
    this.userService.fetchUser(authKey, username)
      .then(data => {
        if (data) {
          let xmlBodyData = data.data;
          console.log(xmlBodyData);
          var result = convert.xml2json(xmlBodyData, { compact: true });
          let rawJson = JSON.parse(result);
          let userDetails = rawJson.root.user;
          this.userData = {
            fullname: userDetails.fullname._cdata,
            username: userDetails.username._cdata,
            email: userDetails.email._cdata,
            website: userDetails.website._cdata,
            state: userDetails.state._cdata,
            city: userDetails.city._cdata,
            
          };
          console.log('userDetails');
          console.log(this.userData);
          this.cs.presentLoadingClose()
        }
      }).catch(error => {
        console.log('logout error')
        this.cs.presentLoadingClose()
      });
  }

  update() {
    if (!this.userData.fullname.trim()) {
      this.cs.presentToast('Fullname Can\'t be blank');
    } else if (!this.userData.username.trim()) {
      this.cs.presentToast('Username Can\'t be blank');
    } else if (!this.userData.email.trim()) {
      this.cs.presentToast('Email Can\'t be blank');
    } else {
      this.cs.presentLoadingDefault()
      this.userService.callForHashKey('Ivan@123')
        .then((response: any) => {
          if (response) {
            var authData = JSON.parse(response.data);
            if (authData) {
              let passphrase = authData.data.passphrase;
              let timeStamp = authData.data.time;
              let username = "ivan"
              //Get Admin authkey for new user registration
              this.userService.loginService(passphrase, timeStamp, username)
                .then(data => {
                  let xmlBodyData = data.data;
                  //console.log("success :", data);
                  let result = convert.xml2json(xmlBodyData, { compact: true });
                  let rawJson = JSON.parse(result);
                  let adminAuthKey = rawJson.root.auth._cdata;
                  if (adminAuthKey) {
                    let username = localStorage.getItem('username')
                    this.userService.updateUser(adminAuthKey, username, this.userData).then((response: any) => {
                      console.log(response);
                    //  var authData = JSON.parse(response.data);
                    this.cs.presentToast('Successfully updated');
                      this.cs.presentLoadingClose()
                    }).catch(error => {
                      this.cs.presentLoadingClose()
                      this.cs.presentToast('Update failed');
                    });
                  }
                }).catch(error => {
                  this.cs.presentLoadingClose()
                  console.log('admin handshake error')
                  //this.showAlert('Error', 'Ivalid Username or password');
                });
            }
          }
        })

    }
  }


}
