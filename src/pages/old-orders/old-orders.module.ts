import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OldOrdersPage } from './old-orders';
import { StarRatingModule } from 'ionic3-star-rating';

@NgModule({
  declarations: [
    OldOrdersPage,
  ],
  imports: [
    StarRatingModule,
    IonicPageModule.forChild(OldOrdersPage),
  ],
})
export class OldOrdersPageModule {}
