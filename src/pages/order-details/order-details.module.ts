import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderDetailsPage } from './order-details';
import { StarRatingModule } from 'ionic3-star-rating';

@NgModule({
  declarations: [
    OrderDetailsPage,
  ],
  imports: [
    StarRatingModule,
    IonicPageModule.forChild(OrderDetailsPage),
  ],
})
export class OrderDetailsPageModule {}
