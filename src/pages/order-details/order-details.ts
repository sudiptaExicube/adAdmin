import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { CustomService } from './../../app/customservice';
import { AlertController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import {UserServiceProvider} from '../../providers/user-service/user-service';

@IonicPage()
@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html',
})
export class OrderDetailsPage {
  bookingdata: any = {};
  originalname: any;
  orderp: any;

  constructor(public navCtrl: NavController, private callNumber: CallNumber, public alertCtrl: AlertController, public navParams: NavParams, public cs: CustomService, public userService: UserServiceProvider,) {

    if (this.navParams.get('orderparam')) {
      this.cs.presentLoadingDefault()
      this.orderp = this.navParams.get('orderparam');
      this.loadOrderDetails(this.orderp.orderid)
      console.log(this.orderp)
      firebase.database().ref('users/' + this.orderp.uid + '/').once('value', (snaps) => {
        if (snaps.val()) {
          this.originalname = snaps.val().firstName + ' ' + snaps.val().lastName;
          console.log(this.originalname)
        }
      })
    }
  }

  increseQty(order, bookingdata, index) {
    console.log(order)
    console.log(bookingdata);
    console.log(index)
    console.log(this.orderp.orderid);
    firebase.database().ref('bookings/' + this.orderp.orderid + '/orders/' + index + '/').update({
      qty: order.qty + 1,
      subcat_price: order.subcat_price + order.original_price
    }).then(() => {
      var totalCartValue = 0;
      for (var i = 0; i < this.bookingdata.orders.length; i++) {
        totalCartValue = totalCartValue + this.bookingdata.orders[i].subcat_price;
        console.log(this.bookingdata.orders[i].subcat_price)
      }
      if (totalCartValue) {
        firebase.database().ref('bookings/' + this.orderp.orderid + '/').update({
          orderPrice: totalCartValue
        }).then(() => {
          firebase.database().ref('users/' + this.orderp.uid + '/my_booking/' + this.orderp.orderid + '/orders/' + index + '/').update({
            qty: this.bookingdata.orders[index].qty,
            subcat_price: this.bookingdata.orders[index].subcat_price
          }).then(() => {
            firebase.database().ref('users/' + this.orderp.uid + '/my_booking/' + this.orderp.orderid + '/').update({
              orderPrice: this.bookingdata.orderPrice
            })
          })
        })
      }

    })
  }
  decreseQty(order, bookingdata, index) {
    console.log(order)
    console.log(bookingdata);
    console.log(index)
    console.log(this.orderp.orderid);
    if (order.qty > 1) {
      firebase.database().ref('bookings/' + this.orderp.orderid + '/orders/' + index + '/').update({
        qty: order.qty - 1,
        subcat_price: order.subcat_price - order.original_price
      }).then(() => {
        var totalCartValue = 0;
        for (var i = 0; i < this.bookingdata.orders.length; i++) {
          totalCartValue = totalCartValue + this.bookingdata.orders[i].subcat_price;
          console.log(this.bookingdata.orders[i].subcat_price)
        }
        if (totalCartValue) {
          firebase.database().ref('bookings/' + this.orderp.orderid + '/').update({
            orderPrice: totalCartValue
          }).then(() => {
            firebase.database().ref('users/' + this.orderp.uid + '/my_booking/' + this.orderp.orderid + '/orders/' + index + '/').update({
              qty: this.bookingdata.orders[index].qty,
              subcat_price: this.bookingdata.orders[index].subcat_price
            }).then(() => {
              firebase.database().ref('users/' + this.orderp.uid + '/my_booking/' + this.orderp.orderid + '/').update({
                orderPrice: this.bookingdata.orderPrice
              })
            })
          })
        }

      })
    } else {
      this.cs.presentToast('Sorry!! you are reached maximum decrease limit');
    }
  }
  deleteItem(index) {
    const confirm = this.alertCtrl.create({
      title: 'Alert?',
      message: 'Are you sure to delete this item?',
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
            var orderItem = this.bookingdata.orders;
            console.log(index)
            if (orderItem.length > 1) {

              firebase.database().ref('bookings/' + this.orderp.orderid + '/').update({
                orderPrice: this.bookingdata.orderPrice - this.bookingdata.orders[index].subcat_price
              }).then(() => {
                firebase.database().ref('users/' + this.orderp.uid + '/my_booking/' + this.orderp.orderid + '/').update({
                  orderPrice: this.bookingdata.orderPrice
                })
              }).then(() => {
                orderItem.splice(index, 1);
                console.log(orderItem)
                firebase.database().ref('bookings/' + this.orderp.orderid + '/orders/').set(orderItem).then(() => {
                }).then(() => {
                  console.log(orderItem)
                  firebase.database().ref('users/' + this.orderp.uid + '/my_booking/'+ this.orderp.orderid+'/orders/').set(orderItem)
                }).then(() => {
                  this.cs.presentToast('Item successfully deleted');
                })
              })
            } else {
              this.cs.presentToast('Sorry!! you can\'t delete this order');
            }
          }
        }
      ]
    });
    confirm.present();
  }
  callnow(mobile) {
    this.callNumber.callNumber(mobile, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
  loadOrderDetails(orderId) {
    console.log(orderId)
    firebase.database().ref('bookings/' + orderId).on('value', (snap) => {
      if (snap.val()) {
        this.bookingdata = snap.val();
        console.log(this.bookingdata);
        this.cs.presentLoadingClose()
      }
    })
  }

  changeStatus(STATUS, msg) {
    //START
    //ACCEPTED
    //END
    //PENDING

    const confirm = this.alertCtrl.create({
      title: 'Alert?',
      message: 'Are you sure to ' + msg + ' the service?',
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
            // this.cs.presentLoadingDefault()
            firebase.database().ref('bookings/' + this.orderp.orderid + '/').update({
              bookingStatus: STATUS
            }).then(() => {
              firebase.database().ref('users/' + this.orderp.uid + '/my_booking/' + this.orderp.orderid + '/').update({
                bookingStatus: STATUS
              }).then(() => {
                this.sendPush(this.orderp.uid, STATUS);
                
                this.cs.presentToast('Service ' + msg + ' Successfully');
                STATUS == 'ACCEPTED' ? this.navCtrl.pop() : null
              })
            })
          }
        }
      ]
    });
    confirm.present();
  }

  sendPush(userId, STATUS) {
    firebase.database().ref('users/' + userId + '/fcmToken/').once('value', (snap) => {
      if (snap.val()) {
        let fcmToken = snap.val();
        console.log(fcmToken);
        
        this.userService.sendPushNotification(fcmToken, STATUS)
        .then((res)=>{
          console.log(res);
        })
        .catch((e)=>console.log(e)
        );
      }
    });
  }

  paynow() {
    this.cs.presentLoadingDefault()
    const confirm = this.alertCtrl.create({
      title: 'Alert?',
      message: 'Are you received full cash payment?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes I Received',
          handler: () => {
            firebase.database().ref('bookings/' + this.orderp.orderid + '/').update({
              paymentStatus: 'PAID'
            }).then(() => {
              firebase.database().ref('users/' + this.orderp.uid + '/my_booking/' + this.orderp.orderid + '/').update({
                paymentStatus: 'PAID'
              }).then(() => {
                this.cs.presentLoadingClose()
                this.cs.presentToast('Payment Submited');
              })
            })
          }
        }
      ]
    });
    confirm.present();
  }

  reschedule() {
    this.navCtrl.push('ReschedulePage', { bookingData: this.bookingdata, orderIDS: this.orderp })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailsPage');
  }

}
