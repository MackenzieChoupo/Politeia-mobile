import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BaiDetailPage } from './bai-detail';

@NgModule({
  declarations: [
    BaiDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(BaiDetailPage),
  ],
})
export class BaiDetailPageModule {}
