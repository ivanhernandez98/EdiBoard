import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { EdiBoardService } from 'src/app/data/services/access/estatus-shipment.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import * as mapboxgl from 'mapbox-gl'; // Import the 'mapboxgl' library
import { environment } from 'src/app/environments/environment';
import { PosicionesViajes } from 'src/app/data/interfaces/PosicionViaje';

@Component({
  selector: 'app-viajesMapbox',
  templateUrl: './viajesMapbox.component.html',
  styleUrls: ['./viajesMapbox.component.css']
})
export class ViajesMapboxComponent implements OnInit, AfterViewInit {
  public dataSingleEdiResultHeader$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  public dataSingleEdiResult$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  public dataSingleEdiResultPoints$!: Observable<any>;
  private dataSingleEdiResultSubscription: Subscription | undefined;

  private map : any;
  private dataSingleEdiResult: any[] = [];

  public asignadosIcon: string =  'https://cdn-icons-png.flaticon.com/512/8701/8701529.png ' //'https://cdn-icons-png.flaticon.com/512/10740/10740605.png';
  public realizadosIcon: string = 'https://cdn-icons-png.flaticon.com/512/5791/5791244.png' //'https://cdn-icons-png.flaticon.com/512/2821/2821924.png';
  public transitoIcon: string = '	https://cdn-icons-png.flaticon.com/512/1048/1048330.png';


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

  constructor(
    private router: Router,
    private ediAuthService: EdiBoardService,
    private sharedService: SharedService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const duration = environment.duration.viajes;

    // Suscribirse al estado del toggle
    this.sharedService.autoNavigate$.subscribe(autoNavigate => {
      if (autoNavigate && environment.autoNavigate === true) {
        // Realizar acciones después de la duración especificada
        setTimeout(() => {
          console.log('Tiempo de espera para Viajes:', duration);
          // Navegar a la siguiente página (Board) después del tiempo especificado
          this.router.navigate(['/reporte']);
        }, duration);
      }
    });

    this.loadMap();
  }

  private async loadMap() {
    // Código para cargar el mapa
    (mapboxgl as typeof mapboxgl ).accessToken = 'pk.eyJ1IjoiaXZhbmhlcm5hbmRlejEzMTA5OCIsImEiOiJjbHZibG5sNDIwYTNuMnZsZmZrcXNqNDIxIn0.SjKwXv_9xYJDGLvNcykB4A';
    this.map = new mapboxgl.Map({
      container : 'map', // container ID
      style : 'mapbox://styles/mapbox/streets-v12', // style URL
      center : [-100.1399488, 25.7383604], // starting position [lng, lat]
      zoom : 5.75 // starting zoom
    });
    this.map.addControl(new mapboxgl.NavigationControl());
  }

  ngAfterViewInit(): void {
    this.dataSingleEdiResultSubscription = this.sharedService.dataSingleEdiResult$.subscribe(
      (dataSingleEdiResult) => {
        // Actualiza la vista
        this.dataSingleEdiResultHeader$ = of(dataSingleEdiResult?.header);
        this.dataSingleEdiResultPoints$ = of(dataSingleEdiResult?.viajesPosicionesEdi); //Aqui traigo el array de ViajesPosicionesEdi
        this.dataSingleEdiResult$ = of(dataSingleEdiResult);

        // Realiza la detección de cambios manualmente
        this.cdr.detectChanges();
        this.dataSingleEdiResult = dataSingleEdiResult?.viajesPosicionesEdi || [];

        console.log('Viajes:', this.dataSingleEdiResult);
        this.getViajesEdi();
      }
    );
  }

  getSvgContent(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  public async getViajesEdi() {
    // console.log('Obteniendo viajes EDI...', this.dataSingleEdiResult);
    // console.log('Viajes EDI:', this.dataSingleEdiResult);

    if (this.dataSingleEdiResult && this.dataSingleEdiResult.length > 0) {
      for (const viaje of this.dataSingleEdiResult) {
        this.addCustomMarker(viaje);
      }
      //console.log('Viajes:', this.dataSingleEdiResult);
    }
    else {
      console.log('No hay viajes EDI para mostrar.');
    }

  }

  private addCustomMarker(viaje: any) {
    //console.log('Agregando marcador personalizado...', viaje);

    if(viaje.posiciones === null || viaje.posiciones === undefined || viaje.posiciones.length === 0) {
      //console.log('Error: Viaje nulo o indefinido.', viaje);
      return;
    }

    //console.log('Agregando marcador personalizado...', viaje);
    const posiciones = viaje.posiciones;
    const lastPosition = posiciones[posiciones.length - 1];
    const lat = lastPosition.posLat;
    const long = lastPosition.posLon;

    const PViaje = viaje.id_viaje;
    const status = viaje.status_viaje;

    let icon = '';

    switch (status) {
      case 'T':
        icon = this.transitoIcon;
        break;
      case 'R':
        icon = this.realizadosIcon;
        break;
      default:
        icon = this.asignadosIcon;
        break;
    }

    if (viaje.posiciones && viaje.posiciones.length > 0) {
      // Añadir Custom Marker y Popup
      if (!isNaN(lat) && !isNaN(long)) {
        const marker = new mapboxgl.Marker({
          element: this.createMarkerElement(icon),
          anchor: 'bottom'
        })
        .setLngLat({lng: long, lat: lat})
        .setPopup(new mapboxgl.Popup().setHTML(`Estatus del viaje: ${status.toString()} \nÚltima posición del viaje - ${PViaje} `))
        .addTo(this.map);
      } else {
        console.error('Error: Latitud o longitud inválidas:' + lat + ', ' + long + ' para el viaje: ' + PViaje + ' - ' + status + ' - ' + icon  );
      }

    }
  }

  // Función para crear un elemento HTML con la imagen como icono
  private createMarkerElement(iconUrl: string): HTMLElement {
    const element = document.createElement('div');
    element.innerHTML = `<img src="${iconUrl}" style="width: 40px; height: 40px;">`; // Crea una imagen con la URL proporcionada como icono
    return element;
  }

  ngOnDestroy() {
    // Cancelar la suscripción para evitar fugas de memoria
    if (this.dataSingleEdiResultSubscription) {
      this.dataSingleEdiResultSubscription.unsubscribe();
    }
  }

}
