import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CustomService } from './../../app/customservice';
import * as firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-add-new-product',
  templateUrl: 'add-new-product.html',
})
export class AddNewProductPage {
  subcat_name: any = '';
  subcat_description: any = '';
  subcat_code: any = '';
  subcat_price: any = '';
  subCatDetails: any;
  categoryName: any = '0';
  categoryCode: any = '0'
  serviceFor: any = 'select';
 
  allCatList = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public cs: CustomService, ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewProductPage');
  }
  onChange(e) {
    console.log(this.serviceFor)
    if (this.serviceFor != 'select') {
      this.cs.presentLoadingDefault()
      this.categoryCode = '0';
      this.categoryName = '0';
      firebase.database().ref('products/'+this.serviceFor+ '/categories/').once('value', (snap) => {
        if (snap.val()) {
          let allCat = snap.val();
          this.allCatList = [];
          for (let key in allCat) {
            allCat[key].CatNodeId = key;
            let data = {
              catCode:allCat[key].cat_code,
              catName:allCat[key].cat_name,
              CatNodeKey:allCat[key].CatNodeId 
            }
            this.allCatList.push(data)
           // this.catName.push(allCat[key].cat_name)
          }
          if (this.allCatList) {
            this.cs.presentLoadingClose()
          }
        }
      })
    }
  }
  catNameChange(e) {
    this.categoryCode = this.categoryName;
    console.log(this.categoryCode)
  }
  
  addNew() {
    if (this.serviceFor == 'select') {
      this.cs.presentToast('Please Choose Service For');
    } else if (!this.subcat_name.trim()) {
      this.cs.presentToast('Please Enter Service Name');
     } 
    //else if (!this.subcat_code.trim()) {
    //   this.cs.presentToast('Please Enter Service ID');
    // }
     else if (!this.subcat_price.trim()) {
      this.cs.presentToast('Please Enter Service Price');
    } else if (!this.subcat_description.trim()) {
      this.cs.presentToast('Please Enter Service Short Description');
    }else{
      this.cs.presentLoadingDefault()
      let catNodeId = this.allCatList[this.categoryCode].CatNodeKey
      //console.log('products/'+this.serviceFor+'/categories/' + catNodeId + '/subcategories/')
      
      var a = (new Date().getTime()).toString();
      var catnameId = this.subcat_name.substr(0,2)
      var subcatCode =this.serviceFor+'-'+ this.allCatList[this.categoryCode].catCode + '-'+catnameId.toUpperCase()+a.substr(8,12);
      console.log(subcatCode)
      firebase.database().ref('products/'+this.serviceFor+'/categories/' + catNodeId + '/subcategories/'+subcatCode +'/').set({
        subcat_name : this.subcat_name,
        subcat_description :this.subcat_description,
        subcat_code : subcatCode,
        subcat_price:parseFloat(this.subcat_price) 
      }).then((res)=>{
        console.log(res)
        this.cs.presentToast('Service Created');
        this.navCtrl.setRoot('AllProductsPage');
        this.cs.presentLoadingClose()
      })
     
    }
  }
}
