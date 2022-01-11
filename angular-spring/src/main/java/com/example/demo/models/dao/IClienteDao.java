package com.example.demo.models.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.example.demo.models.entity.Cliente;
/*
public interface IClienteDao extends CrudRepository<Cliente, Long>{

}
Sin paginación
*/
import com.example.demo.models.entity.Region;

public interface IClienteDao extends JpaRepository<Cliente, Long>{
	// Como solo necesita un metodo no vale la pena crear una interfaz solo para region
	//Si fuera un CRUD entonces si
	@Query("from Region") //Mapea el metodo a una consulta JPA (Personaliza la consulta)
	public List<Region> findAllRegiones();
}