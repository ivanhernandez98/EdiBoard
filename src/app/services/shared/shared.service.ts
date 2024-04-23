import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PosicionViajesModel } from 'src/app/models/PosicionesViajesModelEdi';
import { dataSingle, EmpresaCliente } from 'src/app/models/EmpresaCliente';
import { environment } from 'src/app/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private subscriptions: Subscription[] = [];

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

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();



  private autoNavigateSubject = new BehaviorSubject<boolean>(environment.autoNavigate);
  public autoNavigate$ = this.autoNavigateSubject.asObservable();

  private autonavigateResult: boolean = environment.autoNavigate;

  constructor() {
    // Aquí podrías realizar alguna lógica para determinar si el usuario está autenticado al iniciar la aplicación
    // Por ejemplo, podrías verificar si tienes un token válido almacenado en el localStorage
    const token = localStorage.getItem('token');
    this.isAuthenticatedSubject.next(!!token); // Emitir true si hay un token, false si no
  }

  isAuthenticated(): boolean {
    console.log('esta autentificado')
    return this.isAuthenticatedSubject.value;
  }

  setAutoNavigate(): void {

    this.autonavigateResult = !this.autonavigateResult;

    console.log('setAutoNavigate', this.autonavigateResult);
    this.autoNavigateSubject.next(this.autonavigateResult);
  }

  getAutoNavigate() {
    return this.autonavigateResult;
  }

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


  // Método para limpiar todas las variables en el servicio compartido
  clearAllData(): void {
    console.log('Clearing all data in SharedService');

      // En clearAllData():
    this.subscriptions.forEach(subscription => subscription.unsubscribe());

    //this.autoNavigateSubject.next(false);
    this.dataSingleEdiResultSubject.next(null);
    this.dataSingleSubject.next(null);
    this.TokenSubject.next('');
    this.descripcionSubject.next('');
    this.empresaSeleccionadaSubject.next('');
    this.clienteSeleccionadoSubject.next(0);
  }

}
