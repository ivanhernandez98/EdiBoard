import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { EdiBoardService } from 'src/app/data/services/access/estatus-shipment.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import * as mapboxgl from 'mapbox-gl'; // Import the 'mapboxgl' library

@Component({
  selector: 'app-viajesMapbox',
  templateUrl: './viajesMapbox.component.html',
  styleUrls: ['./viajesMapbox.component.css']
})
export class ViajesMapboxComponent implements OnInit, AfterViewInit {
  public dataSingleEdiResultHeader$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  public dataSingleEdiResult$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  private dataSingleEdiResultSubscription: Subscription | undefined;


  estatusSvgMap: { [key: string]: string } = {
    nuevos:
      '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-plus" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M12 11l0 6" /><path d="M9 14l6 0" /></svg>',
    confirmados:
      '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-check" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M9 15l2 2l4 -4" /></svg>',
    relacionados:
      '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-description" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M9 17h6" /><path d="M9 13h6" /></svg>',
    reporeventos:
      '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-export" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="green" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3" /></svg>',
    cancelados:
      '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-x" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M10 12l4 4m0 -4l-4 4" /></svg>',
    liberados:
      '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-certificate" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 8v-3a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5" /><path d="M6 14m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M4.5 17l-1.5 5l3 -1.5l3 1.5l-1.5 -5" /></svg>',
    fallidos:
      '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-alert" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="red" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M12 17l.01 0" /><path d="M12 11l0 3" /></svg>',
  };

  orderKeys: string[] = [
    'nuevos',
    'confirmados',
    'relacionados',
    'reporeventos',
    'cancelados',
    'liberados',
    'fallidos',
  ];
  visible: boolean = false;


  public mapboxglToken = 'pk.eyJ1IjoiaXZhbmhlcm5hbmRlejEzMTA5OCIsImEiOiJjbHZibG5sNDIwYTNuMnZsZmZrcXNqNDIxIn0.SjKwXv_9xYJDGLvNcykB4A';
  public map: mapboxgl.Map | undefined;
  public style = 'mapbox://styles/mapbox/streets-v11';
  public lat = 19.432608;
  public lng = -99.133209;
  public message = 'Hello World!';
  public zoom = 9;

  constructor(
    private router: Router,
    private ediAuthService: EdiBoardService,
    private sharedService: SharedService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const map = new mapboxgl.Map({
      accessToken : 'pk.eyJ1IjoiaXZhbmhlcm5hbmRlejEzMTA5OCIsImEiOiJjbHZibG5sNDIwYTNuMnZsZmZrcXNqNDIxIn0.SjKwXv_9xYJDGLvNcykB4A',
      container : 'map', // container ID
      style : 'mapbox://styles/mapbox/streets-v12', // style URL
      center : [-74.5, 40], // starting position [lng, lat]
      zoom : 9 // starting zoom
    });
  }

  ngAfterViewInit(): void {
    this.dataSingleEdiResultSubscription =
      this.sharedService.dataSingleEdiResult$.subscribe(
        (dataSingleEdiResult) => {
          // Actualiza la vista
          this.dataSingleEdiResultHeader$ = of(dataSingleEdiResult?.header);
          this.dataSingleEdiResult$ = of(dataSingleEdiResult);

          // Realiza la detección de cambios manualmente
          this.cdr.detectChanges();
        }
      );
  }

  getSvgContent(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  showDialog() {
    this.visible = true;
  }

  ngOnDestroy() {
    // Cancelar la suscripción para evitar fugas de memoria
    if (this.dataSingleEdiResultSubscription) {
      this.dataSingleEdiResultSubscription.unsubscribe();
    }
  }

}
