import { dataSingle } from './../../models/EmpresaCliente';
/* import { DataList } from './../../data/interfaces/PosicionViaje'; */
import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { Observable, Subscription, of } from 'rxjs';
import { SharedService } from 'src/app/services/shared/shared.service';
import { EdiBoardService } from 'src/app/data/services/access/estatus-shipment.service';
import { Router } from '@angular/router';
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
  zoom: number = 6 || null;

  public dataSingleEdiResultHeader$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  public dataSingleEdiResultPoints$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  public dataSingleEdiResult$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  private dataSingleEdiResultSubscription: Subscription | undefined;

  asignadosIcon: string = 'https://cdn-icons-png.flaticon.com/512/10740/10740605.png';
  realizadosIcon: string = 'https://cdn-icons-png.flaticon.com/512/2821/2821924.png';
  transitoIcon: string = '	https://cdn-icons-png.flaticon.com/512/1048/1048330.png';

  options: google.maps.MapOptions = {
    center: { lat: 23.3449538, lng: -102.2906329 },
    zoom: this.zoom
  };
  mapMarkers: { [key: number]: google.maps.Marker } = {};


  dataSingleEdiResult: any[] = [];


  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router,
    private renderer: Renderer2,
    private ediAuthService: EdiBoardService,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    const duration = environment.duration.board;

    // Realizar acciones después de la duración especificada
    setTimeout(() => {
      console.log('Tiempo de espera para Board:', duration);

      if (environment.autoNavigate === 1) {
        // Navegar a la siguiente página (Metricos) después del tiempo especificado
        this.router.navigate(['/board']);
      }
    }, duration);

    this.loadGoogleMapsScript();
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
          title: `Última posición del viaje - ${PViaje}`,
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
