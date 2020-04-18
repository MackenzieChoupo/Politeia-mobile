import { TabsPage } from './../tabs/tabs';
import { ChooseVillePage } from './../choose-ville/choose-ville';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, Toast } from 'ionic-angular';

import { global } from "../../app/global";
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { LoadingController } from 'ionic-angular';
import { VillesProvider } from '../../providers/villes/villes';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AidePage } from '../aide/aide';
import { SignupPage } from '../signup/signup';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})


export class LoginPage {

	login: string;
	passwd: string;

	OneForm: FormGroup;

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public restApi: RestApiProvider,
		public villesProvider: VillesProvider,
		public formBuilder: FormBuilder,
		public alertCtrl: AlertController,
		private storage: Storage,
		public events: Events,
		public toastController : ToastController,
		public loadingCtrl: LoadingController) {


		this.OneForm = formBuilder.group({
			login: ["", Validators.compose([Validators.minLength(3), Validators.required])],
			passwd: ["", Validators.compose([Validators.minLength(1), Validators.required])]
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	goToChooseVille() {
		this.navCtrl.push(ChooseVillePage);
	}


	saveLogin() {

		//console.log(this.OneForm.value);
		let alertLogin = this.alertCtrl.create({
			title: 'Identifiants invalides',
			subTitle: "Veuillez vérifier l'email et le mot de passe fournis.",
			buttons: ['OK']
		});

		//console.log(this.OneForm.value);
		let alertAuth = this.alertCtrl.create({
			title: 'Identifiants inconnus',
			subTitle: "Veuillez vérifier l'email et le mot de passe fournis.",
			buttons: ['OK']
		});

		if (!this.OneForm.valid) {

			alertLogin.present();

		} else {
			global.token = btoa(this.OneForm.get('login').value + ':' + this.OneForm.get('passwd').value);
			this.storage.set('storeToken', global.token);

			let loading = this.loadingCtrl.create({
				content: 'Veuillez patienter...'
			});

			loading.present();




			this.restApi.loginCheck().subscribe(
				data => {
					//this.dataVille = data.results;
					loading.dismiss();
						this.events.publish('logged', false);
						this.navCtrl.setRoot(TabsPage);
				},
				err => {
					console.log("login check ERROR: ", err);

					loading.dismiss();

					alertAuth.present();


				}
			);
		} // fin else





	}


	passwordPrompt() {
		let alert = this.alertCtrl.create({
		  title: 'Mot de passe oublié',
		  inputs: [
			{
			  name: 'email',
			  placeholder: 'Adresse mail'
			},
		  ],
		  buttons: [
			{
			  text: 'Annuler',
			  role: 'cancel',
			},
			{
			  text: 'Réinitialiser le mdp',
			  handler: data => {
				  console.log(data);

				  this.restApi.recupMDP(data).subscribe(
					data => {
						let toast = this.toastController.create({
							message: 'Un mail de réinitialisation vous a été envoyé, merci de vérifier vos spams',
							duration: 3000,
							position: 'bottom'
						  });
						
						  toast.present();
					},
					err => {
						let errorMessage = "Impossible de réinitialiser le mot de passe";
						
						if(err._body.includes("Email inconnu")){
							errorMessage = "Aucun compte trouvé pour cet Email"
						}

						let toast = this.toastController.create({
							message: errorMessage,
							duration: 3000,
							position: 'bottom'
						  });
						
						  toast.present();
						return false;	
				})
			  }
			}
		  ]
		});
		alert.present();
	  }

}
