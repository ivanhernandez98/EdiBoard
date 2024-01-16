import { Component, OnInit } from '@angular/core';
import { EdiBoardService } from '../../access/estatus-shipment.service';
import { dataSingle } from 'src/app/models/EmpresaCliente';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  empresas: [string, string[]][] = [];
  clientes: [string, string[]][] = [];
  empresaSeleccionada: string = '';
  clientesSeleccionados: string[] = [];


  constructor(private ediBoardService: EdiBoardService) { }

  //clientesSeleccionados: string[] = [];


  ngOnInit(): void {
    this.getEmpresasClientes();
  }

  onEmpresaSeleccionada(empresa: [string, string[]]): void {
    // Asigna la empresa seleccionada
    this.empresaSeleccionada = empresa[0];

    // Actualiza el array de clientes seleccionados basándote en la empresa seleccionada
    this.clientesSeleccionados = empresa[1];
  }


  onClienteSeleccionado(cliente: string): void {
    console.log('Cliente seleccionado:', cliente);
  }

  async getEmpresasClientes(): Promise<void> {
    try {
      const response = await this.ediBoardService.getEmpresaCliente().toPromise();

      console.log('Respuesta de la API:', response);
      if (response && response.dataSingle) {
        const empresasMap = new Map<string, string[]>();
        const clientesMap = new Map<string, string[]>();

        response.dataSingle.forEach((item: dataSingle) => {
          let empresaAbreviada: string = '';

          if (item.sqL_DB !== undefined) {
            switch (item.sqL_DB) {
              case 'CHDB_LIS':
                empresaAbreviada = 'CH';
                break;
              case 'HGDB_LIS':
                empresaAbreviada = 'HG';
                break;
              case 'RLDB_LIS':
                empresaAbreviada = 'RL';
                break;
              case 'LINDADB':
                empresaAbreviada = 'LINDA';
                break;
            }
          }

          if (item.descripcion !== undefined) {
            // Agrega la empresa y cliente a los mapas
            if (!empresasMap.has(empresaAbreviada)) {
              empresasMap.set(empresaAbreviada, [item.descripcion]);
            } else {
              empresasMap.get(empresaAbreviada)!.push(item.descripcion);
            }

            // Agrega el cliente al mapa de clientes
            const clientes = clientesMap.get(empresaAbreviada) || [];
            clientes.push(item.descripcion);
            clientesMap.set(empresaAbreviada, clientes);
          }
        });

        // Convierte los mapas a arrays
        this.empresas = Array.from(empresasMap);
        this.clientes = Array.from(clientesMap);

        console.log('Empresas:', this.empresas);
        console.log('Clientes:', this.clientes);

      } else {
        console.error('La respuesta de la API es inválida.');
      }
    } catch (error) {
      console.error('Error obteniendo la lista de empresas y clientes:', error);
    }
  }

}
