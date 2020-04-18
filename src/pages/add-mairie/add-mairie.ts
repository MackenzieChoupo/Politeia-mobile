import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ListPage } from '../list/list';
import { ToastController } from 'ionic-angular';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { Storage } from "@ionic/storage";

/**
 * Generated class for the AddMairiePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-add-mairie',
	templateUrl: 'add-mairie.html',
})
export class AddMairiePage {

	mairie: string;
	cp: string;

	OneForm: FormGroup;

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public formBuilder: FormBuilder,
		public alertCtrl: AlertController,
		public loadingCtrl: LoadingController,
		public toastCtrl: ToastController,
		private storage: Storage,
		public restApi: RestApiProvider) {

		this.OneForm = formBuilder.group({
			mairie: ['', Validators.required],
			cp: ['']
		});

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AddMairiePage');
	}

	addmairie() {

		

		let toastOK = this.toastCtrl.create({
			message: 'Politeia vous remercie de votre participation.',
			duration: 3000,
			position: 'top'
		});
		

		if (this.OneForm.valid) {

			this.mairie = this.OneForm.get('mairie').value;
			this.cp = this.OneForm.get('cp').value;

			let data = {
				"cp": this.cp,
				"ville":this.mairie
			}

			
			// envoie des données

			this.restApi.mairieDemande(data).subscribe(

				data => {

					toastOK.present();
						this.storage.get('storeToken')
						  .then((val) => {
							if(val == null || val == undefined || val == ""){
								this.navCtrl.pop();
							}else {
								this.navCtrl.setRoot(ListPage);
							}
						  })
						  .catch((er) => {
							//console.log("storeGetLogin PROBLEM", er);
						  });

				},
				err => {
					console.log("Signup err: ", err._body);
				},
				() => {
					//console.log('listAllVilles Complete');
					

				}

			);
			



			

		} else {



		}
	}

}
