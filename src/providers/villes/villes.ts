import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { global } from "../../app/global";
import { Storage } from '@ionic/storage';
import _ from 'lodash';

/*
  Generated class for the VillesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VillesProvider {

  mesVillesData: any = [];

  constructor(public http: Http,
              public restApi: RestApiProvider,
              private storage: Storage,
            private events: Events) {
  }


  async getMesVilles() {
    return new Promise(resolve=>{
      this.restApi.listeMesVilles().subscribe(
      data => {
        console.log(data);
        this.mesVillesData = [];
        for (let d of data) {
          if (d.principale == "1") {
            this.mesVillesData.push({"id": d.id, "nom": d.nom, "encours": true});
            this.storage.set('storeVillePrincipale', d.id);
          } else {
            this.mesVillesData.push({"id": d.id, "nom": d.nom, "encours": false});
          }
        }

        this.mesVillesData = _.sortBy(this.mesVillesData, 'nom');

        resolve(this.mesVillesData);
      },
      err => {
        this.restApi.checkErr(err.status);
        resolve([]);
      }
    )
  })
  }


  setVilleEnCours(id) {
    global.villeEncours = id;

    if (id) {
      this.restApi.infosMairie(id).subscribe(
        data => {
          global.displayReports = data['reports_enabled'];
        })
    }

    this.events.publish('villeEnCoursUpdated', id);
  };


  async getMaVillePrincipale() {
    console.log('getting ville principale');
    return new Promise(resolve=> {
      this.storage.get("storeVillePrincipale").then(val => {
        if (val != null && val != undefined) {
          global.villeEncours = val;
          this.events.publish('villeEnCoursUpdated', val);
          resolve(val);
        } else {
          this.restApi.listeMesVilles().subscribe(
            data => {
              var villePrincipale = _.find(data, function (d) {
                return d.principale
              });
              if (villePrincipale != undefined) {
                this.storage.set('storeVillePrincipale', villePrincipale.id);
                global.villeEncours = villePrincipale.id;
                this.events.publish('villePrincipaleUpdated', villePrincipale.id);
                this.events.publish('villeEnCoursUpdated', villePrincipale.id);
                resolve(villePrincipale.id);
              } else {
                throw Error('no ville en cours');
              }
            },
            (err) => {
              throw Error('no ville en cours');
            }
          );
        }
      });
    })
  }


  async addVille(idVille){
        return new Promise(resolve=> {
    this.restApi.villeAdd(idVille).subscribe(
      data => {
        resolve(true);
      },
      err => {
        this.restApi.checkErr(err.status);
        resolve(false);
      }
    );
  })
  }

  async deleteVille(idVille){
        return new Promise(resolve=> {
    this.restApi.villeDelete(idVille).subscribe(
      data => {
        resolve(true);
      },
      err => {
        this.restApi.checkErr(err.status);
        resolve(false);
      }
    );
  })
  }



}
