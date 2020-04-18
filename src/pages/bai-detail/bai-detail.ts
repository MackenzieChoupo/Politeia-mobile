import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { global } from "../../app/global";
import {Storage} from "@ionic/storage";


/**
 * Generated class for the BaiDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-bai-detail',
	templateUrl: 'bai-detail.html',
})
export class BaiDetailPage {

	baiId: number;

	reponses = [];

	OneForm: FormGroup;

	userData: any;

	switchReponse:boolean = false;

	constructor(public navCtrl: NavController,
		public viewCtrl: ViewController,
		public loadingCtrl: LoadingController,
		public restApi: RestApiProvider,
		public alertCtrl: AlertController,
		public formBuilder: FormBuilder,
		public navParams: NavParams,
    public storage: Storage,
    public events: Events
  ) {


		this.OneForm = formBuilder.group({
			texte: ["", Validators.required]

		});

		this.baiId = navParams.get('baiId');
		console.log('baiId', this.baiId);

		this.listeReponsesQuestions();

	}

	async ionViewDidLoad() {
		console.log('ionViewDidLoad BaiDetailPage');


   this.storage.get('baiLu')
      .then((val) => {
        let baiLus = val;
        if (baiLus.includes(this.baiId)) {
          baiLus.push(this.baiId);
          this.storage.set('baiLu', baiLus);

          if (global.nbBAI > 0) {
            global.nbBAI = global.nbBAI - 1;
            console.log('new global nbBAI ' + global.nbBAI );
            this.events.publish('nbBAI:fresh', global.nbBAI);
          }
        }
      })
      .catch((er) => {
        console.log(' nbBAI err ' + er );

        let baiLu = [this.baiId];
        this.storage.set('baiLu', baiLu);

        if (global.nbBAI > 0) {
          global.nbBAI = global.nbBAI - 1;
          this.events.publish('nbBAI:fresh', global.nbBAI);
        }
      });
	}

	switchR(){
		this.switchReponse=!this.switchReponse;
	}

	listeReponsesQuestions() {

		let loading = this.loadingCtrl.create({
			content: 'Veuillez patienter...'
		});

		loading.present();

		this.restApi.listeReponsesQuestion(this.baiId).subscribe(
			data => {
				//this.dataVille = data.results;

				this.reponses = data;
				console.log("listeReponsesQuestion ok: ", this.reponses);


			},
			err => {
				console.log("listeReponsesQuestion err: ", err);
				loading.dismiss();

				this.restApi.checkErr(err.status);


			},
			() => {
				//console.log('getHomeData Complete');
				loading.dismiss();
			}
		);
	}

	addReponse() {
		if (this.OneForm.valid) {

			let loading = this.loadingCtrl.create({
				content: 'Veuillez patienter...'
			});

			loading.present();

			this.userData = {
				"reponse": {
					"question": this.baiId,
					"texte": this.OneForm.get('texte').value

				}
			};

			this.restApi.addReponse(this.userData).subscribe(

				data => {

					let alert = this.alertCtrl.create({
						title: 'Votre message a été envoyé.',
						subTitle: 'Merci pour votre participation',
						buttons: ['OK']
					});

					alert.present();
					this.switchR();
				},
				err => { loading.dismiss(); },
				() => { loading.dismiss(); }
			);
		}
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}
}
