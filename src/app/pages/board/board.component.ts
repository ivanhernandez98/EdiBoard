// board.component.ts

import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EdiBoardService } from 'src/app/data/services/access/estatus-shipment.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { PosicionViajesModel } from 'src/app/models/PosicionesViajesModelEdi';
import { Observable, Subscription, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Table } from 'primeng/table';
import { environment } from 'src/app/environments/environment';
import { SortEvent } from 'primeng/api';



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
  private isMouseOverShipmentTable: boolean = false;
  private isMouseOverDetallesTable: boolean = false;
  private autoScrollInterval: any;

  autoNavigateChecked: boolean = false;
  showModal = false;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private ediAuthService: EdiBoardService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ){
  }

  // En tu componente "board"
  ngOnInit(): void {
    this.showModal = false; // Asegúrate de que el modal esté oculto al cargar la vista de "board"

    const duration = environment.duration.board;

    this.sharedService.autoNavigate$.subscribe(autoNavigate => {
      if (autoNavigate && environment.autoNavigate === 1) {
        setTimeout(() => {
          console.log('Tiempo de espera para Board:', duration);
          this.router.navigate(['/metricos']);
        }, duration);
      }
    });
  }


  customSort(event: SortEvent): void {
    // Ordenar el array infoTimeShipments según la columna horasTranscurrido
    if (event.field === 'horasTranscurrido' && event.order !== 0) {
      const order = event.order === 1 ? 1 : -1;

      this.dataSingleEdiResult$.subscribe((currentData: any) => {
        if (currentData && currentData.infoTimeShipments) {
          const sortedData = currentData.infoTimeShipments.slice().sort((a: any, b: any) =>
            (a.horasTranscurrido > b.horasTranscurrido ? order : -order)
          );

          this.sharedService.setDataSingleEdiResult({
            ...currentData,
            infoTimeShipments: sortedData,
          });
        }
      });
    }
  }




  // Método para obtener las entradas del objeto
  getObjectEntries(obj: any): any[] {
    return Object.entries(obj);
  }

  ngAfterViewInit(): void {
    this.dataSingleEdiResultSubscription = this.sharedService.dataSingleEdiResult$.subscribe(
      (dataSingleEdiResult) => {
        this.dataSingleEdiResultHeader$ = of(dataSingleEdiResult?.header);
        this.dataSingleEdiResult$ = of(dataSingleEdiResult);

        this.cdr.detectChanges();

        // Agregar eventos de desplazamiento automático
        this.addAutoScrollEvent(this.shipmentsTable.nativeElement);
        this.addAutoScrollEvent(this.detallesTable.nativeElement);
      }
    );
  }

  ngOnDestroy(): void {
    this.dataSingleEdiResultSubscription?.unsubscribe();
    this.clearAutoScrollInterval();
  }

  private addAutoScrollEvent(table: HTMLElement): void {
    this.autoScrollInterval = setInterval(() => {
      table.scrollLeft += 5; // Ajusta la velocidad de desplazamiento según tu preferencia
    }, 50); // Ajusta el tiempo de espera según tu preferencia
  }

  private clearAutoScrollInterval(): void {
    clearInterval(this.autoScrollInterval);
  }

  public toggleAutoScroll(table: HTMLElement, isMouseOver: boolean): void {
    if (isMouseOver) {
      this.addAutoScrollEvent(table);
    } else {
      this.clearAutoScrollInterval();
    }
  }
}
