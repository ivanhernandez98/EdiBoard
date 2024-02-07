import { dataSingle } from './../../models/EmpresaCliente';
/* import { DataList } from './../../data/interfaces/PosicionViaje'; */
import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { Observable, Subscription, of } from 'rxjs';
import { SharedService } from 'src/app/services/shared/shared.service';
import { EdiBoardService } from 'src/app/data/services/access/estatus-shipment.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
//import { DataSingle,DataList, PosicionesViajes } from 'src/app/data/interfaces/PosicionViaje';


export interface PosicionesViajes {
  dataSingle: DataSingle[];
}
export interface DataSingle {
  id_viaje: number;
  remitente: string;
  destinatario: string;
  shipment: string;
  fecha_real_viaje: Date;
  fecha_real_fin_viaje: Date;
  status_viaje:string;
  status_pedido:string;
  posiciones: DataList[];
}
export interface DataList {
  id_unidad: string;
  id_viaje: number;
  posdate: Date;
  posLat: number;
  posLon: number;
  sistema_origen?: string | null;
  ubicacion?: string | null;
}

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.scss']
})
export class ViajesComponent implements OnInit {

  map: google.maps.Map | undefined;
  apiKey: string = environment.googleMapApiKey;
  zoom: number = 7 || null;

  public dataSingleEdiResultHeader$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  public dataSingleEdiResultPoints$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  public dataSingleEdiResult$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  private dataSingleEdiResultSubscription: Subscription | undefined;

  asignadosIcon: string = 'https://cdn-icons-png.flaticon.com/512/10740/10740605.png';
  realizadosIcon: string = 'https://cdn-icons-png.flaticon.com/512/2821/2821924.png';
  transitoIcon: string = '	https://cdn-icons-png.flaticon.com/512/1048/1048330.png';

  options: google.maps.MapOptions = {
    center: { lat: 25.5871182, lng: -100.0782092 },
    zoom: this.zoom
  };
  mapMarkers: { [key: number]: google.maps.Marker } = {};


  dataSingleEdiResult: any[] = [];
  autoNavigateChecked: boolean = false;

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

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private ediAuthService: EdiBoardService,
    private sharedService: SharedService,
  ) { }

  // viajes.component.ts
  ngOnInit() {
    const duration = environment.duration.viajes;

    // Suscribirse al estado del toggle
    this.sharedService.autoNavigate$.subscribe(autoNavigate => {
      if (autoNavigate && environment.autoNavigate === 1) {
        // Realizar acciones después de la duración especificada
        setTimeout(() => {
          console.log('Tiempo de espera para Viajes:', duration);
          // Navegar a la siguiente página (Board) después del tiempo especificado
          this.router.navigate(['/reporte']);
        }, duration);
      }
    });

    this.loadGoogleMapsScript();
  }

  ngOnDestroy() {
    // Cancelar la suscripción para evitar fugas de memoria
    if (this.dataSingleEdiResultSubscription) {
      this.dataSingleEdiResultSubscription.unsubscribe();
    }
  }

  getSvgContent(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
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

        //console.log(dataSingleEdiResult?.viajesPosicionesEdi);
        this.dataSingleEdiResult = dataSingleEdiResult?.viajesPosicionesEdi || [];
      }
    );
  }

  private async loadGoogleMapsScript() {
    try {
      await google.maps.importLibrary('maps');
      this.initMap();
      //this.addCustomMarker();
    } catch (error) {
      console.error('Error cargando Google Maps:', error);
    }
  }


  private initMap() {
    if (!google.maps) {
      console.error('Google Maps no está definido.');
      return;
    }

    const mapEle: HTMLElement = document.getElementById('map') as HTMLElement;
    this.map = new google.maps.Map(mapEle, this.options);

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      // Resto del código, si es necesario
      this.getViajesEdi();
    });
  }

  private addCustomMarkers(viajes: PosicionesViajes[]) {
    viajes.forEach(viaje => {
      this.addCustomMarker(viaje);
    });
  }

  public async getViajesEdi() {
    if (this.dataSingleEdiResult && this.dataSingleEdiResult.length > 0) {
      this.addCustomMarkers(this.dataSingleEdiResult);
    }
  }

  private addCustomMarker(viaje: any) {
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
      const ultimaPosicion = viaje.posiciones[viaje.posiciones.length - 1];
      const lat = ultimaPosicion.posLat;
      const long = ultimaPosicion.posLon;

      if (this.map) {
        const marker = new google.maps.Marker({
          position: { lat: lat, lng: long },
          map: this.map,
          title: `Estatus del viaje: ${status.toString()} \nÚltima posición del viaje - ${PViaje} `,
          icon: {
            url: icon,
            scaledSize: new google.maps.Size(42, 42),
          },
        });
        this.mapMarkers[PViaje] = marker;
      }
    }
  }

}
