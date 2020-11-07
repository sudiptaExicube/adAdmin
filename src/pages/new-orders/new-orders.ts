import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { CustomService } from './../../app/customservice';
import { CallNumber } from '@ionic-native/call-number';
@IonicPage()
@Component({
  selector: 'page-new-orders',
  templateUrl: 'new-orders.html',
})
export class NewOrdersPage {
  public newOrders=[];
  searchItem:any;
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public cs: CustomService,
     private callNumber: CallNumber,
     public alertCtrl: AlertController) {
       this.loadOrders()
    }
  
    loadOrders() {
      console.log('ionViewDidLoad UserListPage');
      this.cs.presentLoadingDefault()
      firebase.database().ref('bookings/').on('value',(snap)=>{
        if(snap.val()){
          let bookings = snap.val();
          this.newOrders = [];
          for(let key in bookings){
            bookings[key].key = key
           if(bookings[key].bookingStatus == 'PENDING'){
              this.newOrders.push(bookings[key]);
              //console.log(this.newOrders)
            }
          }
          if(this.newOrders){
            this.searchItem = this.newOrders;
            this.searchItem.sort(this.sortFunction);
            console.log( this.searchItem)
            this.cs.presentLoadingClose()
          }
        }
      })
    }
    sortFunction(a,b){  
      var dateA = new Date(a.bookingTimeStamp).getTime();
      var dateB = new Date(b.bookingTimeStamp).getTime();
      return dateA > dateB ? 1 : -1;  
  };
    getItems(ev: any) {
      // this.searchItem = this.newOrders
      const val = ev.target.value;
      console.log(val)
      if (val && val.trim() != '') {
         //this.newOrders=this.searchItem.filter()
        this.newOrders=this.searchItem.filter((item) => {
          return (item.bookingId.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
        
      }else{
        this.loadOrders();
      }
    }

    callnow(mobile){
      this.callNumber.callNumber(mobile, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
    }
    orderDetails(i){  
      this.navCtrl.push('OrderDetailsPage',{orderparam:{uid:this.newOrders[i].userUId,orderid:this.newOrders[i].key}})
    }
  }