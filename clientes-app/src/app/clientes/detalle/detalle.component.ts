import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import {ClienteService} from '../cliente.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  //cliente: Cliente;
  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  fotoSeleccionada: File;
  progreso: number = 0;

  constructor(private clienteService: ClienteService, /*private activatedRoute: ActivatedRoute,*/
    public modalService: ModalService) { }

  ngOnInit(): void {
    /*
    Sin modal
    this.activatedRoute.paramMap.subscribe(params =>{
      let id: number = +params.get('id');
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente =>{
          this.cliente = cliente;
        })
      }
    })
    */
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0; // Cada vez que se termine de subir una foto se debe reiniciar la variable
    console.log(this.fotoSeleccionada);
    //busca coincidencias en un string y devuelve el indice
    // accede al atributo type del json basicamente
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      Swal.fire('Error seleccionar imagen: ', 'El archivo debe ser del tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      Swal.fire('Error upload', 'Error: debe seleccionar una foto', 'error');
    }
    else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(
        /* Sin progreso
        cliente =>{
        this.cliente = cliente;
        Swal.fire('La foto se ha subido completamente', `La foto se ha subido con éxito: ${this.cliente.foto}`, 'success' )
      })*/
      //Con progreso
      event =>{
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
          console.log(this.progreso);
        } else if(event.type === HttpEventType.Response){
          let response: any = event.body;
          this.cliente = response.cliente as Cliente;
          // Aunque sea un getter se usa como una variable
          // Emite el cliente actualizado (con la foto nueva)
          this.modalService.notificarUpload.emit(this.cliente);

          Swal.fire('La foto se ha subido completamente', response.mensaje, 'success' )
        }
      })
    }
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

}
