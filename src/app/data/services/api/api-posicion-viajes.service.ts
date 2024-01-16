import { Clientes } from './../../interfaces/Cliente';
  import { PosicionViaje,PosicionesViajes } from './../../interfaces/PosicionViaje';
  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { environment } from '../../../../../src/app/environments/environment.prod';


  @Injectable({
    providedIn: 'root'
  })
  export class ApiPosicionViajesServicesService {
    private empCli = environment.API_V_EDI_EmpCli;
    private apiUrl = environment.API_URL_POSVIAJES; // Reemplaza con la URL correcta de tu API
    private posURL = environment.API_VISOR_PosViajes;
    private posViajEdi = environment.API_URL_PosViaEdi;

    constructor(private http: HttpClient) {}

    obtenerPosicionViaje(noViaje: number, empresa: string, tipoSolicitud: number): Observable<PosicionViaje> {
      const url = `${this.apiUrl}?noViaje=${noViaje}&empresa=${empresa}&tipoSolicitud=${tipoSolicitud}`;
      return this.http.get<PosicionViaje>(url);
    }

    obtenerTrayectoViajes(empresa: string): Observable<PosicionesViajes[]> {
      const trayectoUrl =  `${ this.posURL }?empresa=${empresa}`;
      return this.http.get<PosicionesViajes[]>(trayectoUrl);
    }

    // Nuevo método para obtener empresas cliente
    getEmpresasCliente(): Observable<Clientes[]> {
      const empresasClienteUrl = `${this.empCli}`;
      return this.http.get<Clientes[]>(empresasClienteUrl);
    }

    getPosicionesEdi(empresa: string, clienteId: number): Observable<PosicionesViajes[]> {
      const url = `${this.posViajEdi}/GetPosicionesEdi?empresa=${empresa}&clienteId=${clienteId}`;
      return this.http.get<PosicionesViajes[]>(url);
    }

  }
