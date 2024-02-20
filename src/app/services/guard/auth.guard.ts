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
  
  constructor(private sharedService: SharedService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.sharedService.isAuthenticated(); // Método para verificar la autenticación en tu servicio compartido

    if (isAuthenticated) {
      return true; // Permite la navegación si el usuario está autenticado
    } else {
      this.router.navigate(['']); // Redirige al usuario a la página de inicio si no está autenticado
      return false; // No permite la navegación
    }
  }
}
