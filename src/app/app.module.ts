import { Badge } from '@ionic-native/badge';
import { PreSignupPageModule } from './../pages/pre-signup/pre-signup.module';
import { ParametersPageModule } from './../pages/parameters/parameters.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicPageModule } from 'ionic-angular';
import { CacheModule } from 'ionic-cache';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { FileOpener } from '@ionic-native/file-opener';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestApiProvider } from '../providers/rest-api/rest-api';
import { VillesProvider } from '../providers/villes/villes';
import { Push } from "@ionic-native/push";
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Injectable, Injector } from '@angular/core';

import { NativeGeocoder} from '@ionic-native/native-geocoder';
import { HomePage } from "../pages/home/home";
import { IntroPage } from "../pages/intro/intro";
import { AddMairiePage } from "../pages/add-mairie/add-mairie";
import { AidePage } from "../pages/aide/aide";
import { BaiPage } from "../pages/bai/bai";
import { DetailPage } from "../pages/detail-page/detail-page";
import { InfosmairiePage } from "../pages/infosmairie/infosmairie";
import { ListPage } from "../pages/list/list";
import { LoginPage } from "../pages/login/login";
import { MonComptePage } from "../pages/mon-compte/mon-compte";
import { SearchMairiePage } from "../pages/search-mairie/search-mairie";
import { SignalAddPage } from "../pages/signal-add/signal-add";
import { SignalPage } from "../pages/signal/signal";
import { SignalDetailPage } from "../pages/signal-detail/signal-detail";
import { SignupPage } from "../pages/signup/signup";
import { PreSignupPage } from "../pages/pre-signup/pre-signup";
import { SondagePage } from "../pages/sondage/sondage";
import { WelcomePage } from "../pages/welcome/welcome";
import { IntroPageModule } from "../pages/intro/intro.module";
import { AidePageModule } from "../pages/aide/aide.module";
import { AddMairiePageModule } from "../pages/add-mairie/add-mairie.module";
import { BaiPageModule } from "../pages/bai/bai.module";
import { DetailPageModule } from "../pages/detail-page/detail-page.module";
import { HomePageModule } from "../pages/home/home.module";
import { InfosmairiePageModule } from "../pages/infosmairie/infosmairie.module";
import { ListPageModule } from "../pages/list/list.module";
import { LoginPageModule } from "../pages/login/login.module";
import { MonComptePageModule } from "../pages/mon-compte/mon-compte.module";
import { SearchMairiePageModule } from "../pages/search-mairie/search-mairie.module";
import { SignalAddPageModule } from "../pages/signal-add/signal-add.module";
import { SignalPageModule } from "../pages/signal/signal.module";
import { SignalDetailPageModule } from "../pages/signal-detail/signal-detail.module";
import { SignupPageModule } from "../pages/signup/signup.module";
import { WelcomePageModule } from "../pages/welcome/welcome.module";
import { SondagePageModule } from "../pages/sondage/sondage.module";
import { TabsPageModule } from "../pages/tabs/tabs.module";
import { ParametersPage } from '../pages/parameters/parameters';
import { ChooseVillePage } from '../pages/choose-ville/choose-ville';
import { ChooseVillePageModule } from '../pages/choose-ville/choose-ville.module';
import { ImagePicker } from '@ionic-native/image-picker';
import { StreamingMedia } from '@ionic-native/streaming-media';


@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      monthShortNames: ['jan', 'fev', 'mar', 'avr', 'mai', 'juin', 'jui', 'aou', 'sep', 'oct', 'nov', 'dec'],
      backButtonText: 'Retour'
    }),
    IonicStorageModule.forRoot(),
    IonicPageModule.forChild(TabsPage),
    CacheModule.forRoot(),
    TabsPageModule,
    IntroPageModule,
    AddMairiePageModule,
    AidePageModule,
    BaiPageModule,
    DetailPageModule,
    HomePageModule,
    InfosmairiePageModule,
    IntroPageModule,
    ListPageModule,
    LoginPageModule,
    MonComptePageModule,
    SearchMairiePageModule,
    SignalAddPageModule,
    SignalPageModule,
    SignalDetailPageModule,
    SignupPageModule,
    SondagePageModule,
    WelcomePageModule,
    HomePageModule,
    ParametersPageModule,
    ChooseVillePageModule,
    PreSignupPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    IntroPage,
    AddMairiePage,
    AidePage,
    BaiPage,
    DetailPage,
    HomePage,
    InfosmairiePage,
    IntroPage,
    ListPage,
    LoginPage,
    MonComptePage,
    SearchMairiePage,
    SignalAddPage,
    SignalPage,
    SignalDetailPage,
    SignupPage,
    SondagePage,
    WelcomePage,
    ParametersPage,
    ChooseVillePage,
    PreSignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    IonicErrorHandler,
        [{ provide: ErrorHandler, useClass: MyErrorHandler }],
    RestApiProvider,
    VillesProvider,
    FileTransfer,
    FileTransferObject,
    File,
    Camera,
    FileOpener,
    Push,
    Geolocation,
    Diagnostic,
    NativeGeocoder,
    ImagePicker,
    StreamingMedia,
    Badge,
  ]
})
export class AppModule {
}
