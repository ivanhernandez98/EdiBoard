import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable,throwError  } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { EmpresaCliente } from '../../../models/EmpresaCliente';
import { environment } from '../../../environments/environment.prod';



@Injectable({
  providedIn: 'root'
})
export class EdiBoardService {

  public tokenBearer = "";
  private edibaseEndpoint = environment.API_URL_EDIBOARD;
  private edibaseEndpointEmpresaCliente = environment.API_V_EDI_EmpCli;

  constructor(private http: HttpClient) { }

  public getEmpresaCliente(): Observable<EmpresaCliente> {
    //return this.http.get<EmpresaCliente>(this.edibaseEndpoint + 'GetEmpresaCliente');
    return this.http.get<EmpresaCliente>(this.edibaseEndpointEmpresaCliente); //Productiva
  }

  public postAuthEdiBoard(empresa: string): Observable<any> {
    const conexion = `${this.edibaseEndpoint}getToken`;
    //console.log('conexion', conexion);

    return from((async () => {
      try {
        const response = await fetch(`${conexion}?user=master&password=master&empresa=${empresa}`, {
          method: 'POST',
          headers: {}
        });

        if (response.ok) {
          const result = await response.json();
          this.tokenBearer = result.token;

          //console.log( this.tokenBearer ,result);
          return result;
        } else {
          console.error('Error al obtener la auth del tablero EDI:', response.statusText);
          throw new Error(response.statusText);
        }
      } catch (err) {
        console.error(err);
        throw err;
      }
    })());
  }

  public getEdiBoardInfo(token: string, empresa: string, ClienteEdiConfiguracionId: number): Observable<any> {
    console.log('getEdiBoardInfo', empresa, ClienteEdiConfiguracionId);

    return new Observable<any>(observer => {
      const headers = new HttpHeaders({
        'Authorization': `${token}`
      });

      const tripInfoEndpoint = `${this.edibaseEndpoint}api/EstatusViajesEdi?empresa=${empresa}&ClienteEdiConfiguracionId=${ClienteEdiConfiguracionId}`;
      //const tripInfoEndpoint = `${this.edibaseEndpoint}api/EstatusViajesEdi?empresa=${'HG'}&ClienteEdiConfiguracionId=${2}`;
      this.http.get<any>(tripInfoEndpoint, { headers })
        .pipe(
          catchError(error => {
            console.error('Error al obtener la información del viaje:', error);
            observer.error(error);
            return throwError(error);
          })
        )
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
  }

  public getEdiBoardMetricos(token: string, empresa: string, ClienteEdiConfiguracionId: number): Observable<any> {
    console.log('getEdiBoardInfo', empresa, ClienteEdiConfiguracionId);

    return new Observable<any>(observer => {
      const headers = new HttpHeaders({
        'Authorization': `${token}`
      });

      const tripInfoEndpoint = `${this.edibaseEndpoint}GetEdiMetricInfo?ClienteEdiConfiguracionId=${ClienteEdiConfiguracionId}&empresa=${empresa}`;

      this.http.get<any>(tripInfoEndpoint, { headers })
        .pipe(
          catchError(error => {
            console.error('Error al obtener la información del viaje:', error);
            observer.error(error);
            return throwError(error);
          })
        )
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
  }


}
