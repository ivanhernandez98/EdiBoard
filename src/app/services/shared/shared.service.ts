import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PosicionViajesModel } from 'src/app/models/PosicionesViajesModelEdi';
import { dataSingle, EmpresaCliente } from 'src/app/models/EmpresaCliente';

@Injectable({
  providedIn: 'root',
})
export class SharedService {

  private dataSingleEdiResultSubject = new BehaviorSubject<PosicionViajesModel.DataSingleEdiResult | null>(null);
  public dataSingleEdiResult$ = this.dataSingleEdiResultSubject.asObservable();

  private dataSingleSubject = new BehaviorSubject<dataSingle[] | null>(null);
  public dataSingle$ = this.dataSingleSubject.asObservable();




  private empresaSeleccionadaSubject = new BehaviorSubject<string>('');
  public empresaSeleccionada$ = this.empresaSeleccionadaSubject.asObservable();

  private clienteSeleccionadoSubject = new BehaviorSubject<number>(0);
  public clienteSeleccionado$ = this.clienteSeleccionadoSubject.asObservable();

  private descripcionSubject = new BehaviorSubject<string>('');
  public descripcion$ = this.descripcionSubject.asObservable();

  private TokenSubject = new BehaviorSubject<string>('');
  public Token$ = this.TokenSubject.asObservable();

  setDataSingleEdiResult(data: PosicionViajesModel.DataSingleEdiResult): void {
    console.log('setDataSingleEdiResult', data);
    this.dataSingleEdiResultSubject.next(data);
  }

  setDataSingle(data: dataSingle[]): void {
    console.log('setDataSingle', data);
    this.dataSingleSubject.next(data);
  }


  setToken(token: string): void {
    console.log('setToken', token);
    this.TokenSubject.next(token);
  }

  setDescripcion(descripcion: string): void {
    console.log('setDescripcion', descripcion);
    this.descripcionSubject.next(descripcion);
  }

  setEmpresaSeleccionada(empresa: string): void {
    console.log('setEmpresaSeleccionada', empresa);
    this.empresaSeleccionadaSubject.next(empresa);
  }

  setClienteSeleccionado(cliente: number): void {
    console.log('setClienteSeleccionado', cliente);
    this.clienteSeleccionadoSubject.next(cliente);
  }

}
