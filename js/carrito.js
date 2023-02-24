// Carrito svg y Offcanvas
const carrito = document.getElementById("header-carrito");
const carritoContenedor = document.getElementById("carrito-container");
const carritoHeader = document.getElementById("carrito-header");
const carritoFooter = document.getElementById("carrito-footer");
const carritoFooterContenedor = document.getElementById("carrito-footer-container");
const carritoHeaderContenedor = document.getElementById("carrito-header-container");
// Botones finalizar compra, vaciar carrito y el total del carrito
const carritoFinalizar = document.getElementById("carrito-finalizar");
const carritoVaciar = document.getElementById("carrito-vaciar");
const carritoTotal = document.getElementById("carrito-total");

// Tablas de compra finalizada
const tableContainer = document.getElementById("table-container");
const tableTotal = document.getElementById("table-total");

// Modals de bootstrap
const modals = document.getElementsByClassName("modal");
const modal1 = new bootstrap.Modal(document.getElementById('compraFinalizada'));
const modal2 = new bootstrap.Modal(document.getElementById('compraFinalizada2'));
const modal3 = new bootstrap.Modal(document.getElementById('compraFinalizada3'));

// Compra exitosa
const compraExitosa = document.getElementById("compra-exitosa");
const exitoTotal = document.getElementById("exito-total");

// Cargar productos agregados al carrito de compras
function cargarProductosCarrito(array){
    carritoContenedor.innerHTML="";
  
    if(productosEnCarrito && productosEnCarrito.length > 0){
  
        carritoFooter.classList.remove("disabled");
  
        array.forEach((productoEnCarrito)=>{
            carritoContenedor.innerHTML +=
            `
            <div class="product" id="product${productoEnCarrito.id}">
                <div class="product-image">
                <img src="${productoEnCarrito.imagen}" alt="${productoEnCarrito.titulo}">
                </div>
                <div class="product-detail">
                <a href="#" class="product-title">${productoEnCarrito.titulo}</a>
                <span class="product-price">
                    ${productoEnCarrito.cantidad} ×
                    <span> $ ${formatoHispano(productoEnCarrito.precio)}</span>
                </span>
                </div>
                <button id="productDelete${productoEnCarrito.id}" class="product-delete" type="button"><i class="bi bi-x-circle"></i></button>
            </div>
            `;
        })
        array.forEach((productoEnCarrito)=>{
            document.getElementById(`productDelete${productoEnCarrito.id}`).addEventListener("click", ()=>{
                let producto = document.getElementById(`product${productoEnCarrito.id}`);
                producto.remove();

                let productoEliminar = array.find((producto)=> producto.id == productoEnCarrito.id);
                let posicion = array.indexOf(productoEliminar);
                array.splice(posicion,1)
                localStorage.setItem("productos-en-carrito", JSON.stringify(array));
                cargarProductosCarrito(productosEnCarrito);
            })
        })
    } else {
  
      carritoFooter.classList.add("disabled");

      carritoContenedor.innerHTML = 
      `
        <div class="carrito-vacio">
            <img src="./assets/images/big-cart.svg" alt="cart" height="100">
            <h5 class="carrito-vacio-titulo">El carrito esta vacío</h5>
            <button type="button" class="boton" data-bs-dismiss="offcanvas" aria-label="Close">Volver a la tienda</button>
        </div>
      `;
    }
    actualizarNumerito();
    actualizarTotal(carritoTotal);
}

// Actualizar productos en carrito cuando le de click al mismo
carrito.addEventListener("click", ()=>{
    cargarProductosCarrito(productosEnCarrito);

    animateCSS(carritoContenedor, 'fadeInRight');
    animateCSS(carritoHeaderContenedor, 'fadeInRight');
    animateCSS(carritoFooterContenedor, 'fadeInRight');
});

// Promise de animaciones animate.css
const animateCSS = (element, animation, duration,prefix = 'animate__') =>
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;

    element.classList.add(`${prefix}animated`, animationName);

    function handleAnimationEnd(event) {
      event.stopPropagation();
      element.classList.remove(`${prefix}animated`, animationName);
    }

    element.addEventListener('animationend', handleAnimationEnd, {once: true});
});



// Boton para vaciar todo el carrito.
carritoVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito(){

    // Si cumple la condicion de tener mas de 1 producto, te preguntara si estas seguro de eliminar todos los productos sino simplemente se borrará rapido.
    if(productosEnCarrito.length > 1){
        Swal.fire({
            title: 'Borrar carrito',
            width: '450',
            background: '#f5f5f5',
            html: '<p class="texto-alerta">¿Estás seguro que deseas borrar todos los productos de tu carrito?</p>',
            showCancelButton: true,
            confirmButtonColor: '#392ebb',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            customClass:{
                title:'titulo-alerta',
            }
          }).then((result) => {
            if (result.isConfirmed) {
                productosEnCarrito.length = 0;
                localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
                cargarProductosCarrito(productosEnCarrito);
            }
          })
    } else {
        productosEnCarrito.length = 0;
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        cargarProductosCarrito(productosEnCarrito);
    }
}

// Boton finalizar compra
carritoFinalizar.addEventListener("click", ()=>{
    animateCSS(modals[0], 'zoomIn');
    modal1.show();

    finalizarCompra(productosEnCarrito);
});
function finalizarCompra(array){

    // Cerrar el offcanvas del carrito
    let myOffCanvas = document.getElementById('offcanvasWithBackdrop');
    let hideCanvas = bootstrap.Offcanvas.getInstance(myOffCanvas);
    hideCanvas.hide();

    // Tablas de los productos pedidos
    tableContainer.innerHTML="";

    array.forEach((productoEnCarrito)=>{

        const table = document.createElement("tr");
        table.classList.add("cart-item");
        table.innerHTML =
        `
            <td class="product-name">
                ${productoEnCarrito.titulo} <strong>× ${productoEnCarrito.cantidad}</strong>
            </td>
            <td class="product-total">
                <strong>$ ${formatoHispano(productoEnCarrito.precio * productoEnCarrito.cantidad)}</strong>
            </td>
        `;

        tableContainer.append(table);
    })
    actualizarTotal(tableTotal);
}

// Validacion form de bootstrap
(function () {
    'use strict'
  
    var forms = document.querySelectorAll('.needs-validation')
  
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault()
            // Condicional si no completas tus datos correctamente, no sucede nada
          if (!form.checkValidity()) {
            event.stopPropagation()
          }else{
            // Si cumple las validaciones se abre el modal de compra realizada
            modal1.hide();
            animateCSS(modals[1], 'zoomIn');
            modal2.show();

            event.stopPropagation()
          }
          form.classList.add('was-validated')
        }, false)
      })
})()

// Metodo de pago en compra finalizada
let cardNumberInput = document.getElementById("numero-tarjeta");
let cardNumber = document.getElementById("card-number");

let cardHolderInput = document.getElementById("titular-tarjeta");
let cardHolder = document.getElementById("card-holder-name");

let cardMonInput = document.getElementById("month-tarjeta");
let cardMon = document.getElementById("card-month");

let cardYearInput = document.getElementById("year-tarjeta");
let cardYear = document.getElementById("card-year");

let cardCvcInput = document.getElementById("cvc-tarjeta");
let cardCvc = document.getElementById("card-cvc");

// Lo que ponga en el input se pondra en la tarjeta
cardNumberInput.oninput = () =>{
    cardNumber.innerText = cardNumberInput.value;
}
cardHolderInput.oninput = () =>{
    cardHolder.innerText = cardHolderInput.value;
}
cardMonInput.oninput = () =>{
    cardMon.innerText = cardMonInput.value;
}
cardYearInput.oninput = () =>{
    cardYear.innerText = cardYearInput.value;
}
cardCvcInput.oninput = () =>{
    cardCvc.innerText = cardCvcInput.value;
}

// Ultimo modal de compra exitosa
compraExitosa.addEventListener("click", ()=>{

    actualizarTotal(exitoTotal);

    modal2.hide();
    animateCSS(modals[2], 'zoomIn');
    modal3.show();
});

// Contador del total - con parametro para rehusarlo
function actualizarTotal(total){

    const totalCalculado = productosEnCarrito.reduce((acc, producto)=> acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$ ${formatoHispano(totalCalculado)}`;
}

