
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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';

import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { MetricosComponent } from './pages/metricos/metricos.component';
import { ViajesComponent } from './pages/viajes/viajes.component';
import { ViajesMapboxComponent } from './pages/viajesMapbox/viajesMapbox.component';
import { ReportesComponent } from './pages/Reportes/Reportes.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BoardComponent,
    HeaderComponent,
    BodyComponent,
    MetricosComponent,
    ViajesComponent,
    ViajesMapboxComponent,
    ReportesComponent,
    FooterComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    KeyFilterModule,
    GoogleMapsModule,
    BrowserAnimationsModule,
    ProgressSpinnerModule,
    DialogModule,
    ButtonModule,
    TableModule,
    MessagesModule,
    DataViewModule,
    HttpClientModule,
    AppRoutingModule,
    IonicModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
