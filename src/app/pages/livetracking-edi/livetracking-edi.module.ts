import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { LivetrackingEdiPage } from './livetracking-edi.page';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { LivetrackingEdiPageRoutingModule } from './livetracking-edi-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ToastModule,
    ButtonModule,
    TagModule,
    LivetrackingEdiPageRoutingModule
  ],
  providers: [MessageService],
  declarations: [LivetrackingEdiPage]
})
export class LivetrackingEdiPageModule {}
