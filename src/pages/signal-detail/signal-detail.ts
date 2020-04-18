import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the SignalDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-signal-detail',
	templateUrl: 'signal-detail.html',
})
export class SignalDetailPage {

	signalId: number;

	titre: string;
	adresse: string;
	texte: string;
	date: any;
	nb_confirmation: number;
	photo: string;
	etat: number;
	commentaire: string;
	categoryId: any;
  	online: number;
  	categories = {0 :{title : 'Voirie', color: 'darkPink'}, 1 : {title: 'Eclairage', color : 'navyBlue'}, 2 : {title :'Malpropreté', color: 'dark'}, 3 : {title: 'Autre problème', color: 'orange'}}


	constructor(public navCtrl: NavController,
		public viewCtrl: ViewController,
		public loadingCtrl: LoadingController,
		public restApi: RestApiProvider,
		public alertCtrl: AlertController,
		public navParams: NavParams) {

		this.signalId = navParams.get('signalId');
		//console.log('signalId', this.signalId);


	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SignalDetailPage');

		this.getSignalDetail();
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}

	confirmer() {
		console.log("confirmer ID: ", this.signalId);

		this.restApi.confirmSignalement(this.signalId).subscribe(

			data => {


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
			() => { }
		);

		this.viewCtrl.dismiss();
	}

	getSignalDetail() {

		let loading = this.loadingCtrl.create({
			content: 'Veuillez patienter...'
		});

		loading.present();


		this.restApi.detailSignalement(this.signalId).subscribe(
			data => {
				//this.dataVille = data.results;

				this.titre = data.titre;
				this.adresse = data.adresse;
				this.texte = data.texte;
				this.date = data.date;
				this.nb_confirmation = data.nb_confirmation;
				this.etat = data.etat;
				this.commentaire = data.commentaire_mairie;
				this.photo = data.photo;
				this.online = data.online;
				this.categoryId = data.categoryId;


			},
			err => {

				loading.dismiss();

				this.restApi.checkErr(err.status);


			},
			() => {
				//console.log('getHomeData Complete');
				loading.dismiss();
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
