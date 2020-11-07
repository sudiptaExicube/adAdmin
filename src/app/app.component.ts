import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { CustomService } from './customservice';
import { HTTP } from '@ionic-native/http';
import * as firebase from 'firebase';


//Plugins
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public userService: UserServiceProvider,
    public splashScreen: SplashScreen,
    public zone: NgZone,
    public cs: CustomService,
    private http: HTTP) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: "HomePage" },
      { title: 'Manage Complete Orders', component: "OldOrdersPage" },
      { title: 'Show All users', component: "UserListPage" },
      { title: 'Edit Contact Info', component: "AdminInfoPage" },
    ];
  }

  // initializeApp() {
  //   this.splashScreen.hide();
  //   this.platform.ready().then(() => {
  //       this.loginCheck()
  //       this.statusBar.styleBlackOpaque();
  //   });
  // }

  initializeApp() {
    this.platform.ready().then(() => {
      this.loginCheck()
      this.statusBar.styleLightContent();
    });
  }
loginCheck(){
  firebase.auth().onAuthStateChanged((user)=>{
    if(user) {     
      console.log(user);
      this.zone.run(()=>{
        this.splashScreen.hide();
      this.rootPage = "HomePage"
    })
     /* firebase.database().ref('users/'+user.uid).once('value',(snap)=>{
        if(snap.val()){
          let users = snap.val();
          if(users.type='admin'){
            this.zone.run(()=>{
              this.splashScreen.hide();
            this.rootPage = "HomePage"
          })
          }
        }else{
          this.logOut();
        }*/
     
   // })
     
    }
    else {
      this.zone.run(()=>{
        this.splashScreen.hide();
        this.rootPage = "LoginPage";
      console.log('no user')
      })
    }
  })
}

logOut(){
  firebase.auth().signOut().then(()=>{
    this.zone.run(()=>{
    this.rootPage = "LoginPage";
    })
  });
}
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

 
}