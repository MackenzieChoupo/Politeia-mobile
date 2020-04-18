import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController,
  Platform,
  Events,
  ModalController
} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {
  NativeGeocoder,
  NativeGeocoderReverseResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder';

import { ImagePicker } from '@ionic-native/image-picker';




import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { normalizeURL} from 'ionic-angular';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { global } from "../../app/global";
import { Geolocation } from '@ionic-native/geolocation';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';


import { Diagnostic } from '@ionic-native/diagnostic';


/**
 * Generated class for the SignalAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signal-add',
  templateUrl: 'signal-add.html',
})
export class SignalAddPage {

  OneForm: FormGroup;
  signalement: any;

  imageURI: any;
  sanitizedImageUrl : any;
  imageSRC: string;
  imageFileName: any;
  isuploadimage: boolean;
  latLng: any = {'lat': null, 'lng': null};
  signalementsProches: Array<{ id: number, titre: string, adresse: string, etat: number, date: any, nb_confirmation: number, online: number }>;
  categoriesKeys = Object.keys;
  categories = {0 :'Voirie', 1 : 'Eclairage', 2 : 'Malpropreté', 3 : 'Autre problème'}

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public restApi: RestApiProvider,
    private camera: Camera,
    public toastCtrl: ToastController,
    private nativeGeocoder: NativeGeocoder,
    private geolocation: Geolocation,
    public platform: Platform,
    private diagnostic: Diagnostic,
    public events: Events,
    public modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private imagePicker: ImagePicker
  ) {


    this.OneForm = formBuilder.group({
      titre: ["", Validators.compose([Validators.minLength(3), Validators.required])],
      category: ["", Validators.required],
      texte: [""],
      adresse: ["", Validators.required],
    });

    this.isuploadimage = false;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignalAddPage');

    if (this.platform.is('cordova')) {

      this.diagnostic.isLocationAuthorized().then(locationIsAuthorized => {
        console.log("[GPS] Location is " + (locationIsAuthorized ? "authorized" : "unauthorized"));

        if (locationIsAuthorized) {
          this.getPosition();
        } else {
          this.diagnostic.requestLocationAuthorization().then(() => {
            this.getPosition();

            console.log('near')
          });
        }
      }, function (error) {
        console.error("[GPS] The following error occurred: " + error);
      });


    }

  }

  getListeSignalementsProches(lat, lng, categoryId) {
    let loading = this.loadingCtrl.create({
      content: 'Veuillez patienter...'
    });

    loading.present();


    this.restApi.listeSignalementsProches(lat, lng, categoryId).subscribe(
      data => {
        //this.dataVille = data.results;

        this.signalementsProches = data;
        global.nbSignal = data.length;

        this.sortByDate();


      },
      err => {
        console.log("getsignal err: ", err);
        loading.dismiss();

        this.restApi.checkErr(err.status);


      },
      () => {
        //console.log('getHomeData Complete');
        loading.dismiss();
      }
    );

  }


  sortByDate() {
    this.signalementsProches.sort(function (a, b) {
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

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getImage() {
    const options = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      maximumImagesCount : 1
    }


    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
          this.imageURI =results[i];

          if(this.platform.is('ios')){
            this.sanitizedImageUrl = normalizeURL(results[i]);
          }else {
            this.sanitizedImageUrl = (<any>window).Ionic.WebView.convertFileSrc(results[i]);
          }
      }
    }, (err) => { });
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

  takeImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
      this.imageSRC = imageData;

      this.sanitizedImageUrl =
      (<any>window).Ionic.WebView.convertFileSrc(imageData);

    }, (err) => {
      console.log(err);
    });
  }


  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  addSignal() {

    if (this.OneForm.valid) {

      let loading = this.loadingCtrl.create({
        content: 'Veuillez patienter...'
      });

      loading.present();


      this.signalement = {
        "signalement": {
          "titre": this.OneForm.get('titre').value,
          "adresse": this.OneForm.get('adresse').value,
          "texte": this.OneForm.get('texte').value,
          "mairie": global.villeEncours,
          "lat": this.latLng.lat,
          "lng": this.latLng.lng,
          "category" :  this.OneForm.get('category').value

        }
      };


      this.restApi.signalementAdd(this.signalement).subscribe(
        data => {
          console.log("signalementAdd data: ", data);

          let idSignalement = data.message;

          if (this.imageURI != undefined && this.imageURI != "") {

            this.restApi.uploadFile(this.imageURI, idSignalement);

          }

          let subtitle;

          this.restApi.infosMairie(global.villeEncours).subscribe(
            data => {
              //this.dataVille = data.results;
              //console.log("ville: ", data);


              let moderating = data['moderating_enabled'];

              if (moderating) {
                subtitle = 'Il ne sera visible par les utilisateurs qu\'après sa validation par l\'organisme';
              } else {
                subtitle = 'Merci pour votre participation.';
              }

              let alert = this.alertCtrl.create({
                title: 'Votre Signalement a été envoyé',
                subTitle: subtitle,
                buttons: ['OK']
              });

              alert.present();

              this.dismiss();

            }, err => {

              subtitle = 'Merci pour votre participation.';

              let alert = this.alertCtrl.create({
                title: 'Votre Signalement a été envoyé',
                subTitle: subtitle,
                buttons: ['OK']
              });

              alert.present();

              this.dismiss();

            });

        },
        err => {
          console.log("Signal err: ", err._body);


          this.restApi.checkErr(err.status);
          loading.dismiss();


        },
        () => {
          //console.log('listAllVilles Complete');
          loading.dismiss();
        }
      );
    }
  }

  getPosition() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude

      let latLng = {'lat': resp.coords.latitude, 'lng': resp.coords.longitude};
      this.latLng = latLng;
      this.getGeocoded(latLng)
    }).catch((error) => {
      console.log('Error getting location', error);
    });


  }

  getGeocoded(latLng) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 1
    };

    this.nativeGeocoder.reverseGeocode(latLng.lat, latLng.lng, options)
      .then((result: NativeGeocoderReverseResult[]) => {
        let newResult: NativeGeocoderResultModel = JSON.parse(JSON.stringify(result[0]));

        let street = newResult.thoroughfare;
        let number = newResult.subThoroughfare;

        this.OneForm.patchValue({adresse: number + ' ' + street + ', ' + newResult.locality});

        return {'street': street, 'number': number, 'locality': newResult.locality};
      })
      .catch((error: any) => console.log(error));
  }


  categoryChanged(){
    let categoryId = this.OneForm.get('category').value;
    this.getListeSignalementsProches(this.latLng.lat, this.latLng.lng, categoryId);
  }
}

export interface NativeGeocoderResultModel {
  subAdministrativeArea: string,
  postalCode: number,
  locality: string,
  subLocality: string,
  subThoroughfare: string,
  countryCode: string,
  countryName: string,
  administrativeArea: string,
  thoroughfare: string
}

