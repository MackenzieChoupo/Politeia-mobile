import {Component, Renderer} from '@angular/core';
import {NavParams, ViewController, Platform} from 'ionic-angular';
import {RestApiProvider} from '../../providers/rest-api/rest-api';
import {LoadingController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {global} from "../../app/global";
import {Events} from 'ionic-angular';
import {InAppBrowser, InAppBrowserOptions} from '@ionic-native/in-app-browser';
import _ from 'lodash';
import {StreamingMedia, StreamingVideoOptions} from '@ionic-native/streaming-media';
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
import {FileOpener} from '@ionic-native/file-opener';


@Component({
  templateUrl: 'detail-page.html'
})
export class DetailPage {

  idnews: string;

  titre: string;
  texte: string;
  date: string;
  photo: string;
  documents;
  important: boolean;

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

  listenToLinkClick: Function;

  constructor(
    public viewCtrl: ViewController,
    public restApi: RestApiProvider,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    public events: Events,
    public params: NavParams,
    public renderer: Renderer,
    public iab: InAppBrowser,
    private streamingMedia: StreamingMedia,
    public platform: Platform,
    private transfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener,) {

    this.idnews = params.get('myParam');

    this.getNewsinfos(this.idnews);


  }

  ionViewDidLoad() {
    document.body.addEventListener('click', (event) => {
      var target = event.srcElement;


      var targetStr = target.toString();

      if (this.isURL(targetStr)) {
        this.openURL(targetStr);

        event.preventDefault();

        return false;
      }
    }, true);
  }

  ionViewWillLeave() {
  }


  getNewsinfos(idnews) {

    let loading = this.loadingCtrl.create({
      content: 'Veuillez patienter...'
    });

    loading.present();

    let IdNewsLu = [];


    this.restApi.detailNews(idnews).subscribe(
      data => {
        //this.dataVille = data.results;


        this.titre = data.titre;
        //this.texte = data.texte.replace('<a ', '<button ').replace('</a>', '</button>').replace('</a>', '</button>');
        this.texte = data.texte;

        this.date = data.date;
        this.photo = data.photo;
        this.important = data.important;

        console.log(data.documents);
        
        this.documents = _.map(data.documents, document => {
          document.video = this.isVideo(document.url);
          document.pdf = this.isPdf(document.url);
          return document;
        });


        // pour les tests
        this.storage.get('storeIdNewsLu')
          .then((val) => {

            IdNewsLu = val;


            // si idnews n'est pas déjà present push et store.
            if (IdNewsLu.indexOf(idnews) == -1) {
              IdNewsLu.push(idnews);
              this.storage.set('storeIdNewsLu', IdNewsLu);

              if (global.nbNews > 0) {
                global.nbNews--;
                this.events.publish('nbnews:fresh', global.nbNews);
              }

            }

          })
          .catch((er) => {
            IdNewsLu = [idnews];
            this.storage.set('storeIdNewsLu', IdNewsLu);

            if (global.nbNews > 0) {
              global.nbNews--;
              this.events.publish('nbnews:fresh', global.nbNews);
            }
          });
      },
      err => {

        loading.dismiss();

        this.restApi.checkErr(err.status);


      },
      () => {
        loading.dismiss();


      }
    );
  }


  openURL(url) {
    let target = "_blank";
    this.iab.create(url, '_system', this.options);

    //var ref = window.open(file, '_blank', 'location=no');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  isURL(str) {
    var pattern = new RegExp("^((https{0,1}|ftp|rtsp|mms){0,1}://){0,1}(([0-9a-z_!~\\*'\\(\\)\\.&=\\+\\$%\\-]{1,}:\\ ){0,1}[0-9a-z_!~\\*'\\(\\)\\.&=\\+\\$%\\-]{1,}@){0,1}(([0-9]{1,3}\\.){3,3}[0-9]{1,3}|([0-9a-z_!~\\*'\\(\\)\\-]{1,}\\.){0,}([0-9a-z][0-9a-z\\-]{0,61}){0,1}[0-9a-z]\\.[a-z]{2,6}|localhost)(:[0-9]{1,4}){0,1}((/{0,1})|(/[0-9a-z_!~\\*'\\(\\)\\.;\\?:@&=\\+\\$,%#\\-]{1,}){1,}/{0,1})$", "gi");
    return pattern.test(str);
  }

  openDocument(url) {
    if (this.isVideo(url)) {
      this.playVideo(url);
    } else {
      if(this.isPdf(url)){
        this.openURL(url);
      }else {
        this.openPdf(url);
      }
    }
  }

  isVideo(url) {
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(url)[1].toLowerCase();
    var videoExtensions = ['mp4', 'avi', 'mkv', 'mov'];

    return _.includes(videoExtensions, ext);
  }

  isPdf(url) {
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(url)[1].toLowerCase();
    var pdfExtensions = ['pdf'];

    return _.includes(pdfExtensions, ext);
  }

  playVideo(url) {
    let options: StreamingVideoOptions = {
      successCallback: () => {
      },
      errorCallback: (e) => {
      },
      orientation: 'landscape',
      shouldAutoClose: true,
      controls: true
    };

    this.streamingMedia.playVideo(url, options);
  }

  openPdf(url) {
    let loading = this.loadingCtrl.create({
      content: 'Ouverture en cours...'
    });


    loading.present();

    const fileTransfer: FileTransferObject = this.transfer.create();

    var path = this.platform.is('ios') ? this.file.cacheDirectory + "/temp" : this.file.externalRootDirectory + "/yourapp/temp";

    fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {

      loading.dismiss();

      this.fileOpener.open(this.file.dataDirectory + 'file.pdf', 'application/pdf')
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error opening'));


    }, (error) => {
      // handle error
      loading.dismiss();
    });
  }
}
