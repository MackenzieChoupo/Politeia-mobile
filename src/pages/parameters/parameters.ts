import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Storage } from "@ionic/storage";
import * as _ from 'lodash';


/**
 * Generated class for the ParametersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-parameters",
  templateUrl: "parameters.html"
})
export class ParametersPage {
  public notificationsSettings: Array<{
    id: number;
    title: string;
    disabled?: boolean;
    checked: boolean;
    color: string;
  }>;

  alreadySaved = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public restApi: RestApiProvider,
  ) {
    this.notificationsSettings = [
      {
        id: 1,
        title: "Alertes",
        disabled: true,
        checked: true,
        color: "darkPink"
      },
      { id: 2, title: "Actualités", checked: true, color: "orange" },
      { id: 3, title: "Sondages", checked: true, color: "lightCream" },
      { id: 4, title: "Boite à idées", checked: true, color: "navyBlue" },
      { id: 5, title: "Signalements", checked: true, color: "dark" }
    ];
  }

  ionViewDidLoad() {
    this.storage.get("notificationsSettings").then(value => {
      if (value) {
        this.notificationsSettings = value;
      }
    });

    console.log(this.notificationsSettings);
  }

  ionViewWillLeave(){
    if(!this.alreadySaved){
      this.save();
    }
  }

  save() {
    this.storage.set("notificationsSettings", this.notificationsSettings).then(
      result => this.sendToServer()
    );
    }

  sendToServer(){
    this.restApi.sendNotificationParameters(this.notificationsSettings).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.restApi.checkErr(err.status);
      },
    );
  }


  public propertyToggled = _.debounce(async (nT) => {
    this.notificationsSettings;
    this.notificationsSettings.map((nTS, i) => {
      if (nTS.id == nT.id) {
        this.notificationsSettings[i] = nT;
      }
    });

    this.save();
    this.alreadySaved = true;
  }, 500);
}
