import { Injectable } from '@angular/core';
//import { CLIENTES } from './clientes.json';
//para base de datos sin spring
import { Cliente } from './cliente';
import { of, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http'
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { Region } from './region';



@Injectable()
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  private progreso: number = 0;

  constructor(private http: HttpClient, private router: Router) {

  }

  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.urlEndPoint, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        // Si quiero mapear de any a cliente de manera manual
        //map((response: any) => response.cliente as Cliente),
        if (e.status == 400) {
          return throwError(e);
        }

        this.router.navigate(['/clientes'])
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e); //Devuelve un observable
      }))
  }

  /* Sin paginacion
    getClientes(): Observable<Cliente[]> {
      //return this.http.get<Cliente[]>(this.urlEndPoint)
      // Para cambiar formatos y tal se usa lo de abajo
      return this.http.get<Cliente[]>(this.urlEndPoint).pipe(
        tap(response =>{ // Tap no modifica los valores
          // necesita cambiar el tipo object a cliente para usar foreach
          console.log("ClienteService: Tap1");
          let clientes = response as Cliente[];
          clientes.forEach(cliente => {
            console.log(cliente.nombre)
          })
        }),
        map(response => { // Transforma valores
          let clientes = response as Cliente[];
          return clientes.map(cliente=>{
            cliente.nombre = cliente.nombre.toUpperCase();
            // registerLocaleData(localeES, 'es'); -> Se pasa a appmodule para tenerlo en todo el proyecto
            // Por defecto viene en ingles, de serlo no tendria que registrar ni nada
            // Se puede hace ren el front con LOCALE_ID, yo no lo he hecho
            cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MMMM/yyyy', 'es-ES');
            return cliente;
          })
        }),
        // En este tap ya se aplicarian los cambios del map
        // Entonces response ya sería de tipo cliente (el orden de map y tap importa)
        tap(response =>{ 
          console.log("ClienteService: Tap2");
  
          response.forEach(cliente => {
            console.log(cliente.nombre)
          })
        }),
      )
    }*/


  //Con paginación
  getClientes(page: number): Observable<any> {
    // response:any porque es un json
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log("ClienteService: Tap1");
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      }),
      map((response: any) => { // Transforma valores
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          return cliente;
        });
        return response;
      }),
      // En este tap ya se aplicarian los cambios del map
      // Entonces response ya sería de tipo cliente (el orden de map y tap importa)
      tap(response => {
        console.log("ClienteService: Tap2");

        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre)
        })
      }),
    )
  }
  /*
  Reactivo en local
  getClientes(): Observable<Cliente[]> {
    return of(CLIENTES);
  }*/
  /*getClientes(): Cliente[]{
    return CLIENTES;
  }*/

  // Sin catcherror es igual pero quitando a partir de pipe (abajo)
  /* getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`)
  }
  */
  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(catchError(e => {
      this.router.navigate(['/clientes'])
      console.error(e.error.mensaje);
      Swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e)
    }))
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        this.router.navigate(['/clientes'])
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e)
      }))
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(catchError(e => {
      this.router.navigate(['/clientes'])
      console.error(e.error.mensaje);
      Swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e)
    }))
  }

  // Sin barra
  //subirFoto(archivo: File, id): Observable<Cliente> {

  //Con barra
  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    //Nombre que le pusimos al requestparam en el back
    formData.append("archivo", archivo);
    formData.append("id", id);

    //Con barra de progreso
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
    //sin barra de progreso
    /*return this.http.post(`${this.urlEndPoint}/upload`, formData).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e)

      }));
      */
  }
}
