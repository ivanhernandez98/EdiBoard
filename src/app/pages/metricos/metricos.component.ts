import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { EdiBoardService } from 'src/app/data/services/access/estatus-shipment.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import * as ApexCharts from 'apexcharts';

// Importa tus interfaces
import {
  EdiMetrico,
  ListMetricos,
  EdiEstatus,
} from '../../models/MetricosModel';
import { environment } from 'src/app/environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-metricos',
  templateUrl: './metricos.component.html',
  styleUrls: ['./metricos.component.scss'],
})
export class MetricosComponent implements AfterViewInit, OnDestroy, OnInit {
  public dataSingleEdiResultHeader$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  public dataSingleEdiResult$!: Observable<any>; // Puedes cambiar el tipo de datos según tu modelo
  private dataSingleEdiResultSubscription: Subscription | undefined;

  empresaSeleccionada: string = '';
  clienteSeleccionado: number = 0;
  token: string = '';
  chartOptions: any;
  autoNavigateChecked: boolean = this.sharedService.getAutoNavigate();

  orderKeys: string[] = [
    'nuevos',
    'confirmados',
    'relacionados',
    'reporeventos',
    'cancelados',
    'liberados',
    'fallidos',
  ];

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

  constructor(
    private router: Router,
    private ediAuthService: EdiBoardService,
    private sharedService: SharedService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) { }

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
    this.getDatosMetrico();
  }

  getSvgContent(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  ngOnDestroy() {
    // Cancelar la suscripción para evitar fugas de memoria
    if (this.dataSingleEdiResultSubscription) {
      this.dataSingleEdiResultSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    const duration = environment.duration.metricos;

    // Suscribirse al estado del toggle
    this.sharedService.autoNavigate$.subscribe((autoNavigate) => {
      if (autoNavigate && environment.autoNavigate === true) {
        // Realizar acciones después de la duración especificada
        setTimeout(() => {
          console.log('Tiempo de espera para Metricos:', duration);
          // Navegar a la siguiente página (Viajes) después del tiempo especificado
          this.router.navigate(['/viajes']);
        }, duration);
      }
    });

    // Resto de tu código...
    this.sharedService.empresaSeleccionada$.subscribe((empresa) => {
      this.empresaSeleccionada = empresa;
    });

    this.sharedService.clienteSeleccionado$.subscribe((cliente) => {
      this.clienteSeleccionado = cliente;
    });

    this.sharedService.Token$.subscribe((token) => {
      this.token = token;
    });
  }

  async getDatosMetrico(): Promise<void> {
    if (this.empresaSeleccionada && this.clienteSeleccionado && this.token) {
      this.ediAuthService
        .getEdiBoardMetricos(
          this.token,
          this.empresaSeleccionada,
          this.clienteSeleccionado
        )
        .subscribe((data: EdiMetrico) => {
          //console.log(data);
          this.initApexChart(data); // Inicializa el gráfico de área existente
          this.initPieChart(data); // Inicializa el nuevo gráfico de pastel
        });
    }
  }

  /* initPieChart(data: EdiMetrico) {
    // Filtra los datos de la última semana
    const ultimaSemana = Math.max(...(data.semanas || []));
    const datosUltimaSemana =
      data.list_metricos?.filter(
        (metrico) => metrico.semana === ultimaSemana
      ) || [];

    // Agrupa los datos por estatus y suma las cantidades
    const estatusCantidadMap = new Map<string, number>();
    datosUltimaSemana.forEach((metrico) => {
      const estatus = metrico.estatus || '';
      const cantidad = metrico.cantidad || 0;
      estatusCantidadMap.set(
        estatus,
        (estatusCantidadMap.get(estatus) || 0) + cantidad
      );
    });

    // Obtiene los datos finales
    const estatus = Array.from(estatusCantidadMap.keys());
    const cantidadXEstatus = Array.from(estatusCantidadMap.values());
    const colores = estatus.map((est) => {
      const ediEstatus = data.ediEstatus?.find(
        (estObj) => estObj.estatus === est
      );
      return ediEstatus?.color || '';
    });

    const options = {
      xaxis: {
        show: true,
        labels: {
          show: true,
          style: {
            fontFamily: 'Inter, sans-serif',
            cssClass: 'text-2xl font-normal fill-gray-500 dark:fill-gray-400'
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      series: [
        {
          name: 'Estatus',
          data: cantidadXEstatus,
        },
      ],
      chart: {
        height: 600,
        width: 900,
        type: 'pie',
      },
      labels: estatus,
      colors: colores,
      legend: {
        position: 'bottom',
        offsetY: 0,
        fontSize: '1.5rem',
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    if (
      document.getElementById('pie-chart') &&
      typeof ApexCharts !== 'undefined'
    ) {
      const chart = new ApexCharts(
        document.getElementById('pie-chart'),
        options
      );
      chart.render();
    }

    if (document.getElementById('pie-chart') && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById('pie-chart'), options);
      chart.render();
    }
  } */

  initPieChart(data: EdiMetrico): void {
    const estatusData = data.ediEstatus || [];

    this.chartOptions = {
      series: estatusData.map(estatus => estatus.orden),
      colors: estatusData.map(estatus => estatus.color),
      chart: {
        height: 500,
        width: 900,
        type: 'pie',
      },
      stroke: {
        colors: ["white"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          labels: {
            show: true,
          },
          size: "100%",
          dataLabels: {
            offset: -25
          }
        },
      },
      labels: estatusData.map(estatus => estatus.estatus),
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: 'text-2xl text-white font-medium',
          fontSize: '1.5rem'
        },
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: 'text-2xl text-white font-medium',
          fontSize: '1.5rem'
        },
      },
      yaxis: {
        labels: {
          formatter: function (value: number) {
            return value + "%";
          },
        },
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: 'text-2xl text-white font-medium',
          fontSize: '1.5rem'
        },
      },
      xaxis: {
        labels: {
          formatter: function (value: number) {
            return value  + "%"
          },
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: 'text-2xl text-white font-medium',
            fontSize: '1.5rem'
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      responsive: [
        {
          breakpoint: 768, // Cambia estos valores según tus necesidades
          options: {
            chart: {
              height: 300, // Nuevo tamaño para la pantalla pequeña
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };

    // Renderiza el gráfico
    this.renderChart();
  }

  renderChart(): void {
    if (document.getElementById("pie-chart") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("pie-chart"), this.chartOptions);
      chart.render();
    }
  }


  initApexChart(data: EdiMetrico) {
    let options = {
      dataLabels: {
        enabled: true,
        style: {
          cssClass: 'text-2xl text-white font-medium',
          fontSize: '1.5rem'
        },
      }, // Tamaño del texto de las etiquetas
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 16,
          right: 16,
          top: -26,
        },
      },
      series:
        data.ediEstatus?.map((estatus) => {
          return {
            name: estatus.estatus,
            data:
              data.list_metricos
                ?.filter((metrico) => metrico.id_estatus === estatus.id_estatus)
                ?.map((metrico) => metrico.cantidad) || [],
          };
        }) || [],
      colors: data.ediEstatus?.map((estatus) => estatus.color) || [],
      chart: {
        type: 'area',
        fontFamily: 'Inter, sans-serif',
        fontSize: '1.5rem',
        maxHeight: '90%',
        maxWidth: '100%',
        height: 500,
        width: 700,
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: data.semanas?.map((semana) => semana.toString()) || [],
        labels: {
          show: true,
          cssClass: 'text-3xl font-normal fill-gray-500 dark:fill-gray-400',
          style: {
            fontSize: '1.5rem', // Ajusta el tamaño del texto de semanas
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
      tooltip: {
        x: {
          show: false,
        },
      },
      legend: {
        show: true,
      },
    };

    if (
      document.getElementById('data-labels-chart') &&
      typeof ApexCharts !== 'undefined'
    ) {
      const chart = new ApexCharts(
        document.getElementById('data-labels-chart'),
        options
      );
      chart.render();
    }
  }
}
