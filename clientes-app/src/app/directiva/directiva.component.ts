import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
})
export class DirectivaComponent {
  habilitar: boolean = true;
  title: string = "Ocultar";
  listaCurso: string[] = ['TypeScript', 'JavaScript', 'Java se', 'PHP']
  constructor() { }
  setHabilitar(): void {
    this.habilitar = !this.habilitar;
  }
}
