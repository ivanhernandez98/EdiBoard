import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EdiBoardService } from 'src/app/data/services/access/estatus-shipment.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { PosicionViajesModel } from 'src/app/models/PosicionesViajesModelEdi';
import { Observable, Subscription, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Table } from 'primeng/table';48
import { environment } from 'src/app/environments/environment';
import { SortEvent } from 'primeng/api';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';



@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('shipmentsTable', { static: false }) shipmentsTable!: ElementRef;
  @ViewChild('detallesTable', { static: false }) detallesTable!: ElementRef;
  orderKeys: string[] = ["nuevos", "confirmados", "relacionados", "reporeventos", "cancelados", "liberados", "fallidos"];

  estatusSvgMap: { [key: string]: string } = {
    'nuevos': '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-plus" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M12 11l0 6" /><path d="M9 14l6 0" /></svg>',
    'confirmados': '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-check" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M9 15l2 2l4 -4" /></svg>',
    'relacionados': '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-description" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M9 17h6" /><path d="M9 13h6" /></svg>',
    'reporeventos': '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-export" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="green" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3" /></svg>',
    'cancelados': '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-x" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M10 12l4 4m0 -4l-4 4" /></svg>',
    'liberados': '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-certificate" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 8v-3a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5" /><path d="M6 14m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M4.5 17l-1.5 5l3 -1.5l3 1.5l-1.5 -5" /></svg>',
    'fallidos': '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-alert" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="red" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M12 17l.01 0" /><path d="M12 11l0 3" /></svg>'
  };

  public dataSingleEdiResultHeader$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  public dataSingleEdiResult$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  private dataSingleEdiResultSubscription: Subscription | undefined;

/*   private isMouseOverShipmentTable: boolean = false;
  private isMouseOverDetallesTable: boolean = false; */
  private autoScrollInterval: any;

  autoNavigateChecked: boolean = true;
  showModal = false;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ){
  }

  ngOnInit(): void {
    this.showModal = false;

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

  getSvgContent(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }


  customSort(event: SortEvent): void {
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

  public getHorasTranscurridoClass(horasTranscurrido: string): any {
    if (!horasTranscurrido) {
      return "bg-blue-100 text-blue-800 text-2xl font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300";
    }

    const array = horasTranscurrido.split(':');
    const horas = parseInt(array[0], 10);
    const minutos = parseInt(array[1], 10);
    const totalMinutos = horas * 60 + minutos;

    if (totalMinutos < 30) {
      return "bg-blue-100 text-blue-800 text-2xl font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300";
    } else if (totalMinutos >= 30 && totalMinutos < 60) {
      return "bg-green-100 text-green-800 text-2xl font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300";
    } else if (totalMinutos >= 60 && totalMinutos < 90) {
      return "bg-yellow-100 text-yellow-800 text-2xl font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300";
    } else {
      return "bg-red-100 text-red-800 text-2xl font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300";
    }
  }



  private mergeClasses(baseClass: string, additionalClasses: string): string {
    return `${baseClass} ${additionalClasses}`;
  }

  public toggleAutoScroll(table: HTMLElement, isMouseOver: boolean): void {
    if (isMouseOver) {
      this.addAutoScrollEvent(table);
    } else {
      this.clearAutoScrollInterval();
    }
  }

}
