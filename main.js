// import Observer para el scroll infinito
import { getObserver} from "./src/observer.js";
/* Api Selector */
const apiKey = "AA3Jc3C9Xq8gwztK267AlWWGcYRhPJsd";
const API = "https://api.giphy.com/v1/gifs";

/* HTML referencias */

const button = document.getElementById("button_gif");
const input = document.getElementById("input");
const contImg = document.getElementById("gifPlace");
const trendImg = document.getElementById("trend_img");
const listaB = document.getElementById("listaB")

let firstSearch = false;
let offset = 0;


const mostrarImg = (element) =>{
    const img = document.createElement("img");
    img.src = element.images.original.url;
    img.alt = element.title;

    return img;
};

/* Obtenemos los elementos de la api para el trend*/
const getData = async () => {

    const res = await fetch(`${API}/trending?api_key=${apiKey}&limit=10&offset=${offset}`);
    const {data} = await res.json();
    offset += 10;
    return data;
   
};

/* obtenemos elementos para la busqueda*/ 
const fetchForSearch = async (search) => {
    const res = await fetch(`${API}search?apiKey=${apiKey}&limit=10[offset]&q=${search}`);
    const {data} = await res.json();
    offset += 10;
    return data;
};

/*carga la busqueda*/ 
const cargaImput = async () => {
    firstSearch = true;
    const inputSearch = input.value
    if(inputSearch != ""){
        borrarContImg(inputSearch);
        const data = await fetchForSearch(inputSearch);
        if(data.length == 0){
            alert("No hay resultados para tu búsqueda");
            gifPlace.innerHTML = "(No hubo resultados)"
        };
        const templates = data.map(img => mostrarImg(img));
        gifPlace.append(...templates);
        guardarBusqueda(inputSearch);
        verUltimaBusqueda();
    }
};


/*verifica búsqueda */
const busquedaOK = (listado, input) => {
    for (let lista of listado){
        if (lista == input){
            return true;
        }
    }
    return false;
};

/* atrapa ultima busqueda */
const verUltimaBusqueda = (input) => {
    if(localStorage.getItem('verUltimaBusqueda') != input){
        offset = 0;
    }
    localStorage.setItem('verUltimaBusqueda', input);
};

/* guarda busqueda */
const guardarBusqueda = (input) => {
    let listado = [];
    if (localStorage.getItem("busquedas")){
        listado = JSON.parse(localStorage.getItem("busquedas"));
    }
    if (!busquedaOK(listado, input)){
        listado.push(input);
    };
    if(listado.length > 3){
        listado.shift();
    }
    verUltimaBusqueda(input);
    localStorage.setItem("busquedas",JSON.stringify(listado));
    };

/* UL  listado */
    const burcarM = () =>{
        let listado = [];
        if(localStorage.getItem("busquedas")){
            listado = JSON.parse(localStorage.getItem("busquedas"));
        }
        let html = "";
        for (let lista of listado){
            html += "<li>" + lista + "</li>";
        }
        listaB.innerHTML = html;
        buscarB();
    };

/* boton buscar */
    const buscarB = () =>{
        const busquedas = document.querySelectorAll("li");
        busquedas.forEach(function (elemento) {
          elemento.addEventListener("click", function () {
           
            const eliminar = confirm("eliminar" + elemento.innerText);
            if (eliminar) {
                input.value = elemento.innerText
                button.click()
            }
          });
        });
    };
    
/* reemplaza ultima busqueda */
    const borrarContImg = (input) => {
        const img = document.createElement("imp");
        if(localStorage.getItem('verUltimaBusqueda')){
            if(localStorage.getItem('verUltimaBusqueda') != input) {
                gifPlace.innerHTML = "";
            };
        }else{
            gifPlace.innerHTML = "";
        };
    };
    
    /*Funcion para mis trendings */
export const funcionPrincipal = async () => {
    const data = await getData();

    const lastImg = data.pop();
    const imgLastTemplate = mostrarImg(lastImg);
    getObserver(imgLastTemplate);
    const templates = data.map((img) => mostrarImg(img));
    trendImg.append(...templates);
    trendImg.append(imgLastTemplate);
};    


window.addEventListener("load", funcionPrincipal);
button.addEventListener("click", cargaImput);


