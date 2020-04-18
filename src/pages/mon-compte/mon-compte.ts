import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { global } from "../../app/global";
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SearchMairiePage } from '../search-mairie/search-mairie';
import { google } from "google-maps";

/**
 * Generated class for the MonComptePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mon-compte',
  templateUrl: 'mon-compte.html',
})
export class MonComptePage {

  login: string;
  passwd: string;

  OneForm: FormGroup;
  TwoForm: FormGroup;

  maVilleId: number;
  maVille: string;
  villes : any = [];

  latitude: number;
  longitude: number;
  autocompleteService: any;
  placesService: any;
  query: string = '';
  places: any = [];
  location: any; 
  GoogleAutocomplete : any;
  autocomplete : any;
  autocompleteItems: any;
  geocoder: any;
  google: any;

  datasUser: any = [{ nom: "", prenom: "", email: "", sexe: "", date_naissance: [{ date: "", timezone: "UTC", timezone_type: "" }], adresse: "", cp: "", ville: "" }];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public restApi: RestApiProvider,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    private zone: NgZone) {

    this.storage.get('storeVillePrincipale')
      .then((val) => {
        this.initializeVilles();

        if (val) {

          this.maVilleId = val;

                    console.log('mesVilles : maVilleActuelle',val);

          this.getInfosVille(this.maVilleId);

          console.log('mesVilles : maVilleActuelle',val);
        
          this.initializeVilles();
          console.log("storeVillePrincipaleGET FIN:", val);
        }

      })
      .catch((er) => {
        console.log("storeVillePrincipaleGET PROBLEM", er);
      });


    this.mesInfos();

    console.log('fBuilder 1', this.TwoForm);

    this.TwoForm = formBuilder.group({
      nom: [this.datasUser.nom, Validators.compose([Validators.minLength(3), Validators.required])],
      prenom: [this.datasUser.prenom, Validators.compose([Validators.required])],
      adresse: [this.datasUser.adresse],
      ville: [this.maVilleId],
      sexe: [this.datasUser.sexe]
        });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MonComptePage');
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
    this.geocoder = new google.maps.Geocoder;
    }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Vous êtes connecté.',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  mdpOublie() {

    let prompt = this.alertCtrl.create({
      title: 'Mot de passe oublié',
      message: "Entrer votre email pour recevoir la procédure de récupération de votre mot de passe.",
      inputs: [
        {
          name: 'email',
          placeholder: 'votre email'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Envoyer',
          handler: data => {
            //console.log('Saved clicked',data.email);

            console.log('Saved clicked', data.email);

            // verif email
            let str = data.email;
            let reg = /[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

            if (str.match(reg)) {

              let datas = { email: data.email };

              this.restApi.recupMDP(datas).subscribe(

                data => {

                  let alert = this.alertCtrl.create({
                    title: 'Merci !',
                    subTitle: 'Vous allez recevoir un email avec la procédure à suivre pour créer un nouveau mot de passe.',
                    buttons: ['OK']
                  });

                  alert.present();

                },
                err => {

                  let alert = this.alertCtrl.create({
                    title: 'Cette email n\'est pas valide',
                    subTitle: '',
                    buttons: ['OK']
                  });

                  alert.present();

                },
                () => { }
              );


            } else {

              let alert = this.alertCtrl.create({
                title: 'Cette email n\'est pas valide',
                subTitle: '',
                buttons: ['OK']
              });

              alert.present();

            }



          }
        }
      ]
    });
    prompt.present();
  }

  saveToast() {
    let toast = this.toastCtrl.create({
      message: 'Vos informations sont enregistrées.',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  mesInfos() {

    let loading = this.loadingCtrl.create({
      content: 'Veuillez patienter...'
    });

    loading.present();

    var datas;
    this.restApi.infosUser().subscribe(
      data => {
        //this.dataVille = data.results;

        datas = data;
        this.datasUser = datas;

        console.log(this.TwoForm.controls['ville']);

        this.TwoForm.controls['nom'].setValue(this.datasUser.nom);
        this.TwoForm.controls['prenom'].setValue(this.datasUser.prenom);
        //this.TwoForm.controls['sexe'].setValue(this.datasUser.sexe);
        //this.TwoForm.controls['date_naissance'].setValue(this.datasUser.date_naissance.date);
        this.TwoForm.controls['adresse'].setValue(this.datasUser.adresse);
        this.TwoForm.controls['ville'].setValue(this.maVille);

        if(this.datasUser.latitude != null){
          this.latitude = this.datasUser.latitude;
        }

        if(this.datasUser.longitude != null){
          this.longitude = this.datasUser.longitude;
        }
     

        console.log(this.TwoForm.controls['ville']);


      },
      err => {
        console.log("listMesinfos err: ", err);

        loading.dismiss();
        this.restApi.checkErr(err.status);


      },
      () => {
        console.log('listMesinfos Complete');
        loading.dismiss();
        console.log("data user: ", datas);
        //this.datasUser = datas;

      }
    );
  }

  saveInfos() {

    if (!this.TwoForm.valid) {

      let alertLogin = this.alertCtrl.create({
        title: 'Informations invalides',
        subTitle: "Veuillez vérifier vos informations.",
        buttons: ['OK']
      });
      alertLogin.present();

    } else {

      //TODO
      let userData: any;

      let loading = this.loadingCtrl.create({
        content: 'Veuillez patienter...'
      });

      loading.present();

      console.log('maVilleFromForm', this.maVille);
      
      if(this.latitude != null && this.longitude != null){
        userData = {
          "user": {
            "nom": this.TwoForm.get('nom').value,
            "prenom": this.TwoForm.get('prenom').value,
  
            "adresse": this.TwoForm.get('adresse').value,
            "sexe": this.TwoForm.get('sexe').value,
            "ville" : this.maVilleId,
            "latitude" : this.latitude,
            "longitude" : this.longitude
          }
        };  
      }else {
        userData = {
          "user": {
            "nom": this.TwoForm.get('nom').value,
            "prenom": this.TwoForm.get('prenom').value,
  
            "adresse": this.TwoForm.get('adresse').value,
            "sexe": this.TwoForm.get('sexe').value,
            "ville" : this.maVilleId,
          }
        };
      }

      console.log(userData);

      this.restApi.updateUser(userData).subscribe(

        data => {
          console.log("updateUser data: ", userData);
          global.villeEncours = this.maVilleId;
          

          console.log('global ville en cours', global.villeEncours);
          this.storage.set('storeVillePrincipale', global.villeEncours);
          
          //this.navCtrl.setRoot(TabsPage);

        },
        err => {
          console.log("updateUser err: ", err._body);


          this.restApi.checkErr(err.status);
          loading.dismiss();


        },
        () => {
          //console.log('listAllVilles Complete');
          loading.dismiss();
          this.saveToast();

        }

      );


      //this.navCtrl.setRoot(TabsPage);

    } // fin else

  }


  searchMairie(myEvent){
    let popover = this.popoverCtrl.create(SearchMairiePage, {myCompte: true, callbackFunction : (villeId) => { this.getInfosVille(villeId)}}, {cssClass: 'fullscreen-popover'});
    //popover.onDidDismiss(() => this.refresh());
    popover.present({
      ev: myEvent
    });
  }


  getInfosVille(idmairie) {

    console.log(idmairie);

    this.restApi.infosMairie(idmairie).subscribe(
      data => {
        //this.dataVille = data.results;
        console.log("getInfosVille: ", data);

        this.maVilleId = data.id;
        this.maVille = data.ville;

        this.TwoForm.controls['ville'].setValue(this.maVille);

      },
      err => {
        console.log("list err: ", err);

        //loading.dismiss();


      },
      () => {
        console.log('list Complete');
        //loading.dismiss();
      }
    );


  }

  clearStorage() {

    this.storage.clear();

    let toast = this.toastCtrl.create({
      message: 'Les données ont été effacées.',
      duration: 3000,
      position: 'top'
    });
    toast.present();

  }

  initializeVilles() {
		this.restApi.listeMesVilles().subscribe(
			data => {
				console.log("listeAllVilles: ", data);

				this.villes = [];
				//this.dataVille = data.results;

				for (let d of data) {

					this.villes.push({ nom: d.nom, id: d.id });


				}

				//console.log("listAllVilles: ",this.items);

			},
			err => {
				//console.log("listAllVilles err: ",err);
				this.restApi.checkErr(err.status);
				//loading.dismiss();


			},
			() => {
				//console.log('listAllVilles Complete');
				//loading.dismiss();
			}
		);

  }


  updateSearchResults(){
    console.log('updating search results');
    if (this.TwoForm.get('adresse').value == '') {
      this.autocompleteItems = [];
      return;
    }

    this.GoogleAutocomplete.getPlacePredictions({
       input: this.TwoForm.get('adresse').value,
       componentRestrictions: {country: 'fr'}
   },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        if(predictions !=null){

        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      
      }
      });
    });
  }

  selectSearchResult(item){
    this.autocompleteItems = [];
  
    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){
        this.latitude =  results[0].geometry.location.lat();
        this.longitude = results[0].geometry.location.lng();

        console.log('this.latitude', this.latitude);
        console.log('this.longitude', this.longitude);

        this.TwoForm.controls['adresse'].setValue(item.description);
        }
    })
  }
}
