import { dataSingle } from './../../models/EmpresaCliente';
/* import { DataList } from './../../data/interfaces/PosicionViaje'; */
import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { Observable, Subscription, of } from 'rxjs';
import { SharedService } from 'src/app/services/shared/shared.service';
import { EdiBoardService } from 'src/app/data/services/access/estatus-shipment.service';
import { Router } from '@angular/router';
import { DataSingle,DataList, PosicionesViajes } from 'src/app/data/interfaces/PosicionViaje';

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

/*   asignadosIcon: string = '/assets/icon/truck_standBy.png';
  realizadosIcon: string = '/assets/icon/truck_finish.png';
  transitoIcon: string = '/assets/icon/truck.png'; */

  asignadosIcon: string = '../../assets/icon/trucks_standbyy.png';
  realizadosIcon: string = '../../assets/icon/truck_finish.png';
  transitoIcon: string = '../../assets/icon/truck.png';

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
      this.addCustomMarker();
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
    });
  }

  private addCustomMarker() {
    if (this.map) {
      // Añade un marcador en las coordenadas proporcionadas
      const marker = new google.maps.Marker({
        position: { lat: 25.7470044, lng: -100.1837781 },
        map: this.map,
        title: 'Ubicación del marcador',
        icon: {
          url: this.asignadosIcon,
          scaledSize: new google.maps.Size(42, 42),
        },
      });

      // Añade el marcador al objeto de marcadores
      this.mapMarkers[2556542] = marker;
    }
  }

}
