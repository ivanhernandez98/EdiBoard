import { LivetrackingEdiPage } from './pages/livetracking-edi/livetracking-edi.page';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { LivetrackingEdiPageModule } from './pages/livetracking-edi/livetracking-edi.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BoardComponent,
    HeaderComponent,
    BodyComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    KeyFilterModule,
    GoogleMapsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    IonicModule.forRoot({}),
    LivetrackingEdiPageModule, // Agrega el módulo aquí si usas carga perezosa
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
