// Body, header y el input checkbox del darkmode
const body = document.body;
const Nav = document.getElementsByClassName("nav");
const darkMode = document.getElementById("darkmode");

// List/Grid y contenedor de los productos
const productosContenedor = document.getElementById("products-container");
let viewList = document.getElementById("view-list");
let viewGrid = document.getElementById("view-grid");

darkMode.addEventListener("click", ()=>{
    Nav[0].classList.toggle("nav-dark");
    body.classList.toggle("dark-body");
    body.classList.toggle("light-body");

    // Condicional si body contiene la clase dark-body, se guarda al localstorage
    if(body.classList.contains("dark-body")){
        localStorage.setItem('modoOscuro', 'true');
    } else {
        localStorage.setItem('modoOscuro', 'false');
    }
})





// Condicional para obtener el modo oscuro si esta activo en el localstorage
if(localStorage.getItem('modoOscuro') === 'true'){
    Nav[0].classList.add("nav-dark");
    body.classList.replace("light-body", "dark-body")
    darkMode.checked = true;
} else {
    Nav[0].classList.remove("nav-dark");
    body.classList.replace("dark-body", "light-body")
    darkMode.checked = false;
}

// Vista en Grid que se guarda en localstorage
viewGrid.addEventListener("click", ()=>{
    viewList.classList.remove("view-active");
    viewGrid.classList.add("view-active");
    productosContenedor.classList.replace('products-list', 'products-grid');

    // Condicional para guardar la vista-grid en localstorage
    if(viewGrid.classList.contains("view-active")){
        localStorage.setItem('vista', 'grid');
    } else {
        localStorage.setItem('vista', 'list');
    }
})
// Vista en Lista que se guarda en localstorage
viewList.addEventListener("click", ()=>{
    viewList.classList.add("view-active");
    viewGrid.classList.remove("view-active");
    productosContenedor.classList.replace('products-grid', 'products-list');

    // Condicional para guardar la vista-list en localstorage
    if(viewList.classList.contains("view-active")){
        localStorage.setItem('vista', 'list');
    } else {
        localStorage.setItem('vista', 'grid');
    }
})

// Condicional para obtener la vista guardada del localstorage
if(localStorage.getItem('vista') === 'list'){
    viewList.classList.add("view-active");
    viewGrid.classList.remove("view-active");
    productosContenedor.classList.replace('products-grid', 'products-list');
} else if(localStorage.getItem('vista') === 'grid'){
    viewList.classList.remove("view-active");
    viewGrid.classList.add("view-active");
    productosContenedor.classList.replace('products-list', 'products-grid');
}

// Categorias accordion
const accordionContent = document.querySelectorAll(".accordion-content");
const accordionParent = document.querySelector(".accordion-parent");

accordionContent.forEach((item, index) => {
    let header = item.querySelector(".accordion-header");
    header.addEventListener("click", () =>{
        item.classList.toggle("open");

        let description = item.querySelector(".accordion-desc");
        let accordionArrow = item.querySelector(".accordion-header-icon");
        if(item.classList.contains("open")){
          description.style.height = `${description.scrollHeight}px`;
          accordionArrow.style.transform = "rotate(180deg)";
        }else{
          description.style.height = "0px";
          accordionArrow.style.transform = "rotate(0deg)";
        }
        quitarAccordion(index); 
    })
})

// Quitar accordion luego de seleccionar otro
function quitarAccordion(index1){
  accordionContent.forEach((item2, index2) => {
      if(index1 != index2){
          item2.classList.remove("open");

          let des = item2.querySelector(".accordion-desc");
          let accordionArrow = item2.querySelector(".accordion-header-icon");

          des.style.height = "0px";
          accordionArrow.removeAttribute('style');
      }
  })
}
