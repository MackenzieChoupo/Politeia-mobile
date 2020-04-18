import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { SearchMairiePage } from '../search-mairie/search-mairie';
import { VillesProvider } from '../../providers/villes/villes';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import {global} from "../../app/global";
import { TabsPage } from '../tabs/tabs';
import { Events } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import * as _ from 'lodash';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  villes:any = [];
  villesEmpty:any = [];

  constructor(public navCtrl: NavController,
            public navParams: NavParams,
            public popoverCtrl: PopoverController,
            public villesProvider: VillesProvider,
            public restApi: RestApiProvider,
            public events: Events,
            public loadingCtrl: LoadingController ) {
  }

  ionViewWillEnter(){
    this.refreshMesVilles();

    this.events.subscribe('ville:add', idVille => {
      this.villeAdd(idVille);
    });

  }

  ionViewWillLeave(){
    this.events.unsubscribe('ville:add');
    }

    async villeDel(event : Event, item){
    event.stopPropagation();
      await this.villesProvider.deleteVille(item.id).then(() => this.refreshMesVilles()).catch((err) => console.log(err));
  }

    async villeAdd(idVille){
    await this.villesProvider.addVille(idVille).then(() => this.refreshMesVilles()).catch((err) => console.log(err));
  }

  clickOnCity(event, item) {
    global.villeEncours = item.id;
    this.villesProvider.setVilleEnCours(item.id);
    this.navCtrl.setRoot(TabsPage);
  }

  searchMairie(ev){
     let popover = this.popoverCtrl.create(SearchMairiePage);
     popover.present({
       ev: ev
     });
  }

  swipeEvent($event){
    this.refreshMesVilles();
  }

  async refreshMesVilles() {
    let loading = this.loadingCtrl.create({
      content: 'Veuillez patienter...'
    });

    loading.present();
    await this.villesProvider.getMesVilles().then((result) => this.villes = result).catch((err) => console.log(err));
    loading.dismiss();
  }
}
