import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EmpresaCliente } from '../models/EmpresaCliente';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EdiBoardService {

  public tokenBearer = "";
  private baseEndpoint = ""; //EstatusViajes
  private usuario = "master";
  private password = "master";

  private edibaseEndpoint = environment.API_URL_EDIBOARD;

  constructor(private http: HttpClient) { }

  public getEmpresaCliente(): Observable<EmpresaCliente> {
    //return this.http.get<EmpresaCliente>(this.edibaseEndpoint + 'GetEmpresaCliente');
    return this.http.get<EmpresaCliente>("https://gps.apphgtransportaciones.com/apiViajes/api/PosicionViajes/GetEmpresaCliente"); //Productiva
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

/*   public postAuthEdiBoard(empresa: string): Observable<any> {
    const usuario = 'master';
    const password = 'master';

    const conexion = `${this.edibaseEndpoint}getToken?user=${usuario}&password=${password}&empresa=${empresa}`;
    console.log('conexion', conexion);

    return new Observable<any>(observer => {
      this.http.get<any>(conexion)
        .subscribe(response => {
          observer.next(response);
          observer.complete();
        }, error => {
          console.error('Error al obtener la auth del tablero EDI:', error);
          observer.error(error);
        });
    });
  } */

  public postAuthEdiBoard(empresa: string): Observable<any> {
    const usuario = 'master';
    const password = 'master';

    const conexion = `${this.edibaseEndpoint}getToken?user=${usuario}&password=${password}&empresa=${empresa}`;
    console.log('conexion', conexion);

    return new Observable<any>(observer => {
      this.http.get<any>(conexion)
        .subscribe(response => {
          observer.next(response);
          observer.complete();
        }, error => {
          console.error('Error al obtener la auth del tablero EDI:', error);
          observer.error(error);
        });
    });
  }



  public getEdiBoardInfo(token: string, ClienteEdiConfiguracionId: number): Observable<any> {
    return new Observable<any>(observer => {
      this.getAuthToken(token).then(token => {
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
