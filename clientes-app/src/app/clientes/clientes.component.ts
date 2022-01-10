import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators'
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute,
    private modalService: ModalService) { }

  ngOnInit(): void {
    //this.clientes = this.clienteService.getClientes();
    this.activatedRoute.paramMap.subscribe(params => {
      // Parametro de la url
      let page: number = +params.get('page'); // el mas convierte de string a number
      if (!page) page = 0;

      // Pide los clientes por paginación
      // Imprime los clientes en la consola
      // Se suscribe a los cambios del paginador (informacion de las paginas) y de clientes
      this.clienteService.getClientes(page).pipe(
        tap(response => {
          console.log('ClienteContent: tap 3');
          console.log(response);
          (response.content as Cliente[]).forEach(cliente => {
            console.log(cliente.nombre);
          });
        })).subscribe(
          response => {
            this.paginador = response;
            this.clientes = response.content as Cliente[]
          });

        });


        // Si hay un cambio en la foto va uno por uno poniendo la nueva
        this.modalService.notificarUpload.subscribe(cliente => {
         this.clientes = this.clientes.map(clienteOriginal =>{
            if(cliente.id == clienteOriginal.id){
              clienteOriginal.foto = cliente.foto
            }
            return clienteOriginal;
          })
        })

    /*
    sin paginacion
    this.clienteService.getClientes().subscribe(
      clientes => this.clientes = clientes
    )*/
    // Lo de arriba es lo mismo que lo de abajo
    /*this.clienteService.getClientes().pipe(tap(
      clientes => this.clientes = clientes)).subscribe()*/

    // Ejemplo de tap
    /*this.clienteService.getClientes().pipe( tap(clientes =>{
      console.log('ClientesComponent tap 3')
      clientes.forEach(cliente => {
        console.log(cliente.nombre);
      });
    })).subscribe(
      clientes => this.clientes = clientes
    )*/
  }

  delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: `Vas a eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(response => {
          this.clientes = this.clientes.filter(cli => cli !== cliente)
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        })
      }
    })
  }


  // La vista envia la instancia del cliente que ha seleccionado
  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
