package com.example.demo.models.entity;

import java.io.Serializable;
import java.util.List;

import javax.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario implements Serializable {
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique=true, length=20)
	private String username;
	
	@Column(length=60)
	private String password;
	
	private Boolean enabled;
	
	//cada vez que se elimine un usuario, tambien se eliminaran los roles asignados
	@ManyToMany(fetch=FetchType.LAZY, cascade=CascadeType.ALL)
	//Se crea una tabla intermedia que relaciona a ambas, de nombre tabla1_tabla2
	private List<Role> roles;
	
	
	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getUsername() {
		return username;
	}


	public void setUsername(String username) {
		this.username = username;
	}


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public Boolean getEnabled() {
		return enabled;
	}


	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}


	public List<Role> getRoles() {
		return roles;
	}


	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}


	private static final long serialVersionUID = 1L;
}
