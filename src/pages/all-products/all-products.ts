import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { CustomService } from './../../app/customservice';
@IonicPage()
@Component({
  selector: 'page-all-products',
  templateUrl: 'all-products.html',
})
export class AllProductsPage {
  public mProducts=[];
  public fProducts=[];
  pet: string = "puppies";
  constructor(public navCtrl: NavController, public navParams: NavParams,public cs: CustomService) {
   
    this.loadUsers()
  }

  loadUsers() {
    this.cs.presentLoadingDefault()
    firebase.database().ref('products/').once('value',(snap)=>{
      if(snap.val()){
        let allP = snap.val();   
        let male = allP[0].categories;
        let fmale = allP[1].categories;
       // console.log(male)
        if(male && fmale){
          this.loadMaleData(male);
          this.loadfeMaleData(fmale);
        }
   
      }
    })
  }
  
  loadMaleData(data){
    this.mProducts = [];
    for(let key in data){
      data[key].catId = key;
      this.mProducts.push(data[key]);
      console.log(this.mProducts)
      this.cs.presentLoadingClose()
    }
  }
  loadfeMaleData(data){
    this.fProducts = [];
    for(let key in data){
      data[key].catId = key;
      this.fProducts.push(data[key]);
      console.log( this.fProducts)
    }
  }

  viewProductsDetails(type,index){
    console.log(type)
    console.log(index)
    if(type== 'male'){
      let subCat =  this.mProducts[index].subcategories;
      this.navCtrl.push('ProductDetailsPage',{type:0,details:subCat,catId: this.mProducts[index].catId});
    }else{
      console.log('i am call')
      let subCat =  this.fProducts[index].subcategories;
      this.navCtrl.push('ProductDetailsPage',{type:1,details:subCat,catId: this.fProducts[index].catId});
    }
  }
 
}
