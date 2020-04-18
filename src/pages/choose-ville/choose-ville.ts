import { PreSignupPage } from './../pre-signup/pre-signup';
import { SignupPage } from './../signup/signup';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { SearchMairiePage } from '../search-mairie/search-mairie';
import { AddMairiePage } from '../add-mairie/add-mairie';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import _ from "lodash";

/**
 * Generated class for the ChooseVillePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-choose-ville',
  templateUrl: 'choose-ville.html',
})
export class ChooseVillePage {
  OneForm: FormGroup;
  maVille: any;
  maVilleId: any;
  villes: any;

  constructor(
    public formBuilder: FormBuilder,
    public restApi: RestApiProvider,
    public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController  ) {

    this.OneForm = formBuilder.group({
			ville: [this.villes, Validators.required]
    });

    this.initializeVilles();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseVillePage');
  }

 goToRegister(){

  console.log(this.OneForm.get('ville').value);
   this.navCtrl.push(PreSignupPage, {
     ville: this.OneForm.get('ville').value
   })
 }

 addmairie() {
  this.navCtrl.push(AddMairiePage);
  }

  initializeVilles() {

		this.restApi.listeAllVilles().subscribe(
			data => {

				this.villes = [];
				//this.dataVille = data.results;
				console.log("listeAllVilles: ", data);

				for (let d of data) {
          if(d.nom != null && d.nom != 'null' && (d.nom && d.nom.length > 0)) {
            this.villes.push({nom: d.nom, id: d.id});
          }
				}

				this.villes = _.sortBy(this.villes, 'nom')

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
}
