import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseVillePage } from './choose-ville';

@NgModule({
  declarations: [
    ChooseVillePage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseVillePage),
  ],
})
export class ChooseVillePageModule {}
