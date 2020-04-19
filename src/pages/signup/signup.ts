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
import { google } from "google-maps";

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html',
})
export class SignupPage {

	OneForm: FormGroup;
	userData: any;
	GoogleAutocomplete: google.maps.places.AutocompleteService;
	autocomplete : any;
	autocompleteItems: any;
	geocoder: any;
	latitude: number;
	longitude: number;
	maVilleId: number;
	maVille: string;
	villes : any = [];
	ville: any;
	nom : any;
	prenom : any;
	google: any;
	addresse : any;

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public formBuilder: FormBuilder,
		public restApi: RestApiProvider,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		private storage: Storage,
		private zone: NgZone,
		private events: Events,
		private villesProvider: VillesProvider
	) {
		this.ville = navParams.get('ville');
		this.nom = navParams.get('nom');
		this.prenom = navParams.get('prenom');
		this.addresse = navParams.get('addresse');


		this.OneForm = formBuilder.group({
			email: ["", Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])],
			passwd: ["", Validators.compose([Validators.minLength(8), Validators.required])],
			//date_naissance: ["", Validators.required],
			majeur: [false, Validators.requiredTrue],
			//sexe: ["", Validators.required],
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MonComptePage');
		this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
		this.autocompleteItems = [];
		this.geocoder = new google.maps.Geocoder;
		}


	enregistrer() {

		if (this.OneForm.valid) {
			console.log('Test to verify => ', this.OneForm);

			let loading = this.loadingCtrl.create({
				content: 'Veuillez patienter...'
			});

			loading.present();

			console.log("villeID Signup: ", this.ville);

			this.restApi.infosMairie(this.ville).subscribe(

				data => {


					if(this.latitude != null && this.longitude != null){
					this.userData = {
						"user": {
							"nom": this.nom,
							"prenom": this.prenom,
							"email": this.OneForm.get('email').value,
							"username": this.OneForm.get('email').value,
							"password": this.OneForm.get('passwd').value,
							"mairie": this.ville,
							//"date_naissance": this.OneForm.get('date_naissance').value,
							"date_naissance": "1970-01-01",
							"adresse": this.addresse,
							//"sexe": this.OneForm.get('sexe').value,
							"sexe": 'h',
							//"cp":"38000", // ne sert pas
							"ville": data['ville'],
							"latitude" : this.latitude,
							"longitude" : this.longitude
						}
					};
				}else {
					this.userData = {
						"user": {
							"nom": this.nom,
							"prenom": this.prenom,
							"email": this.OneForm.get('email').value,
							"username": this.OneForm.get('email').value,
							"password": this.OneForm.get('passwd').value,
							"mairie": this.ville,
							//"date_naissance": this.OneForm.get('date_naissance').value,
							"date_naissance": "1970-01-01",
							"adresse": this.addresse,
							//"sexe": this.OneForm.get('sexe').value,
							"sexe": 'h',
							//"cp":"38000", // ne sert pas
							"ville": data['ville']
						}
					};
				}

					console.log("userdatas Done", this.userData);

					// Debut signup --------------------------------------------------

					this.restApi.signup(this.userData).subscribe(

						data => {
							
							console.log("Signup data: ", this.userData);

							global.token = btoa(this.OneForm.get('email').value + ':' + this.OneForm.get('passwd').value);
							global.villeEncours = this.ville;
							console.log('Global token => ',global.token);
							
							this.storage.set('storeToken', global.token);
							this.storage.set('storeVillePrincipale', global.villeEncours);

							this.restApi.loginCheck().subscribe(
								data => {
									loading.dismiss();
									this.navCtrl.setRoot(AidePage);
											},
								err => {
									loading.dismiss();
								}
							);


						},
						err => {
							console.log("Signup err: ", err._body);
							console.log("Signup data err: ", this.userData);

							let str = err._body;
							let reg = /username/gi;



							if (str.match(reg)) {

								let alert = this.alertCtrl.create({
									title: 'Cette email est déjà utilisé.',
									subTitle: 'Merci d\'en choisir un différent.',
									buttons: ['OK']
								});

								alert.present();

							}


							this.restApi.checkErr(err.status);
							loading.dismiss();


						},
						() => {
							//console.log('listAllVilles Complete');

						}

					)



					// Fin Signup ---------------------------------------------------

				},
				err => { },
				() => { }
			);




			;


			//this.navCtrl.setRoot(TabsPage);

		}


	}

	addmairie() {
		//this.viewCtrl.dismiss();
		this.navCtrl.push(AddMairiePage);

	}
}
