import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component'; // Asegúrate de importar el componente de inicio
import { BoardComponent } from './pages/board/board.component';
import { MetricosComponent } from './pages/metricos/metricos.component';

import { ViajesComponent } from './pages/viajes/viajes.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Ruta por defecto apunta a la página de inicio
  { path: 'board', component: BoardComponent },
  { path: 'metricos', component: MetricosComponent  },
  { path: 'viajes', component: ViajesComponent  },
  // Puedes agregar más rutas según tus necesidades
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
