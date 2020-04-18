import {enableProdMode} from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';


// prod mod avant tout le reste
enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
