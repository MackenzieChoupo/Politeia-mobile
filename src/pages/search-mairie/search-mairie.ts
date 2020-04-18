import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { Events } from 'ionic-angular';
import { AddMairiePage } from '../add-mairie/add-mairie';
import * as _ from 'lodash';


/**
 * Generated class for the SearchMairiePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-mairie',
  templateUrl: 'search-mairie.html',
})
export class SearchMairiePage {

  items:any=[];
  itemBCK:any=[];
  isMyCompte : any;
  listAll : any = [];
  listMesVilles : any = [];

  constructor(public navCtrl: NavController,
            public navParams: NavParams,
            public viewCtrl: ViewController,
            public restApi: RestApiProvider,
            public events: Events
            ) {

    this.isMyCompte = this.navParams.get('myCompte')
  }

  ionViewDidLoad() {
    this.initializeItems();
  }

  close(item) {
    if(!this.isMyCompte) {
      this.events.publish('ville:add', item.id);
    }else {
      this.navParams.get('callbackFunction')(item.id)
    }

    this.viewCtrl.dismiss();
  }

  addmairie(){
    this.navCtrl.push(AddMairiePage);
  }

  initializeItems() {
    this.restApi.listeAllVilles().subscribe(
                dataAll => {
                  this.restApi.listeMesVilles().subscribe(
                    data =>{
                      this.items=[];

                      for(let d of data){
                        this.listMesVilles.push({nom: d.nom, id: d.id});
                       }
                      this.listAll = [];

                    for(let d of dataAll){
                      if(d.nom != null && d.nom != 'null' && (d.nom && d.nom.length > 0)) {
                      this.itemBCK.push({nom: d.nom, id: d.id});
                      this.listAll.push({nom: d.nom, id: d.id});
                      }
                     }

                     if(this.isMyCompte) {
                      this.items = this.listMesVilles;
                      }else {
                        this.items = this.listAll;
                      }

                      this.itemBCK = this.listAll;
                    }
                  )

                },
                err => {
                    this.restApi.checkErr(err.status);
                }
            );

  }

  getItems(ev: any) {
    // Reset items back to all of the items
        this.items=this.listAll ;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.nom.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      if(this.isMyCompte) {
        this.items=this.listMesVilles;
      }
    }
  }

  focused(){
  }
}
