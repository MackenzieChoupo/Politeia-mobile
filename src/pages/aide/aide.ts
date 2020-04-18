import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the AidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aide',
  templateUrl: 'aide.html',
})
export class AidePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, 		public events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AidePage');
  }

  goHome(){
    this.events.publish('logged', false);
    this.navCtrl.setRoot(TabsPage);
  }

}
