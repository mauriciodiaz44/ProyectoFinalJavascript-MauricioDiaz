// Botones categorias
let todosLosProductos = document.getElementById("todos-los-productos");
const botonesCategorias = document.querySelectorAll(".accordion-text");
const tituloCategoria = document.getElementById("banner-title");

// Numero arriba del carrito
const numero = document.getElementById("header-numerito");

// Input del buscador
const searchInput = document.getElementById("search-input");
const search = document.getElementById("search-form");
let resultadoTitulo = document.getElementById("results");
let resultadoParrafo = document.getElementById("results-p");

let productsViews = document.getElementById("products-views");
let productsResults = document.getElementById("products-results");

// SelectBox para ordenar
let selectFilter = document.getElementById("select-filter");


// Variable para separar los miles con una coma
const formatoHispano = new Intl.NumberFormat('es-MX').format;

// Cargador de productos
function cargarProductos(array) {

  productosContenedor.innerHTML = "";
  
  array.forEach(producto => {

    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <div class="product-content">
          <div class="product-image">
              <img src="${producto.imagen}" alt="${producto.titulo}">
          </div>
          <div class="product-detail">
              <a href="#" class="product-title">${producto.titulo}</a>
              <h2 class="product-price">$ ${formatoHispano(producto.precio)}</h2>
              <button id="${producto.id}" class="boton product-add">Añadir al carrito</button>
          </div>
      </div>
    `;

    productosContenedor.append(div);
  })
  actualizarBotonesAgregar();
}

// Evento Filtrador de categorias
botonesCategorias.forEach(boton => {
  boton.addEventListener("click", (e) => {

    limpiarResultados();

    // Busca el nombre del categoria buscada
    const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
    tituloCategoria.innerText = productoCategoria.categoria.nombre;
    animateCSS(tituloCategoria, 'fadeIn');

    // Filtra la categoria
    const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
    cargarProductos(productosBoton);
  })
});

// Boton todos los productos carga la array completa
todosLosProductos.addEventListener("click", ()=>{

  animateCSS(tituloCategoria, 'fadeIn');
  tituloCategoria.innerText = "PRODUCTOS";
  limpiarResultados();
  cargarProductos(productos);
});


// Actualizo los botones de añadir que no existian
function actualizarBotonesAgregar(){
  botonesAgregar = document.querySelectorAll(".product-add");

  botonesAgregar.forEach(boton =>{
    boton.addEventListener("click", agregarAlCarrito)
  })
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
  productosEnCarrito = JSON.parse(productosEnCarritoLS);
  actualizarNumerito();
} else {
  productosEnCarrito = [];
}


function agregarAlCarrito(e){
  const botonID = e.currentTarget.id;
  const productoAgregado = productos.find(producto => producto.id === botonID);

  // Busca en el array si ya se agrego el producto. Si cumple el if suma otra cantidad.
  if(productosEnCarrito.some(producto => producto.id === botonID)){
    const index = productosEnCarrito.findIndex(producto => producto.id === botonID);
    productosEnCarrito[index].cantidad++;
  } else {
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
  }
  actualizarNumerito();

  Toastify({
    text: `${productoAgregado.titulo} se ha agregado al carrito.`,
    className: "notif",
    avatar: '../assets/images/check.svg',
    duration: 2000,
    newWindow: true,
    close: false,
    gravity: "bottom",
    position: "right",
    stopOnFocus: false,
    style: {
      background: "#746fb9",
      color: "#fff"
    },
  }).showToast();

  localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// Actualizador del numerito arriba del carrito
function actualizarNumerito(){
  let numeroCarrito = productosEnCarrito.reduce((acc, producto)=> acc + producto.cantidad, 0)
  numero.innerText = numeroCarrito;
}


// Motor de busqueda de productos
search.addEventListener("submit", (e)=>{
  // Para no cambiar la url cada vez que de submit
  e.preventDefault();
  
  buscarProducto(searchInput.value.toLowerCase(), productos)
})

// Para limpiar los resultados de busqueda
function limpiarResultados(){
  productsViews.classList.remove("disabled");
  productsResults.classList.remove("mb-3");
  resultadoTitulo.innerText="";
  resultadoParrafo.innerText="";
}

// Funcion filtrar array a los productos buscados
function buscarProducto(buscado, array){

    let busqueda = array.filter(
        (producto)=> producto.titulo.toLowerCase().includes(buscado)
    );
    
    if(busqueda.length == 0){
      tituloCategoria.innerText = "";
      productsViews.classList.add("disabled");
      productsResults.classList.remove("mb-3");
      resultadoTitulo.innerText=`Resultados de búsqueda para "${buscado}"`;
      resultadoParrafo.innerText="No se encontraron productos que concuerden con la selección.";
      cargarProductos(busqueda);
    } else if(busqueda.length > 0 && !buscado == ''){
      tituloCategoria.innerText = "";
      productsViews.classList.remove("disabled");
      productsResults.classList.add("mb-3");
      resultadoTitulo.innerText=`Resultados de búsqueda para "${buscado}"`;
      resultadoParrafo.innerText="";
      cargarProductos(busqueda);
    } else {
      limpiarResultados();
      tituloCategoria.innerText = "PRODUCTOS";
      cargarProductos(busqueda);
    }
}

// Ordenado de productos en base al titulo del banner
// Option 3
function ordenarMenorMayor(array){
  if (tituloCategoria.innerText != "PRODUCTOS") {
    const productosOrdenar = array.filter(producto => producto.categoria.nombre === tituloCategoria.innerText);

    productosOrdenar.sort((a,b) => a.precio - b.precio);
    cargarProductos(productosOrdenar);
  }else{
    const menorMayor = [].concat(array);

    menorMayor.sort((a,b) => a.precio - b.precio);
    cargarProductos(menorMayor);
  }
}

// Option 2
function ordenarMayorMenor(array){
  if (tituloCategoria.innerText != "PRODUCTOS") {
    const productosOrdenar = array.filter(producto => producto.categoria.nombre === tituloCategoria.innerText);

    productosOrdenar.sort((a, b)=>{ return b.precio - a.precio;});
    cargarProductos(productosOrdenar);
  }else{
    const mayorMenor = [].concat(array);

    mayorMenor.sort((a, b)=>{
        return b.precio - a.precio;
    });
    cargarProductos(mayorMenor);
  }
}

// Option 1
function ordenarAlfabeticamenteTitulo(array){
  if (tituloCategoria.innerText != "PRODUCTOS") {
    const productosOrdenar = array.filter(producto => producto.categoria.nombre === tituloCategoria.innerText);

    productosOrdenar.sort((a,b) => {
      if(a.titulo > b.titulo) {
          return 1
      }
      if (a.titulo < b.titulo) {
          return -1
      }
      return 0;
    })
    cargarProductos(productosOrdenar);
  }else{
    const ordenadoAlfabeticamente = [].concat(array)
    ordenadoAlfabeticamente.sort((a,b) => {
      if(a.titulo > b.titulo) {
        return 1
      }
      if (a.titulo < b.titulo) {
          return -1
      }
      return 0;
    })
    cargarProductos(ordenadoAlfabeticamente);
  }
}

// Filtrado selectbox
selectFilter.addEventListener("change", ()=>{
  limpiarResultados()
    if(selectFilter.value == 1){
      ordenarAlfabeticamenteTitulo(productos);
    }else if(selectFilter.value == 2){
      ordenarMayorMenor(productos);
    }else if(selectFilter.value == 3){
      ordenarMenorMayor(productos);
    }else{
      tituloCategoria.innerText = "PRODUCTOS";
      cargarProductos(productos);
    }
})

// Timeout de carga de los productos
setTimeout(()=>{
  cargarProductos(productos);
}, 3000);