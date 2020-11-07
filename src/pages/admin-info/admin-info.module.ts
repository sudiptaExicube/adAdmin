import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminInfoPage } from './admin-info';

@NgModule({
  declarations: [
    AdminInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminInfoPage),
  ],
})
export class AdminInfoPageModule {}
