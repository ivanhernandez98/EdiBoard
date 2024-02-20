import { Empresa } from './../../data/interfaces/Empresa';
// header.component.ts
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  empresa: string = '';
  descripcion: string = '';
  autoNavigateChecked: boolean = this.sharedService.getAutoNavigate();

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    // Obtener el valor actual de autoNavigateChecked desde el servicio compartido
    this.sharedService.autoNavigate$.subscribe(autoNavigate => {
      this.autoNavigateChecked = autoNavigate;
    });

    this.sharedService.descripcion$.subscribe((descripcion) => {
      this.descripcion = descripcion;
    });

    this.sharedService.empresaSeleccionada$.subscribe((Empresa) => {
      this.empresa = Empresa;
    });
  }

  onToggleChange(): void {
    this.sharedService.setAutoNavigate();
    //this.sharedService.setAutoNavigate(this.autoNavigateChecked);
  }
}
