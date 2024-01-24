import { Component, AfterViewInit, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { EdiBoardService } from 'src/app/data/services/access/estatus-shipment.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import * as ApexCharts from 'apexcharts';

// Importa tus interfaces
import { EdiMetrico, ListMetricos, EdiEstatus } from '../../models/MetricosModel';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-metricos',
  templateUrl: './metricos.component.html',
  styleUrls: ['./metricos.component.scss']
})
export class MetricosComponent implements AfterViewInit, OnDestroy, OnInit {


  public dataSingleEdiResultHeader$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  public dataSingleEdiResult$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  private dataSingleEdiResultSubscription: Subscription | undefined;

  empresaSeleccionada: string = '';
  clienteSeleccionado: number = 0;
  token: string = '';

  dropdownOptions: string[] = ['Yesterday', 'Today', 'Last 7 days', 'Last 30 days', 'Last 90 days'];
  autoNavigateChecked: boolean = false;

  constructor(
    private router: Router,
    private ediAuthService: EdiBoardService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.dataSingleEdiResultSubscription = this.sharedService.dataSingleEdiResult$.subscribe(
      (dataSingleEdiResult) => {
        // Actualiza la vista
        this.dataSingleEdiResultHeader$ = of(dataSingleEdiResult?.header);
        this.dataSingleEdiResult$ = of(dataSingleEdiResult);

        // Realiza la detección de cambios manualmente
        this.cdr.detectChanges();

        //console.log(dataSingleEdiResult);
      }
    );
    this.getDatosMetrico();
  }

  ngOnDestroy(): void {}

  // metricos.component.ts
  ngOnInit() {
    const duration = environment.duration.metricos;

    // Suscribirse al estado del toggle
    this.sharedService.autoNavigate$.subscribe(autoNavigate => {
      if (autoNavigate && environment.autoNavigate === 1) {
        // Realizar acciones después de la duración especificada
        setTimeout(() => {
          console.log('Tiempo de espera para Metricos:', duration);
          // Navegar a la siguiente página (Viajes) después del tiempo especificado
          this.router.navigate(['/viajes']);
        }, duration);
      }
    });

    // Resto de tu código...
    this.sharedService.empresaSeleccionada$.subscribe(empresa => {
      this.empresaSeleccionada = empresa;
    });

    this.sharedService.clienteSeleccionado$.subscribe(cliente => {
      this.clienteSeleccionado = cliente;
    });

    this.sharedService.Token$.subscribe(token => {
      this.token = token;
    });
  }



  async getDatosMetrico(): Promise<void> {
    if (this.empresaSeleccionada && this.clienteSeleccionado && this.token) {
      this.ediAuthService.getEdiBoardMetricos(this.token, this.empresaSeleccionada, this.clienteSeleccionado).subscribe(
        (data: EdiMetrico) => {
          //console.log(data);
          this.initApexChart(data); // Inicializa el gráfico de área existente
          this.initPieChart(data); // Inicializa el nuevo gráfico de pastel
        }
      );
    }
  }

  initPieChart(data: EdiMetrico) {
    // Filtra los datos de la última semana
    const ultimaSemana = Math.max(...data.semanas || []);
    const datosUltimaSemana = data.list_metricos?.filter(metrico => metrico.semana === ultimaSemana) || [];

    // Agrupa los datos por estatus y suma las cantidades
    const estatusCantidadMap = new Map<string, number>();
    datosUltimaSemana.forEach(metrico => {
      const estatus = metrico.estatus || '';
      const cantidad = metrico.cantidad || 0;
      estatusCantidadMap.set(estatus, (estatusCantidadMap.get(estatus) || 0) + cantidad);
    });

    // Obtiene los datos finales
    const estatus = Array.from(estatusCantidadMap.keys());
    const cantidadXEstatus = Array.from(estatusCantidadMap.values());
    const colores = estatus.map(est => {
      const ediEstatus = data.ediEstatus?.find(estObj => estObj.estatus === est);
      return ediEstatus?.color || '';
    });

    console.log(estatus);
    console.log(cantidadXEstatus);
    console.log(colores);

    const options = {
      series: cantidadXEstatus,
      chart: {
        height: 600,
        width: 900,
        type: 'pie',
      },
      labels: estatus,
      colors: colores,
      legend: {
        position: 'top',
        offsetY: 0,
        fontSize: '20px'
      },
      title: {
        text: 'GRAFICA SEMANAL',
        align: 'center',
        style: {
          fontSize: '20px',
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    if (document.getElementById('pie-chart') && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById('pie-chart'), options);
      chart.render();
    }
  }


  initApexChart(data: EdiMetrico) {
    let options = {
      dataLabels: {
        enabled: true,
        style: {
          cssClass: 'text-xs text-white font-medium'
        },
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 16,
          right: 16,
          top: -26
        },
      },
      series: data.ediEstatus?.map(estatus => {
        return {
          name: estatus.estatus,
          data: data.list_metricos?.filter(metrico => metrico.id_estatus === estatus.id_estatus)?.map(metrico => metrico.cantidad) || []
        };
      }) || [],
      colors: data.ediEstatus?.map(estatus => estatus.color) || [],
      chart: {
        type: 'area',
        fontFamily: 'Inter, sans-serif',
        height: '100%',
        maxWidth: '100%',
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: data.semanas?.map(semana => semana.toString()) || [],
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false
      },
      tooltip: {
        x: {
          show: false,
        },
      },
      legend: {
        show: true
      },
    };

    if (document.getElementById('data-labels-chart') && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById('data-labels-chart'), options);
      chart.render();
    }
  }
}
