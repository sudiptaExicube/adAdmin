import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import {UserServiceProvider} from '../../providers/user-service/user-service';
import { CustomService } from './../../app/customservice';
import { StarRatingModule } from 'ionic3-star-rating';
import { Events } from 'ionic-angular';
import * as firebase from 'firebase';
import { AdMobFree, AdMobFreeBannerConfig,AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig} from '@ionic-native/admob-free';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  itemtype: any = "AD Admin "
  MonthlyIncome:any;
  today:any;
  bookings :any;
  thirtyDaysBookings :any;

  //Banner

  //Interstitial Ad's Configurations
  /*interstitialConfig: AdMobFreeInterstitialConfig = {
    isTesting: true, // Remove in release version
    autoShow: false,
    id: "ca-app-pub-39402XXXXXXXX2544/6300978111"
  };

  //Reward Video Ad's Configurations
  RewardVideoConfig: AdMobFreeRewardVideoConfig = {
    isTesting: true, // Remove in release version
    autoShow: false,
    id: "ca-app-pub-3940XXXXXXX42544/6300978111"
  };*/
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public zone: NgZone,
    private media: Media,
    public loadingCtrl: LoadingController,
    public cs: CustomService,
    public events: Events,
    private admobFree: AdMobFree
   
  ) {
    this.MonthlyIncome = 0;
    this.today = 0;
    this.calculateIncome()
  }
  BannerAd() {
    let  bannerConfig: AdMobFreeBannerConfig = {
      isTesting: false, // Remove in release version
      autoShow: true,
      id: "ca-app-pub-2777794657211524/5344070337"
    };

    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare().then(() => {
      // success
    }).catch(e => alert(e));
  }
  
  ionViewDidLoad() {
  var array = [{id: 1, dates: "Tue Jun 22 2020 05:30:00 GMT+0530 (India Standard Time)"},{id: 2, dates: "Fri Jun 2 2020 05:30:00 GMT+0530 (India Standard Time)"}];
  array.sort(this.sortFunction);
  console.log(array)
  setTimeout(() => {
    this.BannerAd();
  }, 9000);
  
  }
   sortFunction(a,b){  
    var dateA = new Date(a.dates).getTime();
    var dateB = new Date(b.dates).getTime();
    return dateA > dateB ? 1 : -1;  
};
  doaction(page){
    this.navCtrl.push(page)
  }
  earningDetails(page,type){
    if(type == 'todays'){
      this.navCtrl.push(page,{orderparam:this.bookings})
    }else{
      this.navCtrl.push(page,{orderparam:this.thirtyDaysBookings})
    }
   
  }
    calculateIncome() {
      this.bookings = [];
      this.thirtyDaysBookings = [];
      firebase.database().ref('bookings/').once('value',(snap)=>{
        console.log('userDetails',snap.val());
        if(snap.val()) {
          let allOrders = snap.val();
          let income = 0;
          let thirtyDaysIncome = 0;
          let pastDate = new Date(new Date().setDate(new Date().getDate() - 30));
          let pasteTimestap = pastDate.getTime();
          let todayTimestamp = new Date().getTime();
  
          for(let key in allOrders) {
            allOrders[key].uid = key;
            if(allOrders[key].bookingStatus == 'END'){
              let creationDate = new Date(allOrders[key].orderCreatedDate);
              let creationTimestamp = creationDate.getTime();
             // console.log("creationDate", creationDate.toDateString());
              
              if(creationDate.toDateString() == new Date().toDateString()) {
                income = income + allOrders[key].orderPrice;
                this.bookings.push(allOrders[key]);
              }
    
              if(creationTimestamp <= todayTimestamp && creationTimestamp > pasteTimestap) {
                thirtyDaysIncome = thirtyDaysIncome + allOrders[key].orderPrice;
                this.thirtyDaysBookings.push(allOrders[key]);
              }
              //console.log(this.bookings, income, this.thirtyDaysBookings, thirtyDaysIncome);
              this.MonthlyIncome = thirtyDaysIncome;
              this.today = income
            }
          }     
        }
      })
    }
  
}
