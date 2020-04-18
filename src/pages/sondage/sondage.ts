import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, } from 'ionic-angular';
import { Chart } from 'chart.js';
import { LoadingController } from 'ionic-angular';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { global } from "../../app/global";


/**
 * Generated class for the SondagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sondage',
  templateUrl: 'sondage.html',
})
export class SondagePage {

  @ViewChild('pieCanvas') pieCanvas;

  pieChart: any;

  sondage: any = [];
  resultatsSondages: any = 0;
  afficheSondage: any = 0;

  switchVote: boolean = false;
  switchQuestion: boolean = false;
  switchQuestionSuite: boolean = true;

  cacheGraph: boolean = true;

  OneForm: FormGroup;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public restApi: RestApiProvider,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public formBuilder: FormBuilder,
              public events: Events,
              public navParams: NavParams) {


    this.OneForm = formBuilder.group({
      qcm: ["", Validators.required]

    });
  }

  ionViewDidLoad() {
    this.events.subscribe('sondages:fresh', () => {
      this.getListSondages();
    });
    
    this.events.subscribe('resultatsSondages:fresh', () => {
      this.getListResultatsSondages();
    });
  }

  ionViewDidEnter() {
    this.getListSondages();

    this.getListResultatsSondages();
  }

  async getListSondages() {
        this.sondage = global.sondages;

        if (this.sondage.question_cible != '') {
          this.switchQuestion = false;
          this.switchQuestionSuite = true;
        
  }
}

  async getListResultatsSondages() {
    this.resultatsSondages = global.resultatsSondages;

        this.resultatsSondages = this.resultatsSondages;

        for (let a of this.resultatsSondages) {
          this.afficheSondage = a;
          break;
        }

        this.pieChart = this.getPieChart();
  }

  switchVoter() {
    this.switchVote = !this.switchVote;
    if (this.sondage.question_cible) {
      this.switchQuestion = false;
      this.switchQuestionSuite = true;
    } else {

      this.switchQuestion = true;
      this.switchQuestionSuite = false;
    }
  }

  switchSuiteOn() {
    this.switchQuestion = true;
    this.switchQuestionSuite = false;
    console.log('on', this.switchQuestionSuite);
  }

  switchSuiteOff() {
    this.switchQuestion = false;
    this.switchQuestionSuite = false;
    this.switchVote = false;

    let alert = this.alertCtrl.create({
      title: global.villeEncours + ' vous remercie.',
      subTitle: 'Ce sondage ne concerne que les personnes ayant répondu Oui.',
      buttons: ['OK']
    });

    alert.present();

    this.sondage = [];
  }

  getChart(context, chartType, data, options?) {
    return new Chart(context, {
      type: chartType,
      data: data,
      options: options
    });
  }

  getPieChart() {

    if (this.afficheSondage) {

      //labels: ["Non", "Oui"],
      // data: [45, 55],
      let labels = [];
      let datas = [];

      //this.afficheSondage=[];

      for (let r of this.afficheSondage.reponses) {

        labels.push(r.texte);
        datas.push(r.nb_vote);


      }


      console.log("data graph: ", datas);

      let data = {
        labels: labels,
        datasets: [
          {
            data: datas,
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#2ec95c", "#6d3db7", "#3db78b", "#940000", "#000394", "#d00071"]

          }]
      };

      this.cacheGraph = false;
      return this.getChart(this.pieCanvas.nativeElement, "pie", data);
    }


  }


  voter(idsondage) {

    this.switchQuestion = false;
    this.switchVote = false;

    if (this.OneForm.valid) {

      let loading = this.loadingCtrl.create({
        content: 'Veuillez patienter...'
      });

      loading.present();

      //   PUT /sondage/{id}/vote
      // {id} est l'id du sondage
      // avec comme body :
      // {
      //     "vote": {
      //         "reponse": 3
      //     }
      // }

      console.log("reponse QCM:", this.OneForm.get('qcm').value);

      let userData = {
        "vote": {
          "reponse": this.OneForm.get('qcm').value,
        }
      };

      this.restApi.voterSondage(idsondage, userData).subscribe(
        data => {

          let alert = this.alertCtrl.create({
            title: 'Merci pour votre participation.',
            subTitle: '',
            buttons: ['OK']
          });

          alert.present();

          this.events.publish('nbSondage:fresh', 0);
          this.sondage = [];


        },
        err => {
          console.log("voterSondage err: ", err._body);

          let str = err._body;
          let reg = /Vous/gi;


          if (str.match(reg)) {
            this.events.publish('nbSondage:fresh', 0);

            let alert = this.alertCtrl.create({
              title: 'Vous avez déjà voté !',
              subTitle: '',
              buttons: ['OK']
            });

            alert.present();
            this.sondage = [];

          } else {
            this.restApi.checkErr(err.status);
          }


          loading.dismiss();


        },
        () => {
          //console.log('listAllVilles Complete');
          loading.dismiss();

        }
      );


    }

  }

  voirSondage(sondage) {

    // this.resultatsSondages
    this.afficheSondage = sondage;
    this.pieChart = this.getPieChart();

    console.log("affichesondage: ", this.afficheSondage);
  }
}
