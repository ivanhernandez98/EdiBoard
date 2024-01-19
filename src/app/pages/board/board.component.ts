// board.component.ts

import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EdiBoardService } from 'src/app/data/services/access/estatus-shipment.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { PosicionViajesModel } from 'src/app/models/PosicionesViajesModelEdi';
import { Observable, Subscription, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('shipmentsTable', { static: false }) shipmentsTable!: ElementRef;
  @ViewChild('detallesTable', { static: false }) detallesTable!: ElementRef;

  public dataSingleEdiResultHeader$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  public dataSingleEdiResult$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  private dataSingleEdiResultSubscription: Subscription | undefined;

/*   private svgMap: { [key: string]: string } = {};
  public svgActual: string = ''; // Agrega esta línea */
  private autoScrollInterval: any;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private ediAuthService: EdiBoardService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ){
  }

  // Método para obtener las entradas del objeto
  getObjectEntries(obj: any): any[] {
    return Object.entries(obj);
  }

  ngAfterViewInit(): void {
    this.dataSingleEdiResultSubscription = this.sharedService.dataSingleEdiResult$.subscribe(
      (dataSingleEdiResult) => {
        // Actualiza la vista
        this.dataSingleEdiResultHeader$ = of(dataSingleEdiResult?.header);
        this.dataSingleEdiResult$ = of(dataSingleEdiResult);

        // Realiza la detección de cambios manualmente
        this.cdr.detectChanges();

        console.log(dataSingleEdiResult);
        // Resto del código
      }
    );
  }

  ngOnDestroy(): void {
    this.dataSingleEdiResultSubscription?.unsubscribe();
    this.clearAutoScrollInterval();
  }

  private addAutoScrollEvent(table: HTMLTableElement): void {
    this.autoScrollInterval = setInterval(() => {
      table.scrollLeft += 5; // Ajusta la velocidad de desplazamiento según tu preferencia
    }, 50); // Ajusta el tiempo de espera según tu preferencia
  }

  private clearAutoScrollInterval(): void {
    clearInterval(this.autoScrollInterval);
  }

/*   private addScrollEvent(table: HTMLTableElement): void {
    let isHovered = false;

    this.renderer.listen(table, 'mouseover', () => {
      isHovered = true;
    });

    this.renderer.listen(table, 'mouseout', () => {
      isHovered = false;
    });

    const scrollTable = () => {
      if (!isHovered) {
        table.scrollLeft += 5; // Ajusta la velocidad de desplazamiento según tu preferencia
        setTimeout(scrollTable, 50); // Ajusta el tiempo de espera según tu preferencia
      }
    };
    scrollTable();
  } */
}
