//class constructora
class Producto {
    constructor(id, titulo, imagen, categoria, categoriaNombre, categoriaId, precio){
        //propiedades o atributos de nuestra clase
        this.id = id,
        this.titulo = titulo,
        this.imagen = imagen,
        this.categoria = categoria,
        this.categoria.nombre = categoriaNombre,
        this.categoria.id = categoriaId,
        this.precio = precio

    }
}

// Array de productos
const productos = []

const cargadorProductos = async () => {
  const response = await fetch("../productos.json");
  const data = await response.json();

  for(let producto of data) {
    let productoNuevo = new Producto(
      producto.id,
      producto.titulo,
      producto.imagen,
      producto.categoria,
      producto.categoria.nombre,
      producto.categoria.id,
      producto.precio
    );
    productos.push(productoNuevo);
  }
}
cargadorProductos();