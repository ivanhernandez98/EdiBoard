
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './pages/board/board.component';
import { HeaderComponent } from './layout/header/header.component';
import { BodyComponent } from './layout/body/body.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { HttpClientModule } from '@angular/common/http';

/* COMPONENTES PARA VISTA */
import { KeyFilterModule } from 'primeng/keyfilter';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';


import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { MetricosComponent } from './pages/metricos/metricos.component';
import { ViajesComponent } from './pages/viajes/viajes.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BoardComponent,
    HeaderComponent,
    BodyComponent,
    MetricosComponent,
    ViajesComponent,
    FooterComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    KeyFilterModule,
    GoogleMapsModule,
    BrowserAnimationsModule,
    TableModule,
    DataViewModule,
    HttpClientModule,
    AppRoutingModule,
    IonicModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
