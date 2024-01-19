import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { MenuItem } from '../data/interfaces/MenuItem';
import { environment } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  private readonly resetTokenKey = 'reset_token';
  private resetTokenSubject = new BehaviorSubject<string | null>(null);
  resetToken$ = this.resetTokenSubject.asObservable();

  public usuario:  string | null = null;
  public usernameChanged = new Subject<string | null>();
  public compania: string | null = null ;
  public menuCompania: MenuItem[]=[];
  private selectedCompanySubject = new BehaviorSubject<string | null>(null);
  selectedCompany$ = this.selectedCompanySubject.asObservable();

  public menuItems: MenuItem[] = [];
  public menuItemsChanged = new Subject<MenuItem[]>();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private router: Router) {}

  login(credentials: any) {
    // Lógica de autenticación (puede ser una llamada a una API)
    const isValid = credentials.username === 'user' && credentials.password === 'password';

    return this.http.post( environment.API_URL_LOGIN , credentials)
    .pipe(
      tap(response => {
        const token = (response as any).token;
        localStorage.setItem(this.tokenKey, token);
        this.setAuthState(token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('usuario');
    this.usernameChanged.next(null);
    this.menuItemsChanged.next([]);
    this.usuario = null;
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setResetToken(token: string) {
    localStorage.setItem(this.resetTokenKey, token);
    this.resetTokenSubject.next(token);
  }

  getResetToken(): string | null {
    return localStorage.getItem(this.resetTokenKey);
  }

  private setAuthState(token: string) {
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.usuario = decodedToken.Usuario;
    localStorage.setItem("usuario", decodedToken.Usuario);

    this.usernameChanged.next(decodedToken.Usuario);
    try {
      const menuArray: MenuItem[] = JSON.parse(decodedToken.Menus);
      this.menuItems = menuArray;
      //console.log(this.menuItems);
      this.menuItemsChanged.next(menuArray);
    } catch (error) {
      console.error("Error al parsear el menú:", error);
    }
  }

  forgotPassword(email: string) {
    console.log(`Forgot password requested for ${email}`); // Lógica para enviar correo de restablecimiento (puede ser una llamada a una API)
    return this.http.post(environment.API_URL_FPASS, email);
  }

  sendResetEmail(email: any): Observable<any> {
    //const resetModel = { email: email };
    //console.log(email);

    // Ajusta la URL de la API según tu implementación
    return this.http.post('https://hgtransportaciones.com/security/api/auth/forgotpassword', email);
  }

  selectCompany(company: string) {
    this.compania =company;
  }

  selectMenuCompania(): MenuItem[] {

    this.menuCompania = [];
    const itemsCompania = this.menuItems;
   //  .find(item => (item.IdCompania == parseInt(this.compania)));
    if(itemsCompania != null)
       this.menuCompania.push(this.menuItems[0]);

     return  this.menuCompania;
   }

   permisosObj(idObj:number): any {
     return this.menuItems.find(item => (item.Id == idObj ));
   }

}
