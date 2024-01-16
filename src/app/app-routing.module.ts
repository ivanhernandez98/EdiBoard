import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component'; // Asegúrate de importar el componente de inicio
import { BoardComponent } from './pages/board/board.component';
import { LivetrackingEdiPage } from './pages/livetracking-edi/livetracking-edi.page';


const routes: Routes = [
  { path: '', component: HomeComponent }, // Ruta por defecto apunta a la página de inicio
  { path: 'board', component: BoardComponent },
  { path: 'edi', component: LivetrackingEdiPage  }
  // Puedes agregar más rutas según tus necesidades
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
