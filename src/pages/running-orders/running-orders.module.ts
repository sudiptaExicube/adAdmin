import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RunningOrdersPage } from './running-orders';

@NgModule({
  declarations: [
    RunningOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(RunningOrdersPage),
  ],
})
export class RunningOrdersPageModule {}
