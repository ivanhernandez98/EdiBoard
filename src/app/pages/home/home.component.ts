import { Component, OnDestroy, OnInit } from '@angular/core';
import { EdiBoardService } from '../../data/services/access/estatus-shipment.service';
import { dataSingle } from 'src/app/models/EmpresaCliente';
import { SharedService } from 'src/app/services/shared/shared.service';
import { PosicionViajesModel } from 'src/app/models/PosicionesViajesModelEdi';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  empresa: string = '';
  cliente: number = 0;
  descripcion: string = '';

  empresaSeleccionada: string = '';
  clientesSeleccionados: {
    descripcion: string;
    clienteEdiConfiguracionId: any;
  } = { descripcion: '', clienteEdiConfiguracionId: 0 };

  empresas: string[] = [];
  clientes: { descripcion: string; clienteEdiConfiguracionId: any }[] = [];
  empresasClientes:
    | {
        empresa: string;
        clientes: { descripcion: string; clienteEdiConfiguracionId: any }[];
      }[]
    | undefined;

  visible: boolean = false;
  loading: boolean = false;
  messages: Message[] = [];
  autoNavigateChecked: boolean = true;

  showDialog() {
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }

  onToggleChange(): void {
    this.sharedService.setAutoNavigate(this.autoNavigateChecked);
  }

  constructor(
    private ediBoardService: EdiBoardService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnDestroy(): void {
    this.empresa = '';
    this.cliente = 0;
    this.descripcion = '';

    this.empresaSeleccionada = '';
    this.clientesSeleccionados = {
      descripcion: '',
      clienteEdiConfiguracionId: 0,
    };

    this.empresas = [];
    this.clientes = [];
    this.empresasClientes = undefined;
  }

  async ngOnInit(): Promise<void> {
    this.sharedService.clearAllData();

    await this.getEmpresasClientes();
  }

  async getEmpresasClientes(): Promise<void> {
    try {
      const response = await this.ediBoardService
        .getEmpresaCliente()
        .toPromise();

      //console.log('response', response);
      if (response && response.dataSingle) {
        const empresasClientesMap: Map<
          string,
          {
            empresa: string;
            clientes: { descripcion: string; clienteEdiConfiguracionId: any }[];
          }
        > = new Map();

        response.dataSingle.forEach((item: dataSingle) => {
          let descripcion: string = '';
          let clienteEdiConfiguracionId = 0;
          let Empresa: string = '';

          if (item.sqL_DB !== undefined) {
            switch (item.sqL_DB) {
              case 'CHDB_LIS':
                Empresa = 'CH';
                break;
              case 'HGDB_LIS':
                Empresa = 'HG';
                break;
              case 'RLDB_LIS':
                Empresa = 'RL';
                break;
              case 'LINDADB':
                Empresa = 'LINDA';
                break;
            }

            descripcion = item.descripcion ?? '';
            clienteEdiConfiguracionId = item.clienteEdiConfiguracionId ?? 0;

            if (!empresasClientesMap.has(Empresa)) {
              empresasClientesMap.set(Empresa, {
                empresa: Empresa,
                clientes: [],
              });
            }

            empresasClientesMap.get(Empresa)?.clientes.push({
              descripcion: descripcion,
              clienteEdiConfiguracionId: clienteEdiConfiguracionId,
            });
          }
        });

        this.empresasClientes = Array.from(empresasClientesMap.values());
        this.empresas = Array.from(empresasClientesMap.keys());
        this.clientes = Array.from(empresasClientesMap.values()).flatMap(
          (item) => item.clientes
        );
      }
    } catch (error) {
      console.error('Error obteniendo la lista de empresas y clientes:', error);
    }
  }

  actualizarCLiente(): void {
    // Verifica si se ha seleccionado un cliente
    if (this.clientesSeleccionados.clienteEdiConfiguracionId) {
      // Encuentra el cliente según el clienteEdiConfiguracionId seleccionado
      const clienteEncontrado = this.clientes?.find(
        (item) =>
          item.clienteEdiConfiguracionId ===
          Number(this.clientesSeleccionados.clienteEdiConfiguracionId)
      );

      // Asigna el cliente encontrado o un objeto por defecto si no se encuentra
      this.clientesSeleccionados = clienteEncontrado || {
        descripcion: '',
        clienteEdiConfiguracionId: 0,
      };
    } else {
      // Si no se ha seleccionado un cliente, asigna el primer cliente de la lista
      this.clientesSeleccionados = this.clientes?.[0] || {
        descripcion: '',
        clienteEdiConfiguracionId: 0,
      };
    }
    console.log(this.clientesSeleccionados);
  }

  actualizarClientesSegunEmpresa() {
    if (this.empresasClientes) {
      // Loguea el valor seleccionado para verificar
      console.log('Empresa seleccionada:', this.empresaSeleccionada);

      // Encuentra la lista de clientes según la empresa seleccionada
      const clientesPorEmpresa = this.empresasClientes.find(
        (item) => item.empresa === this.empresaSeleccionada
      );

      // Si encuentra la lista de clientes, asigna al array de clientes; de lo contrario, vacía el array de clientes
      this.clientes = clientesPorEmpresa ? clientesPorEmpresa.clientes : [];

      this.sharedService.setEmpresaSeleccionada(this.empresaSeleccionada);
    } else {
      console.error('Error obteniendo la lista de empresas y clientes');
      // Lanza un error o maneja el error de acuerdo a tus necesidades
    }
  }

  btnAuth(): void {
    // Verifica si se ha seleccionado un cliente
    if (!this.clientesSeleccionados.clienteEdiConfiguracionId) {
      // Si no se ha seleccionado un cliente, asigna el primer cliente de la lista
      this.clientesSeleccionados = this.clientes?.[0] || {
        descripcion: '',
        clienteEdiConfiguracionId: 0,
      };
      console.log(
        'No se ha seleccionado un cliente, se asigna el primer cliente de la lista'
      );
    }

    // Muestra el modal antes de la operación asincrónica
    this.visible = true;

    // Deshabilita el botón de "Ingresar" mientras se ejecuta la operación asincrónica
    this.loading = true;

    // Ejecuta la operación asincrónica
    this.RegistroFiltro(this.empresaSeleccionada, this.clientesSeleccionados)
      .then(() => {
        // Operación asincrónica completada con éxito

        // Oculta el modal después de la lógica de espera
        this.visible = false;

        // Habilita el botón de "Ingresar"
        this.loading = false;
      })
      .catch((error) => {
        // Handle errors if needed
        console.error('Error en RegistroFiltro:', error);

        // Asegúrate de habilitar el botón incluso si hay un error
        this.loading = false;

        // Oculta el modal después de la lógica de espera
        this.visible = false;
      });
  }

  async RegistroFiltro(
    empresa: string,
    clienteDescripcion: {
      descripcion: string;
      clienteEdiConfiguracionId: number;
    }
  ): Promise<void> {
    this.sharedService.setClienteSeleccionado(
      clienteDescripcion.clienteEdiConfiguracionId
    );
    try {
      // Obtener el token de autenticación
      const response = await this.ediBoardService
        .postAuthEdiBoard(empresa)
        .toPromise();
      const token = response?.token;

      this.sharedService.setToken(token);

      if (!token) {
        console.error('Error al obtener el token de autenticación.');
        return;
      }

      // Obtener los datos del EdiBoard usando el token
      const EdiBoard = await this.ediBoardService
        .getEdiBoardInfo(
          token,
          this.empresaSeleccionada,
          clienteDescripcion.clienteEdiConfiguracionId
        )
        .toPromise();

      // Verificar si la respuesta de la API es válida
      if (EdiBoard) {
        // Llenar el modelo con los datos obtenidos
        const dataSingleEdiResult = new PosicionViajesModel.DataSingleEdiResult(
          EdiBoard.dataSingle.header,
          EdiBoard.dataSingle.infoTimeShipments,
          EdiBoard.dataSingle.infoErrorShipments,
          EdiBoard.dataSingle.detailsShipments,
          EdiBoard.dataSingle.viajesPosicionesEdi
        );

        console.log('dataSingleEdiResult', dataSingleEdiResult);

        // Guardar el modelo en el servicio compartido
        this.sharedService.setDataSingleEdiResult(EdiBoard.dataSingle);

        // Guardar la descripción en el servicio compartido
        this.sharedService.setDescripcion(clienteDescripcion.descripcion);

/*         const duration = environment.duration.board;

        this.sharedService.autoNavigate$.subscribe(autoNavigate => {
          if (autoNavigate && environment.autoNavigate === 1) {
            setTimeout(() => {
              console.log('Tiempo de espera para Board:', duration);
              this.router.navigate(['/board']);
            }, duration);
          }
        }); */

        // Navegar a la página de board
        this.router.navigate(['/board']);
      } else {
        console.error('La respuesta de la API es inválida.');
      }
    } catch (error) {
      this.sharedService.clearAllData();
      console.error('Error obteniendo datos del EdiBoard:', error);
    }
  }
}
