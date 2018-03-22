import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import {Module} from "./module";



import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { LoginComponent } from './login/login.component';
import {ConfigService} from "./service/config.service";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,

  ],
  imports: [
    BrowserModule,
    Module,
    AppRoutingModule
  ],
  providers: [
    ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
