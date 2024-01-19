import { Component, OnInit } from '@angular/core';
import { EdiBoardService } from '../../data/services/access/estatus-shipment.service';
import { dataSingle } from 'src/app/models/EmpresaCliente';
import { SharedService } from 'src/app/services/shared/shared.service';
import { PosicionViajesModel } from 'src/app/models/PosicionesViajesModelEdi';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  empresa: string = '';
  cliente: number = 0;
  descripcion: string = '';

  empresaSeleccionada: string = '';
  clientesSeleccionados: { descripcion: string; clienteEdiConfiguracionId: any } = { descripcion: '', clienteEdiConfiguracionId: 0 };

  empresas: string[] = [];
  clientes: { descripcion: string; clienteEdiConfiguracionId: any }[] = [];
  empresasClientes: { empresa: string; clientes: { descripcion: string; clienteEdiConfiguracionId: any; }[] }[] | undefined;

  constructor(
    private ediBoardService: EdiBoardService,
    private router: Router,
    private sharedService: SharedService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getEmpresasClientes();
  }

  async getEmpresasClientes(): Promise<void> {
    try {
      const response = await this.ediBoardService.getEmpresaCliente().toPromise();

      console.log('response', response);
      if (response && response.dataSingle) {
        const empresasClientesMap: Map<string, { empresa: string; clientes: { descripcion: string; clienteEdiConfiguracionId: any; }[] }> = new Map();

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
              empresasClientesMap.set(Empresa, { empresa: Empresa, clientes: [] });
            }

            empresasClientesMap.get(Empresa)?.clientes.push({
              descripcion: descripcion,
              clienteEdiConfiguracionId: clienteEdiConfiguracionId
            });
          }
        });

        this.empresasClientes = Array.from(empresasClientesMap.values());
        this.empresas = Array.from(empresasClientesMap.keys());
        this.clientes = Array.from(empresasClientesMap.values()).flatMap(item => item.clientes);

        console.log('empresasClientes', this.empresasClientes);
        console.log('empresas', this.empresas);
        console.log('clientes', this.clientes);
      }
    } catch (error) {
      console.error('Error obteniendo la lista de empresas y clientes:', error);
    }
  }

  actualizarCLiente(): void {
    console.log('actualizarCLiente');

    // Verifica si se ha seleccionado un cliente
    if (this.clientesSeleccionados.clienteEdiConfiguracionId) {
      // Encuentra el cliente según el clienteEdiConfiguracionId seleccionado
      const clienteEncontrado = this.clientes?.find(item => item.clienteEdiConfiguracionId === Number(this.clientesSeleccionados.clienteEdiConfiguracionId));

      // Asigna el cliente encontrado o un objeto por defecto si no se encuentra
      this.clientesSeleccionados = clienteEncontrado || { descripcion: '', clienteEdiConfiguracionId: 0 };
    } else {
      // Si no se ha seleccionado un cliente, asigna el primer cliente de la lista
      this.clientesSeleccionados = this.clientes?.[0] || { descripcion: '', clienteEdiConfiguracionId: 0 };
    }
    console.log(this.clientesSeleccionados);
  }

  actualizarClientesSegunEmpresa() {
    if (this.empresasClientes) {
      // Loguea el valor seleccionado para verificar
      console.log('Empresa seleccionada:', this.empresaSeleccionada);

      // Encuentra la lista de clientes según la empresa seleccionada
      const clientesPorEmpresa = this.empresasClientes.find(item => item.empresa === this.empresaSeleccionada);

      // Si encuentra la lista de clientes, asigna al array de clientes; de lo contrario, vacía el array de clientes
      this.clientes = clientesPorEmpresa ? clientesPorEmpresa.clientes : [];
    } else {
      console.error('Error obteniendo la lista de empresas y clientes');
      // Lanza un error o maneja el error de acuerdo a tus necesidades
    }
  }

  btnAuth(): void {
    console.log('btnRegistrar');

    // Verifica si se ha seleccionado un cliente
    if (!this.clientesSeleccionados.clienteEdiConfiguracionId) {
      // Si no se ha seleccionado un cliente, asigna el primer cliente de la lista
      this.clientesSeleccionados = this.clientes?.[0] || { descripcion: '', clienteEdiConfiguracionId: 0 };
    }

    console.log(this.empresaSeleccionada, this.clientesSeleccionados.clienteEdiConfiguracionId);
    console.log(this.empresaSeleccionada, this.clientesSeleccionados);
    this.RegistroFiltro(this.empresaSeleccionada, this.clientesSeleccionados);
  }


  async RegistroFiltro(empresa: string, clienteDescripcion: { descripcion: string; clienteEdiConfiguracionId: number }): Promise<void> {
    console.log('RegistroFiltro', empresa, clienteDescripcion.clienteEdiConfiguracionId);
    try {
      // Obtener el token de autenticación
      const response = await this.ediBoardService.postAuthEdiBoard(empresa).toPromise();
      const token = response?.token;

      if (!token) {
        console.error('Error al obtener el token de autenticación.');
        return;
      }

      // Obtener los datos del EdiBoard usando el token
      const EdiBoard = await this.ediBoardService.getEdiBoardInfo(token, this.empresaSeleccionada, clienteDescripcion.clienteEdiConfiguracionId).toPromise();
      //console.log('EdiBoard', EdiBoard.dataSingle);

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

        // Navegar a la página de board
        this.router.navigate(['/board']);

      } else {
        console.error('La respuesta de la API es inválida.');
      }
    } catch (error) {
      console.error('Error obteniendo datos del EdiBoard:', error);
    } finally {
      //console.log('finally');
    }
  }

}
