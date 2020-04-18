import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchMairiePage } from './search-mairie';

@NgModule({
  declarations: [
    SearchMairiePage,
  ],
  imports: [
    IonicPageModule.forChild(SearchMairiePage),
  ],
})
export class SearchMairiePageModule {}
