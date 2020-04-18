import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {HomePage} from '../home/home';
import {Events} from 'ionic-angular';
import {global} from "../../app/global";


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = 'SignalPage';
  tab3Root = 'BaiPage';
  tab4Root = 'SondagePage';

  tab1Badge = 0;
  tab2Badge = 0;
  tab3Badge = 0;
  tab4Badge = 0;

  displayReports = false;


  constructor(public navCtrl: NavController, public events: Events) {
    this.events.subscribe('nbsignalements:fresh', nbSignal => {
      this.tab2Badge = global.nbSignal;
    });

    this.events.subscribe('nbBAI:fresh', nbBAI => {
      this.tab3Badge = global.nbBAI;
    });

    this.events.subscribe('displayReports:change', () => {
      console.log('display reports ' + global.displayReports);
      this.displayReports = global.displayReports;
    });

    this.events.subscribe('nbSondage:fresh', nbBAI => {

      this.tab4Badge = global.nbSondage;
    });
  }

  ionViewWillEnter(){
      console.log('ion tabs did enter');

      // this.events.publish("villeEnCoursUpdated");
  }
}
