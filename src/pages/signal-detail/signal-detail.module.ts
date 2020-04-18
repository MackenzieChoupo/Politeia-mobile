import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignalDetailPage } from './signal-detail';

@NgModule({
  declarations: [
    SignalDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SignalDetailPage),
  ],
})
export class SignalDetailPageModule {}
