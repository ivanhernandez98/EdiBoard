import { dataSingle } from './../../models/EmpresaCliente';
import { PosicionViajesModel } from './../../models/PosicionesViajesModelEdi';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { EdiBoardService } from 'src/app/data/services/access/estatus-shipment.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { format } from 'date-fns';

interface Pedido {
  id_pedido: number;
  id_viaje: number;
  shipment: string;
  ubicacion: string;
  equipo: string;
  fechaRelacionPedido: string;
  eta: string;
  status_pedido: string;
  detalle?: string; // Bandera para mostrar la descripción del detalle si hay espacio en la tabla
}

@Component({
  selector: 'app-Reportes',
  templateUrl: './Reportes.component.html',
  styleUrls: ['./Reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  public dataSingleEdiResult$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  public dataSingleEdiResultDetails$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo

  private dataSingleEdiResultSubscription: Subscription | undefined;
  private EstatusShipmentsEdi?: PosicionViajesModel.DataSingleEdi[] = [];
  public tablaEdi?: Pedido[] = [];
  public term: string = '';

  constructor(
    private router: Router,
    private ediAuthService: EdiBoardService,
    private sharedService: SharedService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  DurationPage(){
    const duration = environment.duration.reporte;

    // Suscribirse al estado del toggle
    this.sharedService.autoNavigate$.subscribe((autoNavigate) => {
      if (autoNavigate && environment.autoNavigate === 1) {
        // Realizar acciones después de la duración especificada
        setTimeout(() => {
          console.log('Tiempo de espera para Metricos:', duration);
          // Navegar a la siguiente página (Viajes) después del tiempo especificado
          this.router.navigate(['/board']);
        }, duration);
      }
    });
  }

  ngOnInit() {
    this.DurationPage();
  }

  ngOnDestroy() {
    // Cancelar la suscripción para evitar fugas de memoria
    if (this.dataSingleEdiResultSubscription) {
      this.dataSingleEdiResultSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.dataSingleEdiResultSubscription = this.sharedService.dataSingleEdiResult$.subscribe(
      (dataSingleEdiResult) => {
        this.dataSingleEdiResultDetails$ = of(dataSingleEdiResult?.detailsShipments);
        this.dataSingleEdiResult$ = of(dataSingleEdiResult);
        this.EstatusShipmentsEdi = dataSingleEdiResult?.viajesPosicionesEdi;
        this.cdr.detectChanges();
        this.GetDatosTabla();
        this.search(); // Llama a la función de búsqueda después de obtener los datos
      }
    );
  }

  GetDatosTabla() {
    this.tablaEdi = this.EstatusShipmentsEdi?.map((item) => {
      // Asegúrate de que posiciones esté definido antes de acceder a sus propiedades
      const sortedPosiciones = item.posiciones ? item.posiciones.sort((a, b) => {
        // Asegúrate de que posdate sea una instancia de Date antes de intentar ordenar
        const dateA = a.posdate instanceof Date ? a.posdate : new Date(0);
        const dateB = b.posdate instanceof Date ? b.posdate : new Date(0);
        return dateB.getTime() - dateA.getTime();
      }) : [];

      return {
        id_pedido: item.id_pedido,
        id_viaje: item.id_viaje,
        shipment: item.shipment,
        ubicacion: sortedPosiciones.length > 0 ? sortedPosiciones[0].ubicacion || '' : '',
        equipo: sortedPosiciones.length > 0 ? sortedPosiciones[0].id_unidad || '' : '',
        // Formatear las fechas y ETAs solo si están definidas
        fechaRelacionPedido: item.fecha_despacho.toString() || '',
        eta: item.eta.toString() || '',
        status_pedido: item.status_pedido,
        detalle: item.status_viaje,
      };
    }, []);

    console.log(this.tablaEdi);
  }

  search() {
    // Filtra los datos de la tabla según el término de búsqueda
    if (this.EstatusShipmentsEdi) {
      this.tablaEdi = this.EstatusShipmentsEdi.map((item) => {
        const sortedPosiciones = item.posiciones ? item.posiciones.sort((a, b) => {
          const dateA = a.posdate instanceof Date ? a.posdate : new Date(0);
          const dateB = b.posdate instanceof Date ? b.posdate : new Date(0);
          return dateB.getTime() - dateA.getTime();
        }) : [];

        return {
          id_pedido: item.id_pedido,
          id_viaje: item.id_viaje,
          shipment: item.shipment,
          ubicacion: sortedPosiciones.length > 0 ? sortedPosiciones[0].ubicacion || '' : '',
          equipo: sortedPosiciones.length > 0 ? sortedPosiciones[0].id_unidad || '' : '',
          fechaRelacionPedido: item.fecha_despacho.toString() || '',
          eta: item.eta.toString() || '',
          status_pedido: item.status_pedido,
          detalle: item.status_viaje,
        };
      }).filter((pedido) => {
        // Filtra los elementos que coincidan con el término de búsqueda
        return (
          pedido.id_pedido.toString().includes(this.term) ||
          pedido.id_viaje.toString().includes(this.term) ||
          pedido.equipo.toUpperCase().includes(this.term) ||
          pedido.shipment.includes(this.term)
        );
      });

      console.log(this.tablaEdi);
    }
  }

}
