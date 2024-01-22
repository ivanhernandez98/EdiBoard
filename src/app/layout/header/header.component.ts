import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  descripcion: string = '';

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.descripcion$.subscribe((descripcion) => {
      this.descripcion = descripcion;
    });
  }
}
