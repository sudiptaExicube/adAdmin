import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EarningListPage } from './earning-list';

@NgModule({
  declarations: [
    EarningListPage,
  ],
  imports: [
    IonicPageModule.forChild(EarningListPage),
  ],
})
export class EarningListPageModule {}
