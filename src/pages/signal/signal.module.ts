import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignalPage } from './signal';

@NgModule({
  declarations: [
    SignalPage,
  ],
  imports: [
    IonicPageModule.forChild(SignalPage),
  ],
})
export class SignalPageModule {}
