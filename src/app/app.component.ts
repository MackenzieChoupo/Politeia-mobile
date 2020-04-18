import {Component, ViewChild} from "@angular/core";
import {Nav, Platform, Events, AlertController} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {CacheService} from "ionic-cache";

import {global} from "./global";

import {ListPage} from "../pages/list/list";
import {TabsPage} from "../pages/tabs/tabs";
import {MonComptePage} from "../pages/mon-compte/mon-compte";
import {AidePage} from "../pages/aide/aide";
import {IntroPage} from "../pages/intro/intro";

import {WelcomePage} from "../pages/welcome/welcome";

import {Storage} from "@ionic/storage";
import { Badge } from '@ionic-native/badge';


import {RestApiProvider} from "../providers/rest-api/rest-api";

import { Push, PushObject, PushOptions } from "@ionic-native/push";
import {ParametersPage} from "../pages/parameters/parameters";
import {Observable} from "rxjs";
import _ from "lodash";

import {
  setIntervalAsync,
  clearIntervalAsync
} from 'set-interval-async/dynamic'
import { ThrowStmt } from "@angular/compiler/src/output/output_ast";
import { VillesProvider } from '../providers/villes/villes';



@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;

  rootPage: any = "";
  task: any;

  pages: Array<{
    title: string;
    component: any;
    alertes: number;
    icone: string;
  }>;

  tokenSent: boolean = false;

  constructor(
    public platform: Platform,
    cache: CacheService,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private storage: Storage,
    public restApi: RestApiProvider,
    private push: Push,
    public events: Events,
    public alertCtrl: AlertController,
    public badge: Badge,
    private villesProvider: VillesProvider
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // gestion du cache ----
      // Set TTL to 15mn
      cache.setDefaultTTL(60 * 15); // secondes

      // Keep our cached results when device is offline!
      cache.setOfflineInvalidate(true);
      // END cache ----

      if (this.platform.is("cordova")) {
        this.badge.clear();
        this.getPush();
      }

      this.events.subscribe("logged", (firstTime) => {
        this.determineIfUserIsReady(firstTime).then(() => this.setPages());
      });

      this.events.subscribe("villeEnCoursUpdated", () => {
          this.loadEverythingForVille("villeEnCoursUpdated");
      });

      this.events.publish("logged", false);
    });

  }

  setPages(){
    this.pages = [
      {title: "Mes organismes", component: ListPage, alertes: 0, icone: "home"},

      {
        title: "Mon compte",
        component: MonComptePage,
        alertes: 0,
        icone: "person"
      },
      {
        title: "Paramètres",
        component: ParametersPage,
        alertes: 0,
        icone: "settings"
      },
      {title: "Aide", component: AidePage, alertes: 0, icone: "help"}
    ];
  }

  async determineIfUserIsReady(firstTime) {
    this.checkForToken().then(() => this.connected()).catch(() => {
      this.redirectToHomePage();
    });
  }

  getPush() {
    console.log('get push');
    if (this.platform.is("cordova")) {
            const options: PushOptions = {
              android: {
                senderID: "847637511902",
                icon: "iconNotif",
                iconColor: "#0084c8",
                vibrate: true,
                forceShow: true,
                clearBadge: "true"
              },
              ios: {
                alert: "true",
                badge: "true",
                sound: "true",
                fcmSandbox: false,
                clearBadge: "true"
              }
            };

            const pushObject: PushObject = this.push.init(options);

            this.push.createChannel({
              id: "politeiaChannel",
              description: "Politeia's Channel",
              // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
              importance: 3
            });

            pushObject.on("registration").subscribe((registration: any) => {
              console.log('registered');
              this.restApi.pushFirebaseTokenToDB(registration.registrationId);
            });

            pushObject
              .on("error")
              .subscribe(error => console.error("Error with Push plugin", error));
    }
  }

  openPage(page) {
    this.nav.push(page.component);
  }

  async connected() {
      this.checkForToken().then(token => {
        global.token = token;

        this.getPush();

        if(global.villeEncours == null) {
          this.villesProvider.getMaVillePrincipale().then((ville) => console.log('ville id ' + ville)).catch(() => this.redirectToHomePage());
        }else {
          this.loadEverythingForVille("ville was not null")
        }
      }).catch(() => this.redirectToHomePage());
  }


  async loadEverythingForVille(from){
    console.log("loading everything for ville " + from);
    return Promise.all([
      this.getListNews(),
      this.getListSignalements(),
      this.countBAI(global.villeEncours),
      this.getInfosMairie(),
      this.getListSondages()]).then(() => {

      this.proceedToTabsPage();

      this.getListResultatsSondages();

    }).catch(() => this.redirectToHomePage());
  }

  async handleLatestNewsAndSignalementsChecks(){
    this.events.subscribe('signalements:check', () => {
      this.getListSignalements();
    });

    const refreshSignalementsEveryMin = setIntervalAsync(() =>
      this.getListSignalements(),
      5000
    );

    this.events.subscribe('news:check', () => {
      this.getListNews();
    });

    const refreshNewsEveryMin = setIntervalAsync(() =>
      this.getListNews(),
      5000
    );


  }

  async proceedToTabsPage() {
    if(this.rootPage != TabsPage){
        this.rootPage = TabsPage;
      }
  }

  async checkForToken() {
    return this.storage.get("storeToken")
      .then(val => {
        if (val != null && val != undefined) {
          return (val)
        } else {
          throw Error('no token');
        }
      }).catch(er => {
        throw Error('no token');
      });
  }

  async checkReportsEnabled() {
        var data = global.infosMairie;
        global.displayReports = data["reports_enabled"];
        this.events.publish("displayReports:change");
        return (global.displayReports);
  }

  async getListSignalements() {
    this.restApi.listeSignalements(global.villeEncours).subscribe(
      data => {
        var previousSignalements = global.signalements;

        this.syncLocalStorageCountWithRemoteLatest(data, 'signauxLu', "nbSignal", 'nbsignalements:fresh');
        global.signalements = data;

        if(previousSignalements != global.signalements){
          this.events.publish('signalements:fresh', data);
        }
      }
    );
  }

  async getListNews() {
    this.restApi.listeNews(global.villeEncours).subscribe(
      data => {
        var previousNews = global.news;

        global.news = data;
        this.syncLocalStorageCountWithRemoteLatest(data, 'storeIdNewsLu', "nbNews", 'nbnews:fresh');

        if(previousNews != global.news){
          this.events.publish('news:fresh', data);
        }
      }
    );
  }

  async getInfosMairie() {
    this.restApi.infosMairie(global.villeEncours).subscribe(
      data => {
        global.infosMairie = data;
          this.events.publish('infosMairie:fresh', data);
          this.checkReportsEnabled();
      }
    );
  }


  async getListSondages() {
    this.restApi.listeSondages(global.villeEncours).subscribe(
      data => {
        var previousSondages = global.sondages;

        global.sondages = data;
        this.syncLocalStorageCountWithRemoteLatest(data, 'sondagesLu', "nbSondage", 'nbSondage:fresh');

        if(previousSondages != global.sondages){
          this.events.publish('sondages:fresh', data);
        }
      },
      error => {
        console.log('no sondages');
      }
    );
  }

  async getListResultatsSondages() {
    this.restApi.listeResultatsSondages(global.villeEncours).subscribe(
      data => {
        var previousResultatsSondages = global.resultatsSondages;

        global.resultatsSondages = data;

        if(previousResultatsSondages != global.resultatsSondages){
          this.events.publish('resultatsSondages:fresh', data);
        }
      },
      error => {
        console.log('no sondages results');
      }
    );
  }

  async countBAI(idville) {
    var listThemes = [1, 2, 3, 4];

    await _.each(listThemes, themeId => {
      this.restApi.listeQuestionsByTheme(idville, themeId).subscribe(
        data => {
          _.each(data, d => {
            global.listBAI = _.union(global.listBAI, [d.id]);
          });
        }
      );
    });

    await console.log(global.listBAI);
    await this.syncLocalStorageCountWithRemoteLatest(global.listBAI, 'baiLu', "nbBAI", 'nbBAI:fresh');
  }

  async syncLocalStorageCountWithRemoteLatest(fromRemote : any, storageKey : string, globalKey : string, eventKey : string) {
    await this.storage.get(storageKey)
      .then((val) => {
        let remaining: any = [];
        if (val) {
          fromRemote = _.map(fromRemote, 'id');
          remaining = _.difference(fromRemote, val);
        }

        global[globalKey] = remaining.length;
        this.events.publish(eventKey, remaining);
      });
  }

redirectToHomePage() {
        this.rootPage = WelcomePage;
  }
}
