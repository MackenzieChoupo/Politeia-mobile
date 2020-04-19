import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AddMairiePage } from '../add-mairie/add-mairie';

import { global } from "../../app/global";
import { AidePage } from '../aide/aide';
import { VillesProvider } from '../../providers/villes/villes';
import { SignupPage } from '../signup/signup';
import { google } from "google-maps";

/**
 * Generated class for the PreSignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pre-signup',
  templateUrl: 'pre-signup.html',
})
export class PreSignupPage {

  OneForm: FormGroup;
	userData: any;
	GoogleAutocomplete : any;
	autocomplete : any;
	autocompleteItems: any;
	geocoder: any;
	latitude: number;
	longitude: number;
	maVilleId: number;
	maVille: string;
	villes : any = [];
	ville: any;

  constructor(
    public navParams: NavParams,
		public formBuilder: FormBuilder,
		public restApi: RestApiProvider,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		private storage: Storage,
		private zone: NgZone,
		private events: Events,
    private villesProvider: VillesProvider,
    private navCtrl : NavController
  ) {
    this.ville = navParams.get('ville');

    this.OneForm = formBuilder.group({
			nom: ["", Validators.required],
			prenom: ["", Validators.required],
			adresse: [""]
		});
  }

	ionViewDidLoad() {
		console.log('ionViewDidLoad MonComptePage');
		this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
		this.autocompleteItems = [];
		this.geocoder = new google.maps.Geocoder;
		}

    goToNextStep(){
       this.navCtrl.push(SignupPage, {
         ville: this.ville,
         nom : this.OneForm.get('nom').value,
         prenom : this.OneForm.get('prenom').value,
         addresse : this.OneForm.get('adresse').value
       })
     }
     enregistrer(){
       if(this.OneForm.valid){
        let loading = this.loadingCtrl.create({
          content: 'Veuillez patienter...'
        });
  
        loading.present();
        this.restApi.infosMairie(this.ville).subscribe(

          data => {
  
  
            if(this.latitude != null && this.longitude != null){
            this.userData = {
              "user": {
                "nom": this.OneForm.get('nom').value,
                "prenom": this.OneForm.get('prenom').value,
                "mairie": this.ville,
                "date_naissance": "1970-01-01",
                "adresse": this.OneForm.get('adresse').value,
                "sexe": 'h',
                "ville": data['ville'],
                "latitude" : this.latitude,
                "longitude" : this.longitude
              }
            };
          }else {
            this.userData = {
              "user": {
                "nom": this.OneForm.get('nom').value,
                "prenom": this.OneForm.get('prenom').value,
                "mairie": this.ville,
                "date_naissance": "1970-01-01",
                "adresse": this.OneForm.get('adresse').value,
                "sexe": 'h',
                "ville": data['ville']
              }
            };
          }
  
            console.log("userdatas Done", this.userData);
  
            // Debut signup --------------------------------------------------

            if(this.userData.user.nom && this.userData.user.prenom){
              loading.dismiss();
              this.storage.set('Credentials', this.userData);
              this.storage.set('storeVillePrincipale', global.villeEncours);
              this.navCtrl.setRoot(AidePage);
          }else{
              console.log("Une erreur s'est produite !");
              console.log("Signup data err: ", this.userData);
              loading.dismiss();
          }},
          );
       }
       
     }

     updateSearchResults(){
      console.log('updating search results');
      if (this.OneForm.get('adresse').value == '') {
        this.autocompleteItems = [];
        return;
      }
    
      this.GoogleAutocomplete.getPlacePredictions({
         input: this.OneForm.get('adresse').value,
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
    
        this.OneForm.controls['adresse'].setValue(item.description);
        }
      })
      }

}
