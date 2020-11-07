import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OldOrdersPage } from './old-orders';

@NgModule({
  declarations: [
    OldOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(OldOrdersPage),
  ],
})
export class OldOrdersPageModule {}
