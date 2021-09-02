import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { CustomService } from './customservice';
import { HTTP } from '@ionic-native/http';
import * as firebase from 'firebase';
import { AlertController } from 'ionic-angular';

//Plugins
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  firebasePlugin: any;
  rootPage: any;
  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public userService: UserServiceProvider,
    public splashScreen: SplashScreen,
    public zone: NgZone,
    public cs: CustomService,
    private http: HTTP,
    public alertCtrl: AlertController) {
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
  // }...............

  initializeApp() {
    this.platform.ready().then(() => {
      this.loginCheck()
      this.statusBar.styleLightContent();
    });
  }

  ionViewDidLoad() {

    // this.getToken();
  }


  loginCheck(){
    firebase.auth().onAuthStateChanged((user)=>{
      if(user) {   
        console.log(user)
        this.zone.run(()=>{
          this.firebasePlugin = (<any>window).FirebasePlugin;
          this.firebasePlugin.onMessageReceived(this.onMessageReceived.bind(this));
          setTimeout(()=>{
            this.getToken(user.uid);
          },3000)
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


  getToken(UID) {
    let currentUser = UID;
    console.log(this.firebasePlugin);
    
    this.firebasePlugin.getToken(token => {
      console.log(token)
      let data = {
        fcmToken: token
      }
      firebase.database().ref('users/' + currentUser + '/').update(data).then(()=>{
      })
    });
  }

  onMessageReceived(message){
    if (message.tap) { console.log(`Notification was tapped in the ${message.tap}`); }

    const alert = this.alertCtrl.create({
      title: 'Message received',
      subTitle: JSON.stringify(message),
      buttons: ['OK']
    });
    alert.present();
  }

 
}
