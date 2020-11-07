import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//Plugins
import { HTTP } from '@ionic-native/http';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { CustomService } from './../../app/customservice';

declare var require: any;
var convert = require('xml-js');

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  newUser = {
    fullname: '',
    email: '',
    username: '',
    password: '',
    confpassword: ''
  }
  constructor(
    public navCtrl: NavController,
    private http: HTTP,
    public navParams: NavParams,
    public cs: CustomService,
    public userService: UserServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  signupFunc() {
    if (!this.newUser.fullname.trim()) {
      this.cs.presentToast('Fullname Can\'t be blank'); 
    } else if (!this.newUser.username.trim()) {
      this.cs.presentToast('Username Can\'t be blank'); 
    } else if (!this.newUser.email.trim()) {
       this.cs.presentToast('Email Can\'t be blank');
    } else if (!this.cs.EMAIL_VALID_CHECK.test(this.newUser.email.trim())) {
      this.cs.presentToast('Invalid email format');
    } else if (this.newUser.password == '' || this.newUser.password == undefined || this.newUser.password == null) {
      this.cs.presentToast('Password Can\'t be blank');
    } else if (this.newUser.confpassword == '' || this.newUser.confpassword == undefined || this.newUser.confpassword == null) {
      this.cs.presentToast('Confrim password Can\'t be blank');
    } else if (this.newUser.confpassword != this.newUser.password) {
      this.cs.presentToast('Password and Confrim password does\'t match');
    } else {
      this.cs.presentLoadingDefault()
      //Get passphrase and timestamp
      this.userService.callForHashKey('Ivan@123')
        .then((response:any) => {
          if (response) {
            var authData = JSON.parse(response.data);
            if (authData) {
              let passphrase = authData.data.passphrase;
              let timeStamp = authData.data.time;
              let username = "ivan"
              //Get Admin authkey for new user registration
              this.userService.loginService(passphrase,timeStamp,username)  
              .then(data => {
                  let xmlBodyData = data.data;
                  //console.log("success :", data);
                  let result = convert.xml2json(xmlBodyData, { compact: true });
                  let rawJson = JSON.parse(result);
                  let adminAuthKey = rawJson.root.auth._cdata;
                  if (adminAuthKey) {
                    //generate password key hash 
                    this.userService.callForHashKey(this.newUser.password)
                      .then((res:any) => {
                        if (res) {
                          let keyData = JSON.parse(res.data);
                          if (keyData) {
                            let md5Password = keyData.data.key
                            //Start registration
                            this.userService.signUpService(adminAuthKey, this.newUser.username, md5Password, this.newUser.email, this.newUser.fullname)
                              .then(data => {
                                let regExamData = data.data;
                                this.cs.presentLoadingClose()
                                this.navCtrl.setRoot("LoginPage")
                                this.cs.presentToast('Registration successfull');
                              }).catch(error => {
                                this.cs.presentLoadingClose()
                                this.cs.presentToast('Registration unsuccessfull');
                              });
                          }
                        }
                      })
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
    //this.navCtrl.setRoot("HomePage")
  }

}
