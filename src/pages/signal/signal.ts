import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { global } from "../../app/global";
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import _ from "lodash";


/**
 * Generated class for the SignalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signal',
  templateUrl: 'signal.html',
})
export class SignalPage {

  signalements: Array<{ id: number, titre: string, adresse: string, etat: number, date: any, nb_confirmation: number, online: number, lat: any, lng: any, categoryId : number }>;
  vuSelected = "recents";
  categories = {0 :{title : 'Voirie', color: 'darkPink'}, 1 : {title: 'Eclairage', color : 'navyBlue'}, 2 : {title :'Malpropreté', color: 'dark'}, 3 : {title: 'Autre problème', color: 'orange'}}
  typeOfSort = 'date';

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public navParams: NavParams,
              public restApi: RestApiProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public events: Events,
              private storage: Storage,
  ) {

  }

  ionViewDidLoad() {
    this.events.subscribe('signalements:fresh', () => {
      this.getListSignalements();
    });
  }

  ionViewDidEnter() {
      this.getListSignalements();

    this.setAllSignalementsAsRead();
  }

  getListSignalements() {
        this.signalements = global.signalements;

        if(this.typeOfSort == 'date') {
          this.sortByDate();
        }else {
          this.sortByConfirmations();
        }
  }

  setAllSignalementsAsRead(){
    this.storage.get('signauxLu')
      .then((signauxLu) => {
        let listOfSignalsIds = _.map(this.signalements, 'id');
        let newListOfReadSignalsIds = _.union(signauxLu, listOfSignalsIds);

        this.storage.set('signauxLu', newListOfReadSignalsIds);

        global.nbSignal = 0;
          this.events.publish('nbsignalements:fresh', global.nbSignal);
      }).catch((er) => {});
  }

  sortByDate() {
    this.typeOfSort = 'date';

    this.signalements.sort(function (a, b) {
        if (a.date < b.date) {
          return 1;
        } else if (a.date > b.date) {
          return -1;
        } else {
          return 0;
        }
      }
    );
  }

  sortByConfirmations() {
    this.typeOfSort = 'confirmation';
    this.signalements.sort(function (a, b) {
        if (a.nb_confirmation < b.nb_confirmation) {
          return 1;
        } else if (a.nb_confirmation > b.nb_confirmation) {
          return -1;
        } else {
          return 0;
        }
      }
    );
  }

  signalAdd() {
    let myModal = this.modalCtrl.create('SignalAddPage');
    myModal.onDidDismiss(data => {
      this.events.publish('signalements:check', true)
    });
    myModal.present();
  }


  detail(id) {
    let myModal = this.modalCtrl.create('SignalDetailPage', {signalId: id});
    myModal.present();
  }

  confirmer(id) {
    console.log("confirmer ID: ", id);

    this.restApi.confirmSignalement(id).subscribe(
      data => {
        let alert = this.alertCtrl.create({
          title: 'Le signalement est confirmé',
          subTitle: '',
          buttons: ['OK']
        });
        alert.present();

      },
      err => {
        if (err.status == "400") {

          let alert = this.alertCtrl.create({
            title: 'Vous avez déjà confirmé ce signalement',
            subTitle: '',
            buttons: ['OK']
          });
          alert.present();


        }
      },
      () => {
      }
    );


  }

  getSignalTypeString(typeId: any){
    if(typeId != null)
    return this.categories[typeId].title;
  }


  getSignalTypeColor(typeId: any){
    if(typeId != null)
    return this.categories[typeId].color;
  }
}
