import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ModalController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {RestApiProvider} from '../../providers/rest-api/rest-api';
import {VillesProvider} from '../../providers/villes/villes';
import {global} from "../../app/global";
import {LoadingController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {Events} from 'ionic-angular';
import {InAppBrowser, InAppBrowserOptions} from '@ionic-native/in-app-browser';


import {DetailPage} from '../detail-page/detail-page';
import {LoginPage} from '../login/login';
import _ from 'lodash';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  myParam = '';
  root = DetailPage;
  mesVillesData: any = [];
  villeEncours: number;

  villeAfficheNom: string;
  villeAfficheID: string;
  villeAfficheImage: string;
  villeAfficheBaseLine: string;
  alertePCS: any;
  PCSTitre: any = "";
  PCSTexte: any = "";

  PCSdetail: boolean = false;

  //assets/img/card-ville.png

  news: Array<{ id: string, titre: string, resume: string, date: string }>;
  signalements: Array<{ id: number, titre: string, adresse: string, etat: number }>;


  options: InAppBrowserOptions = {
    location: 'yes',//Or 'no'
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    hideurlbar: 'no',
    hidenavigationbuttons: 'no',
    clearsessioncache: 'yes',
    zoom: 'yes',//Android only ,shows browser zoom controls
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only
    closebuttoncaption: 'Fermer', //iOS only
    disallowoverscroll: 'no', //iOS only
    toolbar: 'yes', //iOS only
    enableViewportScale: 'no', //iOS only
    allowInlineMediaPlayback: 'no',//iOS only
  };


  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
              public restApi: RestApiProvider,
              public villesProvider: VillesProvider,
              public loadingCtrl: LoadingController,
              private storage: Storage,
              public alertCtrl: AlertController,
              public events: Events,
              private iab: InAppBrowser
  ) {


  }

  ionViewDidLoad() {
    this.events.subscribe('news:fresh', () => {
      this.getListNews();
    });

    this.events.subscribe('infosMairie:fresh', () => {
      this.getInfos();
    });
  }

  ionViewDidEnter() {
    this.getListNews();
  }

  openModalWithParams(idnews) {
    let myModal = this.modalCtrl.create(DetailPage, {'myParam': idnews});
    myModal.present();
  }

  openModalInfosMairie() {
    let myModal = this.modalCtrl.create('InfosmairiePage', {'myParam': this.myParam});
    myModal.present();
  }

  openURL(url) {
    let target = "_blank";
    this.iab.create(url, target, this.options);

    //var ref = window.open(file, '_blank', 'location=no');
  }

  async switchPCS() {

    this.PCSdetail = !this.PCSdetail;
  }


  async getInfos() {
    var data = global.infosMairie;
        this.villeAfficheNom = data['ville'];
        this.villeAfficheID = data['id'];
        this.villeAfficheImage = "assets/img/card-ville.png";

        if (data['image']) {
          this.villeAfficheImage = data['image'];
        }

        this.villeAfficheBaseLine = data['baseline'];

        this.alertePCS = data['alerte_pcs'];
        this.PCSTitre = data['alerte_pcs'].titre;
        this.PCSTexte = data['alerte_pcs'].texte;
  }

  getListNews() {
    this.news = global.news;
  }
}
