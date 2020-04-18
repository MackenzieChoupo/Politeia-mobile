import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { global } from "../../app/global";
import { LoadingController } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { AlertController } from 'ionic-angular';





declare var window: any;

/**
 * Generated class for the InfosmairiePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-infosmairie',
  templateUrl: 'infosmairie.html',
})
export class InfosmairiePage {
  adresse: string = "...";
  cp: string = "...";
  ville: string = "...";
  tel: string = "...";
  email: string = "...";
  site: string = "...";
  infos: string = "...";
  horaires: any = "";
  telAnimation: string = "";
  telUrbanisme: string = "";
  image: string = "assets/img/card-ville.png";
  urlLink : string = null;
  window: any;
  planning: any;


  options: InAppBrowserOptions = {
    location: 'yes',//Or 'no'
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    hideurlbar: 'no',
    hidenavigationbuttons	: 'no',
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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public restApi: RestApiProvider,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    private transfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener,
    public alertCtrl: AlertController,
    public iab: InAppBrowser

  ) {
    this.getInfos(global.villeEncours);
    this.getPlanning(global.villeEncours);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getPlanning(idville) {

    this.restApi.getPlanning(idville).subscribe(
      data => {
        //this.dataVille = data.results;
        //console.log("getPlanning: ", data);

        this.planning = data;

      },
      err => {
        console.log("getsignal err: ", err);


      },
      () => {
        //console.log('getHomeData Complete');

      }
    );
  }

  openPDF(url) {

    console.log('telech:', url);

    // let target = "_blank";
    // this.iab.create(url, target, this.options);



    // download

    let loading = this.loadingCtrl.create({
      content: 'Téléchargement en cours...'
    });

    loading.present();

    const fileTransfer: FileTransferObject = this.transfer.create();

    fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
      console.log('download complete: ', entry.toURI());

      loading.dismiss();

      this.fileOpener.open(this.file.dataDirectory + 'file.pdf', 'application/pdf')
        .then(() => console.log('File is opened'))
        .catch(e => this.errorPDF(e));


    }, (error) => {
      // handle error
      loading.dismiss();
    });





    //var ref = window.open(file, '_blank', 'location=no');
  }

  errorPDF(e){

    console.log('Error openening file: ', e);

/*    let alertLogin = this.alertCtrl.create({
      title: 'Erreur de téléchargement',
      subTitle: "Veuillez essayer plus tard.",
      buttons: ['OK']
    });
    */
  }
  
  openURL(url) {
    let target = "_blank";
    this.iab.create(url, '_system', this.options);

    //var ref = window.open(file, '_blank', 'location=no');
  }


  getInfos(idmairie) {

    let loading = this.loadingCtrl.create({
      content: 'Veuillez patienter...'
    });

    loading.present();


    this.restApi.infosMairie(idmairie).subscribe(
      data => {
        //this.dataVille = data.results;
        //console.log("list: ",data);

        this.adresse = data['adresse'];
        this.cp = data['cp'];
        this.ville = data['ville'];
        this.tel = data['tel'];
        this.email = data['email'];
        this.site = data['site'];
        this.infos = data['infos'];
        this.horaires = data['horaires'];
        this.telAnimation = data['tel_animation'];
        this.telUrbanisme = data['tel_urbanisme']
        this.urlLink = data['urlLink'];

        if (data['image']) {
          this.image = data['image'];
        }
        //console.log("list: ",data['horaires']);


      },
      err => {
        console.log("list err: ", err);

        loading.dismiss();


      },
      () => {
        console.log('list Complete');
        loading.dismiss();
      }
    );


  }

}
