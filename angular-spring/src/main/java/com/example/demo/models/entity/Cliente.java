package com.example.demo.models.entity;

import java.io.Serializable;
import java.util.Date;
import javax.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

@Entity
@Table(name="clientes")
public class Cliente implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	// @Column() -> las columnas se llaman igual así que se puede omitir
	@Column(nullable=false)
	@NotEmpty(message="no puede estar vacio") // Si no se pone coge el idioma del navegador
	@Size(min=4, max=12, message="el tamaño debe estar entre 4 y 12 caracteres")
	private String nombre;
	
	@NotEmpty
	private String apellido;
	
	@NotEmpty
	@Email(message="no es una dirección de correo bien formada")
	@Column(nullable=false, unique=true)
	private String email;
	
	@NotNull(message="no puede estar vacio")
	@Column(name="create_at")
	@Temporal(TemporalType.DATE) //Transforma el date de java al de sql
	private Date createAt;
	
	//En aplication properties hay que cambiar el limite de peso del archivo
	private String foto;
	
	// muchos clientes, una region
	@ManyToOne(fetch=FetchType.LAZY) //Cada vez que invoquemos a region, se realiza la carga
	@JoinColumn(name="region_id") //Nombre llave foranea, si se omite se crea con el mismo formato: nombre_id
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	// La propiedad lazy crea un proxy que genera otros atributos, de ahi el ignore (los quita del json)
	// Si no se hace da error en el get
	@NotNull(message="no puede ser vacía")
	public Region region;
	
	//@PrePersist Asigna la fecha actual automaticamente
	/*
	public void prePersist() {
		createAt = new Date();
	}*/

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getApellido() {
		return apellido;
	}

	public void setApellido(String apellido) {
		this.apellido = apellido;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Date getCreateAt() {
		return createAt;
	}

	public void setCreateAt(Date createAt) {
		this.createAt = createAt;
	}

	public String getFoto() {
		return foto;
	}

	public void setFoto(String foto) {
		this.foto = foto;
	}

	public Region getRegion() {
		return region;
	}

	public void setRegion(Region region) {
		this.region = region;
	}
	
	

}
