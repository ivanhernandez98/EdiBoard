import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EmpresaCliente } from '../models/EmpresaCliente';
//export { EmpresaClientes } from '../models/EmpresaCliente'; // Add this line to export the module

@Injectable({
  providedIn: 'root'
})
export class EdiBoardService {

  private baseEndpoint = "https://datahub.apphgtransportaciones.com/";
  private usuario = "master";
  private password = "master";

  private edibaseEndpoint = "https://gps.apphgtransportaciones.com/apiViajes/api/PosicionViajes/";

  constructor(private http: HttpClient) { }

  public getEmpresaCliente(): Observable<EmpresaCliente> {
    return this.http.get<EmpresaCliente>(this.edibaseEndpoint + 'GetEmpresaCliente');
  }

  private async getAuthToken(empresa: string): Promise<string | null> {
    try {
      const tokenEndpoint = `${this.baseEndpoint}GetAuthToken`;
      const credentials = { usuario: this.usuario, password: this.password, empresa: empresa };
      const response = await this.http.post<{ token: string }>(tokenEndpoint, credentials).toPromise();

      return response!.token;
    } catch (error) {
      console.error('Error obteniendo el token de autenticación:', error);
      return null;
    }
  }

  public getEdiBoardInfo(empresa: string, ClienteEdiConfiguracionId: number): Observable<any> {
    return new Observable<any>(observer => {
      this.getAuthToken(empresa).then(token => {
        if (!token) {
          observer.error('Error al obtener el token de autenticación.');
          return;
        }

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        const tripInfoEndpoint = `${this.baseEndpoint}EdiTripInfo?ClienteEdiConfiguracionId=${ClienteEdiConfiguracionId}`;
        this.http.get<any>(tripInfoEndpoint, { headers })
          .subscribe(
            response => {
              observer.next(response);
              observer.complete();
            },
            error => {
              console.error('Error al obtener la información del viaje:', error);
              observer.error(error);
            }
          );
      });
    });
  }
}
