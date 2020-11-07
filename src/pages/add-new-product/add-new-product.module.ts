import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewProductPage } from './add-new-product';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AddNewProductPage,
  ],
  imports: [
    CommonModule,
    IonicPageModule.forChild(AddNewProductPage),
  ],
})
export class AddNewProductPageModule {}
