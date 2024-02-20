/* import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  return true;
};
 */

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

/*   constructor(private sharedService: SharedService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.sharedService.isAuthenticated(); // Método para verificar la autenticación en tu servicio compartido

    if (isAuthenticated) {
      return true; // Permite la navegación si el usuario está autenticado
    } else {
      this.router.navigate(['']); // Redirige al usuario a la página de inicio si no está autenticado
      return false; // No permite la navegación
    }
  } */

  /* constructor(private sharedService: SharedService, private router: Router) {}

  canActivate(): boolean {
    if (this.sharedService.isAuthenticated()) {
      console.log('board');
      this.router.navigate(['/board']); // Redirige al usuario a la página de inicio si no está autenticado
      return true;
    } else {
      this.router.navigate(['/']); // Redirige al usuario a la página de inicio si no está autenticado
      return false;
    }
  } */

  constructor(private sharedService: SharedService, private router: Router) {}


  canActivate(): boolean {
    // Verificar si el usuario está autenticado utilizando tu servicio compartido
    const isAuthenticated = this.sharedService.isAuthenticated();

    // Si el usuario está autenticado, permitir el acceso a la ruta
    if (isAuthenticated) {
      return true;
    } else {
      // Si el usuario no está autenticado, redirigirlo al componente HomeComponent o cualquier otro componente que desees
      this.router.navigate(['']); // Cambia '/' por la ruta a la que deseas redirigir
      return false;
    }
  }
}
