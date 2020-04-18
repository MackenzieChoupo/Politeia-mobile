import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignalAddPage } from './signal-add';

@NgModule({
  declarations: [
    SignalAddPage,
  ],
  imports: [
    IonicPageModule.forChild(SignalAddPage),
  ],
})
export class SignalAddPageModule {}
