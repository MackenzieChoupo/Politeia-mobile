import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { global } from "../../app/global";
import { LoadingController } from 'ionic-angular';
import { Events } from 'ionic-angular';

/**
 * Generated class for the BaiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-bai',
	templateUrl: 'bai.html',
})
export class BaiPage {

	questions: Array<{ id: number, titre: string, date_debut: any, date_fin: any }>;
	vuSelected = "education";
	isEmpty = 0;

	constructor(public navCtrl: NavController,
		public modalCtrl: ModalController,
		public restApi: RestApiProvider,
		public loadingCtrl: LoadingController,
		public events: Events,
		public navParams: NavParams,
  ) {

		this.getQuestionsByTheme(1);

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BaiPage');
	}

	getQuestionsByTheme(idTheme) {

		// 1 = education
		// 2 = social
		// 3 = urbanisme
		// 4 = animation

		let loading = this.loadingCtrl.create({
			content: 'Veuillez patienter...'
		});

		loading.present();


		this.restApi.listeQuestionsByTheme(global.villeEncours, idTheme).subscribe(
			data => {
				//this.dataVille = data.results;
				console.log("listeQuestionsByTheme: ", data);

				this.isEmpty = 0;
				this.questions = data;
				this.isEmpty = data.length;

			},
			err => {
				console.log("listeQuestionsByTheme err: ", err);
				loading.dismiss();

				this.restApi.checkErr(err.status);


			},
			() => {
				//console.log('getHomeData Complete');
				loading.dismiss();
			}
		);


	}

	detailQuestion(id) {
		//console.log(id);
		let myModal = this.modalCtrl.create('BaiDetailPage', { baiId: id });
		myModal.present();
	}

}
