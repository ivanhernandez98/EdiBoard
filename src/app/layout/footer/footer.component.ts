import { Component } from '@angular/core';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  empresa: string = '';
  descripcion: string = '';
  autoNavigateChecked: boolean = false;

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
