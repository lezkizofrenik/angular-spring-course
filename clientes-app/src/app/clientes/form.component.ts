import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router'; //ActivaredRoute coge valores de las rutas
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  cliente: Cliente = new Cliente();
  regiones: Region[];
  titulo: string = "Crear Cliente";

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }
    public errors: string[];
  ngOnInit(): void {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = +params['id']
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente => this.cliente = cliente))
      }
    });
    //Cada vez que se inicializa el formulario se cogen las regiones
    this.clienteService.getRegiones().subscribe(regiones =>{
      this.regiones = regiones;
    })
  }

  public create(): void {
    console.log(this.cliente)

    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        Swal.fire('Nuevo cliente', `Cliente ${this.cliente.nombre} creado con éxito`, 'success')
      },
      err => {
        //err.json
        this.errors = err.error.errors as string[];
        console.error(err.error.errors);
      });
   
  }

  //Se devuelve un map de string y cliente, por eso this
  // es como escribir json.cliente.nombre o json.mensaje
  // En realidad se tendria que poner Observable<any> en vez de <Cliente> 
  // en el cliente.service -> update si quisiera acceder al mensaje
  update(): void{
    console.log(this.cliente)
    this.clienteService.update(this.cliente)
    .subscribe(
      json => {
        this.router.navigate(['/clientes']);
        Swal.fire('Cliente Actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success');
      },
      err => {
        this.errors = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }

  compararRegion(o1: Region, o2: Region): boolean{
    if(o1 === undefined && o2 ===undefined){
      return true;
    }
    return (o1 === null || o2 === null || o2 === undefined || o1 === undefined ? false : o1.id===o2.id )
  }

  
}
