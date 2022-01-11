package com.example.demo.models.entity;

import java.io.Serializable;
import javax.persistence.*;

@Entity
@Table(name = "regiones")
public class Region implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) // Autoincremental

	private Long id;

	//Sise omite column se da por hecho que el nombre es igual en la bd
	private String nombre;

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

}
