import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { CustomService } from './../../app/customservice';
@IonicPage()
@Component({
  selector: 'page-edit-details',
  templateUrl: 'edit-details.html',
})
export class EditDetailsPage {
  subcat_name:any = '';
  subcat_description:any = '';
  subcat_code:any = '';
  subcat_price:any = '';
  subCatDetails:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public cs: CustomService,) {
    this.subCatDetails = this.navParams.get('subCatDetails');
    let catId = this.navParams.get('catId');
    if(this.subCatDetails){
      this.subcat_name = this.subCatDetails.subcat_name
      this.subcat_description =this.subCatDetails.subcat_description
      this.subcat_code = this.subCatDetails.subcat_code
      this.subcat_price =this.subCatDetails.subcat_price
      console.log(this.subCatDetails)
      console.log(catId)
    }
  }

  update(){
     if (!this.subcat_name.trim()) {
      this.cs.presentToast('Please Enter Service Name');
    } else if (!this.subcat_code.trim()) {
      this.cs.presentToast('Please Enter Service ID');
    } else if (this.subcat_price == '' || this.subcat_price == undefined || this.subcat_price == null) {
      this.cs.presentToast('Please Enter Service Price');
    } else if (!this.subcat_description.trim()) {
      this.cs.presentToast('Please Enter Service Short Description');
    }else{
    this.cs.presentLoadingDefault()
    //console.log('products/'+this.navParams.get('type')+'/categories/' + this.navParams.get('catId') + '/subcategories/' + this.subCatDetails.subcatId +'/')
    firebase.database().ref('products/'+this.navParams.get('type')+'/categories/' + this.navParams.get('catId') + '/subcategories/' + this.subCatDetails.subcatId +'/').update({
      subcat_name : this.subcat_name,
      subcat_description :this.subcat_description,
      subcat_code : this.subcat_code,
      subcat_price:parseFloat(this.subcat_price) 
    }).then((res)=>{
      console.log(res)
      this.cs.presentToast('Service Updated');
      this.navCtrl.setRoot('AllProductsPage');
      this.cs.presentLoadingClose()
    })
  }
  }




  ionViewDidLoad() {
    console.log('ionViewDidLoad EditDetailsPage');
  }

}
