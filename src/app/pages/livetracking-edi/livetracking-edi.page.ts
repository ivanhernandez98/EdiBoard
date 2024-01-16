import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, catchError, map, of } from 'rxjs';
import { Clientes } from 'src/app/data/interfaces/Cliente';
import { Empresa } from 'src/app/data/interfaces/Empresa';
import { DataList, DataSingle, PosicionesViajes } from 'src/app/data/interfaces/PosicionViaje';
import { ApiPosicionViajesServicesService } from 'src/app/data/services/api/api-posicion-viajes.service';
import { environment } from '../../../../src/app/environments/environment.prod';

interface WayPoint {
  location: {
    lat: number,
    lng: number,
  };
  stopover: boolean;
}


@Component({
  selector: 'app-livetracking-edi',
  templateUrl: './livetracking-edi.page.html',
  styleUrls: ['./livetracking-edi.page.scss'],
})
export class LivetrackingEdiPage implements OnInit {

  apiLoaded: Observable<boolean>;
  map: any;
  apiKey: string = environment.googleMapApiKey;
  zoom: number = 6 || null;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  directionsService = new google.maps.DirectionsService();
  directionsDisplay: { [key: number]: google.maps.DirectionsRenderer } = {};
  directionsRenderers: { [key: number]: google.maps.DirectionsRenderer } = {};
  mapMarkers: { [key: number]: google.maps.Marker } = {};

  empresas: Empresa[] | undefined;
  selectedEmpresa: Empresa | undefined;

  clientes: Clientes[] | undefined;
  totalClientes: Clientes[] | undefined;
  selectedCliente: Clientes | undefined;

  origin: {} | undefined;
  destination: {} | undefined;

  viajesPos: PosicionesViajes[]=[];
  viajesDetalles: DataSingle[] = [];

  options: google.maps.MapOptions = {
    center: { lat: 23.3449538, lng: -102.2906329 },
    zoom: this.zoom
  };

  asignadosIcon: string = '../../../assets/icon/truck_standBy.png';
  realizadosIcon: string = '../../../assets/icon/truck_finish.png';
  transitoIcon: string = '../../../assets/icon/truck.png';

  asignadosCount: number = 0;
  realizadosCount: number = 0;
  transitoCount: number = 0;

  constructor(
    private httpClient: HttpClient,
    private apiService: ApiPosicionViajesServicesService,
    private messageService: MessageService,
  ) {
    this.apiLoaded = httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${this.apiKey}`, 'callback')
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );

    this.empresas = [
      { name: 'HG', code: 'hgdb_lis' },
      { name: 'CH', code: 'chdb_lis' },
      { name: 'LINDA', code: 'lindadb' },
      { name: 'RL', code: 'rldb_lis' }
    ];
  }


  ngOnInit() {
    this.loadClientes(); // Llamada a la función para cargar clientes
    this.loadMap();
  }

  private loadClientes() {
    this.apiService.getEmpresasCliente().subscribe(
      (response: any) => {
        if (response && response.dataSingle) {
          this.clientes = response.dataSingle;
          this.totalClientes = response.dataSingle;
          console.log('Clientes cargados:', this.clientes);
        } else {
          console.error('Respuesta de la API sin datos esperados.');
        }
      },
      (error) => {
        console.error('Error al obtener los clientes desde la API:', error);
      }
    );
  }


  private loadMap() {
    const mapEle: HTMLElement | null = document.getElementById('map');
    if (mapEle) {
      //console.log('Se obtuvo mapa');
      this.map = new google.maps.Map(mapEle, {
        center: this.options.center,
        zoom: this.zoom
      });

      // Añade un DirectionsRenderer para mostrar las direcciones en el mapa
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(this.map);

      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        mapEle.classList.add('show-map');
      });
    } else {
      console.error('No se encontró el elemento con ID "map".');
    }
  }

  public seleccionarEmpCliente() {
    if (this.selectedEmpresa) {
      const codigoEmpresaSeleccionada = this.selectedEmpresa.code;
      if (Array.isArray(this.totalClientes)) {
        // Verifica si ya se ha aplicado un filtro anteriormente
        if (this.clientes && this.clientes.length < this.totalClientes.length) {
          // Restaurar la lista completa
          this.clientes = [...this.totalClientes];
        }

        // Aplicar el filtro
        this.clientes = this.clientes?.filter(
          (cliente) =>
            cliente.sqL_DB?.toLocaleLowerCase() ===
            codigoEmpresaSeleccionada?.toLocaleLowerCase()
        );

        console.log('Clientes filtrados:', this.clientes);

        if (this.clientes && this.clientes.length > 0) {
          // Puedes hacer más cosas con los clientes filtrados aquí

        } else {
          console.log('No hay clientes para la empresa seleccionada.');
        }
      } else {
        console.error('this.totalClientes no es un array.');
      }
    } else {
      console.error('No se ha seleccionado una empresa.');
    }
  }

  public viajesEdi() {
    console.log(this.selectedEmpresa, this.selectedCliente);

    const empresa: string | undefined = this.selectedEmpresa?.code;
    const clienteId = this.selectedCliente?.ClienteEdiConfiguracionId ?? 2;
    console.log(empresa, clienteId);

    if (!empresa) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Empresa no seleccionada.' });
      return;
    }

    if (!clienteId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cliente no seleccionado.' });
      return;
    }

    this.apiService.getPosicionesEdi(empresa, clienteId).subscribe(
      (response: any) => {
        console.log(response);
        if (response) {
          // Asegúrate de que response sea un array
          this.viajesDetalles = response;
          console.log('Clientes cargados:', this.viajesDetalles);

          this.viajesDetalles.forEach((posicion: DataSingle) => {
            this.calculateRouteForTrip(posicion);
          });

          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Posiciones cargados correctamente.' });
        } else {
          console.error('Respuesta de la API sin datos esperados o no es un array.');
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Respuesta de la API sin datos esperados o no es un array.' });
        }
      },
      (error) => {
        console.error('Error al obtener los clientes desde la API:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los clientes desde la API.' });
      }
    );
  }


  private calculateRouteForTrip(viaje: DataSingle): void {
    const noViaje = parseInt(viaje.no_viaje.toLocaleString(),10);
    const posiciones = viaje.posiciones;
    console.log(noViaje, posiciones);

    if (posiciones.length < 2) {
      alert(`No hay suficientes posiciones para trazar la ruta para el viaje ${noViaje}.`);
      return;
    }

    const origin = { lat: posiciones[0].posLat, lng: posiciones[0].posLon };
    const destination = {
      lat: posiciones[posiciones.length - 1].posLat,
      lng: posiciones[posiciones.length - 1].posLon,
    };

    // Agregar marcador en la primera posición del viaje con etiqueta "A Origen"
    this.addMarker(
      { lat: origin.lat, lng: origin.lng },
      //`A Origen - Viaje ${noViaje}`,
      `Origen A\nUnidad: ${posiciones[0].id_unidad}\nViaje: ${noViaje}\nGPS: ${posiciones[0].sistema_origen}`,
      true, // Marcar como punto A
      '/src/assets/icon/truck_standBy.png'
    );

    const waypoints: WayPoint[] = posiciones.slice(1, -1).map(posicion => ({
      location: { lat: posicion.posLat, lng: posicion.posLon },
      stopover: false,
    }));

    this.directionsService.route({
      origin: origin,
      destination: destination,
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        // Si ya hay un DirectionsRenderer para este viaje, quítalo antes de crear uno nuevo
        if (this.directionsRenderers[noViaje]) {
          this.directionsRenderers[noViaje].setMap(null);
        }

        if (this.directionsRenderers[noViaje] && this.directionsRenderers[noViaje].getMap()) {
          console.log('Maker press button');
          // Si la ruta ya está visible, quitarla
          this.directionsRenderers[noViaje].setMap(null);
        } else {
          console.log('Maker press cancel button');
          // Si la ruta no está visible, mostrarla
          if (this.directionsRenderers[noViaje]) {
            this.directionsRenderers[noViaje].setMap(this.map);
          } else {
            console.error(`DirectionsRenderer for viaje ${noViaje} is not defined.`);
          }
        }

        // Guardar el objeto DirectionsRenderer específico del viaje
        this.directionsRenderers[noViaje] = new google.maps.DirectionsRenderer({
          suppressMarkers: true, // Suprimir los marcadores predeterminados del servicio de direcciones
          preserveViewport: true, // Preservar la vista del mapa al mostrar la ruta
        });

        // Mostrar la ruta en el mapa utilizando el DirectionsRenderer específico del viaje
        this.directionsRenderers[noViaje].setMap(this.map);
        this.directionsRenderers[noViaje].setDirections(response);

        // Agregar el evento click al marcador de destino para alternar la visibilidad de la ruta
        const finPosicion = posiciones[posiciones.length - 1];
        const destinationMarker = new google.maps.Marker({
          position: { lat: finPosicion.posLat, lng: finPosicion.posLon },
          map: this.map,
          title: `B Destino - Viaje ${noViaje}`,
          icon: {
            url: 'assets/icon/truck.png',
            scaledSize: new google.maps.Size(42, 42),
          },
        });
      } else {
        console.log(`No se pudieron encontrar las direcciones para el viaje ${noViaje}: ${status}`);
      }
    });
  }


  // Método para agregar un marcador a un viaje específico
  private addMarker(position: google.maps.LatLngLiteral, label: string, isOrigin: boolean = false,iconURL: string): void {

    // Utiliza expresiones regulares para extraer el número después de "Viaje:"
    const viajeMatch = label.match(/Viaje: (\d+)/);

    if (viajeMatch && viajeMatch[1]) {
      const numeroViaje = parseInt(viajeMatch[1]);

      // Elimina el marcador asociado al viaje si ya existe
      const existingMarker = this.mapMarkers[numeroViaje];
      if (existingMarker) {
        existingMarker.setMap(null);
        // Elimina el marcador del diccionario
        delete this.mapMarkers[numeroViaje];
      }

      // Agrega un nuevo marcador
      const marker = new google.maps.Marker({
        position: position,
        map: this.map,
        title: label,
        icon: {
          url: iconURL,
          scaledSize: new google.maps.Size(42, 42),
        },
      });

      // Añade el marcador al diccionario de marcadores
      this.mapMarkers[numeroViaje] = marker;

      // Agrega un manejador de eventos al marcador para trazar/ocultar la ruta al dar clic
      marker.addListener('click', () => {
        this.apiService.obtenerPosicionViaje(numeroViaje, 'hgdb_lis', 0)
          .subscribe(response => {
            const posicionesViajeMaker = response.dataList;
            if (response) {
              console.log(response);
              //this.calculateRouteForTrip(numeroViaje, posicionesViajeMaker);
            } else {
              console.log('No se encontro información del viaje');
            }
          });
      });
    } else {
      console.log('No se encontró un número de viaje en la etiqueta.');
    }
  }
}
