import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { StarRatingModule } from 'ionic3-star-rating';
@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    StarRatingModule,
    IonicPageModule.forChild(HomePage),
  ]
})
export class HomePageModule {}
