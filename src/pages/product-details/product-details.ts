import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { CustomService } from './../../app/customservice';
import { AlertController } from 'ionic-angular';
/**
 * Generated class for the ProductDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {
  catDetails = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public cs: CustomService, public alertCtrl: AlertController) {
    let catDetails = this.navParams.get('details')
    console.log(catDetails)
    if (catDetails) {
      let subDetails = catDetails
      this.catDetails = [];
      for (let key in subDetails) {
        subDetails[key].subcatId = key;
        this.catDetails.push(subDetails[key])
      }
      console.log(this.catDetails)
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailsPage');
  }

  editDetails(index) {
    this.navCtrl.push('EditDetailsPage', { catId: this.navParams.get('catId'), subCatDetails: this.catDetails[index], type: this.navParams.get('type') })
  }
  deleteProduct(index) {
    const confirm = this.alertCtrl.create({
      title: 'Alert?',
      message: 'Are you sure to delete this service?',
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
            console.log(this.navParams.get('type'))
            firebase.database().ref('products/' + this.navParams.get('type') + '/categories/' + this.navParams.get('catId') + '/subcategories/' + this.catDetails[index].subcatId + '/').remove().then(() => {
              this.cs.presentToast('Service Deleted');
              this.navCtrl.setRoot('AllProductsPage');
              this.cs.presentLoadingClose()
            })
          }

        }
      ]
    });
    confirm.present();
  }
}
