import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { CustomService } from './../../app/customservice';
import { AlertController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-reschedule',
  templateUrl: 'reschedule.html',
})
export class ReschedulePage {
  TimeSlots: any;
  bookingDate: any;
  currentDate: any;
  maxdate: any;
  selectedTime: any;
  orderp: any;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public cs: CustomService, ) {
    this.TimeSlots = [{ time: '9:00 AM - 12:00 PM', active: false }, { time: '12:00 PM - 03:00 PM', active: false }, { time: '03:00 PM - 06:00 PM', active: false }, { time: '06:00 PM - 09:00 PM', active: false }]
    console.log(this.TimeSlots)
    var d = new Date();
    let date = d.getDate() > 10 ? d.getDate() : '0' + d.getDate()
    let mm = d.getMonth() + 1;
    let month = mm > 10 ? mm : '0' + mm
    let year = d.getFullYear();
    this.currentDate = year + '-' + month + '-' + date;
    this.bookingDate = year + '-' + month + '-' + date;
    this.maxdate = year + '-' + '12' + '-' + '31';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReschedulePage');
    if (this.navParams.get('bookingData')) {
      this.orderp = this.navParams.get('bookingData');
      this.bookingDate = this.orderp.bookingDate;
      this.selectedTime = this.orderp.bookingTime;
      console.log(this.selectedTime)
      for (let i = 0; i < this.TimeSlots.length; i++) {
        if ( this.TimeSlots[i].time ==  this.orderp.bookingTime) {
          this.TimeSlots[i].active = true;
        }
      }
    }
  }
  selectTime(index) {
    this.TimeSlots[index].active = true;
    this.selectedTime = this.TimeSlots[index].time;
    for (let i = 0; i < this.TimeSlots.length; i++) {
      if (i != index) {
        this.TimeSlots[i].active = false;
      }
    }
  }

  update() {
    console.log(this.selectedTime);
    console.log(this.bookingDate);
    console.log('converted Date');
    console.log(new Date(this.bookingDate));

    if (this.navParams.get('orderIDS')) {
      let orderIds = this.navParams.get('orderIDS');
     
      const confirm = this.alertCtrl.create({
        title: 'Alert?',
        message: 'Are you sure to update the Date and time slot for this order?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Confrim',
            handler: () => {
              firebase.database().ref('bookings/' + orderIds.orderid + '/').update({
                bookingTime: this.selectedTime,
                bookingTimeStamp:new Date(this.bookingDate).toString(),
                bookingDate:this.bookingDate
              }).then(() => {
                
                firebase.database().ref('users/' + orderIds.uid + '/my_booking/' + orderIds.orderid + '/').update({
                  bookingTime: this.selectedTime,
                  bookingTimeStamp:new Date(this.bookingDate).toString(),
                  bookingDate:this.bookingDate
                }).then(() => {
                  this.cs.presentToast('Date TimeSlot Updated Successfully');
                  this.TimeSlots = [{ time: '9:00 AM - 12:00 PM', active: false }, { time: '12:00 PM - 03:00 PM', active: false }, { time: '03:00 PM - 06:00 PM', active: false }, { time: '06:00 PM - 09:00 PM', active: false }]
                  this.navCtrl.pop();
                })
              })
            }
          }
        ]
      });
      confirm.present();
    }
  }
}
