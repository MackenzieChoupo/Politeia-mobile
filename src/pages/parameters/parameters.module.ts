import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParametersPage } from './parameters';

@NgModule({
  declarations: [
    ParametersPage,
  ],
  imports: [
    IonicPageModule.forChild(ParametersPage),
  ],
})
export class ParametersPageModule {}
