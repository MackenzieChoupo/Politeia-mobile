import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { CacheService } from "ionic-cache";
import { global } from "../../app/global";
import { AlertController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import * as _ from 'lodash';
import 'rxjs/Rx';
import { ToastController } from 'ionic-angular';



/*
  Generated class for the RestApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestApiProvider {

  b64: string = '';
  theheader = new Headers();
  noConnectionAlert;
  cantLoginAlert : any;
  oopsAlert : any;

  //baseUrl:string ="/politeia/";

 // production

  baseUrlApi = "http://api.politeia-france.fr/";
 // baseUrlApi = "http://api.staging.politeia-france.fr/";

  constructor(public http: Http,
    private cache: CacheService,
    public alertCtrl: AlertController,
    private transfer: FileTransfer,
    public toastCtrl: ToastController,
  ) {

    //console.log('Hello RestApiProvider Provider');


  }


  getHeader() {
    //console.log('get header:',global);
    let h = new Headers();

    this.b64 = global.token;
    h.append('Authorization', 'Basic ' + this.b64);

    return h;
  }



  infosMairie(idmairie) {
    let url = this.baseUrlApi + 'mairie/' + idmairie;
    let cacheKey = url;
    let ttl = 15;
    let groupKey = "groupe";
    console.log('calling infos mairie');
    let request = this.http.get(url).map(res => res.json());

    return this.cache.loadFromObservable(cacheKey, request, groupKey, ttl);
  }

  getPlanning(idmairie) {
    let url = this.baseUrlApi + 'mairie/' + idmairie + '/planning';
    let request = this.http.get(url, { headers: this.getHeader() }).map(res => res.json());
    return request;
    //return request;
  }

  listeMesVilles() {
    let url = this.baseUrlApi + 'user/abonnement';

    let request = this.http.get(url, { headers: this.getHeader() }).map(res => res.json());
    return request;
  }

  listeSondages(idmairie) {
    let url = this.baseUrlApi + 'sondage/mairie/' + idmairie;
    let cacheKey = url;
    let ttl = 5; // 5mn
    let groupKey = "groupe";


    //let request = this.http.get(url,{headers: this.theheader}).map(res => res.json());
    let request = this.http.get(url, { headers: this.getHeader() }).map(res => res.json());

    return this.cache.loadFromObservable(cacheKey, request, groupKey, ttl);
  }

  listeResultatsSondages(idmairie) {
    let url = this.baseUrlApi + 'sondage/mairie/' + idmairie + "/resultat";
    let cacheKey = url;
    let ttl = 5;
    let groupKey = "groupe";


    //let request = this.http.get(url,{headers: this.theheader}).map(res => res.json());
    let request = this.http.get(url, { headers: this.getHeader() }).map(res => res.json());

    return this.cache.loadFromObservable(cacheKey, request, groupKey, ttl);
  }

  infosUser() {
    //console.log("liste mes infos", global);
    let url = this.baseUrlApi + 'user';
    let cacheKey = url;
    let ttl = 15;
    let groupKey = "user";


    let request = this.http.get(url, { headers: this.getHeader() }).map(res => res.json());

    return this.cache.loadFromObservable(cacheKey, request, groupKey, ttl);
    //return request;
  }

  loginCheck() {
    let url = this.baseUrlApi + 'user';

    return this.http.get(url, { headers: this.getHeader() }).map(res => res.json());
  }

  clearCacheMesVilles() {
    this.cache.clearGroup("mesvilles");
  }

  clearCache() {
    this.cache.clearAll();
  }

  listeAllVilles() {
    let url = this.baseUrlApi + 'mairie';
    let cacheKey = url;
    let ttl = 600; // 5mn
    let groupKey = "groupe";
    let request = this.http.get(url).map(res => res.json());

    return this.cache.loadFromObservable(cacheKey, request, groupKey, ttl);
  }

  listeNews(idville) {

    let url = this.baseUrlApi + 'news/mairie/' + idville;
    let cacheKey = url;
    let ttl = 20;
    let groupKey = "groupe";
    let request = this.http.get(url, { headers: this.getHeader() }).map(res => res.json());

    return request;
  }

  listeSignalements(idville) {

    let url = this.baseUrlApi + 'signalement/mairie/' + idville;
    let cacheKey = url;
    let ttl = 20;
    let groupKey = "groupe";
    let request = this.http.post(url, idville,{ headers: this.getHeader() }).map(res => res.json());

    return this.cache.loadFromObservable(cacheKey, request, groupKey, ttl);
  }

  listeSignalementsProches(lat, lng, categoryId) {

    let url = this.baseUrlApi + 'signalement/position/' + lat + '/'+lng + '/' + categoryId;
    let cacheKey = url;
    let ttl = 20;
    let groupKey = "groupe";
    let request = this.http.get(url,{ headers: this.getHeader() }).map(res => res.json());

    return this.cache.loadFromObservable(cacheKey, request, groupKey, ttl);
  }

  signalementAdd(data) {

    // data au format json pour l'API
    let url = this.baseUrlApi + 'signalement';

    let dataPost = data;

    let request = this.http.post(url, dataPost, { headers: this.getHeader() }).map(res => res.json());

    //console.log('signalementAdd API: ', data);
    return request;

  }

  confirmSignalement(id) {

    let url = this.baseUrlApi + 'signalement/' + id + '/confirmation';

    let request = this.http.put(url, null, { headers: this.getHeader() }).map(res => res.json());
    //console.log('confirmSignalement PUT Api: ', url);

    return request;
  }

  detailNews(idnews) {

    let url = this.baseUrlApi + 'news/' + idnews;
    let cacheKey = url;
    let ttl = 10;
    let groupKey = "groupe";
    let request = this.http.get(url, { headers: this.getHeader() }).map(res => res.json());

    return request;
  }

  villeAdd(idville) {

    let url = this.baseUrlApi + 'user/abonnement/' + idville;


    let request = this.http.post(url, null, { headers: this.getHeader() }).map(res => res.json());
    //console.log('villeAdd Post Api: ', url);

    return request;


  }

  villeDelete(idville) {
    let url = this.baseUrlApi + 'user/abonnement/' + idville;

    let request = this.http.delete(url, { headers: this.getHeader() }).map(res => res.json());
    return request;
  }

  signup(data) {

    // data au format json pour l'API
    let url = this.baseUrlApi + 'user';

    let dataPost = data;


    let request = this.http.post(url, dataPost).map(res => res.json());

    //console.log('signup Post Api: ', data);

    return request;


  }

  updateUser(data) {

    // data au format json pour l'API
    let url = this.baseUrlApi + 'user';

    let dataPost = data;


    let request = this.http.put(url, dataPost, { headers: this.getHeader() }).map(res => res.json());


    return request;
  }

  pushFirebaseTokenToDB(firebaseToken){
    let url = this.baseUrlApi + 'user/addTokenAction';
    return this.http.put(url, {deviceToken : firebaseToken}, { headers: this.getHeader() }) .map(res => res.json())
      .subscribe(statedata => {
        statedata;
        console.log("States : ", statedata);
      });
  }


  onc(apnToken) {
    let header = new Headers();

    header.append('Authorization', 'key=' + 'AAAAxVsh_t4:APA91bHAcWTOpYmzVhSfj1m0U5-QGlluAlpW15j7k_sY6hWczhRwHvT43nVllzFISz1w_9NdCZSnZ044rINUKaT-FsCxIuTzfZ-41s43XpFhw5EQieILzu0kl6-zOHfkJU5LH63rybPz3MrAKKAfKw2sLi_uYie7Ow');


    let data = {
      "application": "fr.politeiafrance.app",
      "sandbox":false,
      "apns_tokens":[apnToken]
    };

    return this.http.post("https://iid.googleapis.com/iid/v1:batchImport", data, {headers: header}).map(res => res.json());
  }




  recupMDP(data) {

    // data au format json pour l'API
    let url = this.baseUrlApi + 'user/password/request';

    let dataPost = data;

    let request = this.http.post(url, dataPost).map(res => res.json());

    //console.log('recupMDP Api: ', data);

    return request;


  }

  mairieDemande(data) {

    // data au format json pour l'API
    let url = this.baseUrlApi + 'mairie/demande';

    let dataPost = data;

    let request = this.http.post(url, dataPost, { headers: this.getHeader() }).map(res => res.json());

    //console.log('mairieDemande API: ', data);

    return request;

  }



  detailSignalement(id) {

    let url = this.baseUrlApi + 'signalement/' + id;
    let cacheKey = url;
    let ttl = 30;
    let groupKey = "groupe";
    let request = this.http.get(url, { headers: this.getHeader() }).map(res => res.json());

    return this.cache.loadFromObservable(cacheKey, request, groupKey, ttl);
  }

  listeQuestionsByTheme(idville, idtheme) {

    // 1 = education
    // 2 = social
    // 3 = urbanisme
    // 4 = animation

    let url = this.baseUrlApi + 'boiteaidee/question/mairie/' + idville + '/' + idtheme;
    let cacheKey = url;
    let ttl = 60;
    let groupKey = "groupe";
    let request = this.http.get(url, { headers: this.getHeader() }).map(res => res.json());

    return this.cache.loadFromObservable(cacheKey, request, groupKey, ttl);
  }

  listeReponsesQuestion(id) {

    let url = this.baseUrlApi + 'boiteaidee/question/' + id + '/reponse';
    let cacheKey = url;
    let ttl = 5;
    let groupKey = "groupe";
    let request = this.http.get(url, { headers: this.getHeader() }).map(res => res.json());

    return this.cache.loadFromObservable(cacheKey, request, groupKey, ttl);
  }

  addReponse(data) {

    // data au format json pour l'API
    let url = this.baseUrlApi + 'boiteaidee/reponse';

    let dataPost = data;


    let request = this.http.post(url, dataPost, { headers: this.getHeader() }).map(res => res.json());

    //console.log('addReponse Api: ', data);

    return request;


  }

  voterSondage(id, data) {
    //   PUT /sondage/{id}/vote
    // {id} est l'id du sondage
    // avec comme body :
    // {
    //     "vote": {
    //         "reponse": 3
    //     }
    // }

    // data au format json pour l'API
    let url = this.baseUrlApi + 'sondage/' + id + '/vote';

    let dataPost = data;


    let request = this.http.put(url, dataPost, { headers: this.getHeader() }).map(res => res.json());

    //console.log('voterSondage Put Api: ', data);

    return request;
  }


  sendNotificationParameters(notificationsParams) {

    console.log(notificationsParams);

    var filteredParams = _.chain(notificationsParams).map(notificationParam => _.omit(notificationParam, ['title', 'color'])).keyBy('id').mapValues('checked').value();


      // data au format json pour l'API
      let url = this.baseUrlApi + 'user/notificationsparams';

      let dataPost = {parameters : filteredParams};

      console.log(dataPost)

      let request = this.http.post(url, dataPost, { headers: this.getHeader() }).map(res => res.json());
      return request;
    }

  uploadFile(imageURI, id) {


    const fileTransfer: FileTransferObject = this.transfer.create();

    let url = this.baseUrlApi + 'signalement/' + id + '/photo';

    let options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: 'nomfichier',
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers:  this.getHeader()
    }

    fileTransfer.upload(imageURI, url, options)
      .then((data) => {

        //console.log(data + " Uploaded Successfully");



      }, (err) => {
        //console.log(err);

        let alert = this.alertCtrl.create({
          title: 'Votre image n\'a pas pu être envoyée.',
          subTitle: '',
          buttons: ['OK']
        });
        alert.present();

      });
  }

  checkErr(status) {

    if (status == "403") {

      let alert = this.alertCtrl.create({
        title: 'Erreur de Login ou mot de passe...',
        subTitle: 'Votre identifiant ou votre mot de passe ne fonctionnent pas.',
        buttons: ['OK']
      });
      alert.present();

    } else if (status == "400") {

      let alert = this.alertCtrl.create({
        title: 'Ooops !',
        subTitle: 'Cette opération est impossible.',
        buttons: ['OK']
      });
      alert.present();


    } else if (status == "404") {

    } else {

      this.noConnectionAlert = this.toastCtrl.create({
        message: 'La connexion internet/3G ne fonctionne pas.',
        duration: 3000,
        position: 'bottom'
      });

      this.noConnectionAlert.present();

    }

  }
}

