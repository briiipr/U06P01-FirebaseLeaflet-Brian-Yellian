import { centrosCulturales } from "../data/educacionycultura.js";

window.devuelveCentros = centrosCulturales;

// Contiene (más adelante) los markers ya añadidos al mapa para poder eliminarlos.
var arrayMarkers = new Array();
var mymap;
var mostrado = false;

// Array simple para manejar las combinaciones de los 2 filtros empleados.
var filtros = [false, false];

var filtroTelefono = document.getElementById('filtroTelefono');
var filtroCodigoPostal = document.getElementById('filtroCodigoPostal');
var btnCodigoPostal = document.getElementById('btnCodigoPostal');

// Array que se actualiza con el array original filtrado.
var centrosFiltrados = [];

// Cuando se inicia sesión, al igual que el Navbar, también se muestra u oculta un div u otro según esté dentro o no, el usuario.
auth.onAuthStateChanged((user) => {
    let divMapa = document.getElementById('divMapa');
    let divInicio = document.getElementById('inicio');

    if (user) {
        divInicio.style.display = 'none';
        divMapa.style.height = '500px';
        divMapa.parentElement.style.display = 'block';
        pintaMapa();
        rellenaDataList();
        mostrado = true;
        agregaBorraEventos();
        gestionaFiltros();
    } else {
        filtroTelefono.checked = false;
        filtroCodigoPostal.value = '';
        divMapa.style.height = '0px';
        divMapa.parentElement.style.display = 'none';
        divInicio.style.display = 'block';
        mostrado = false;
    }
})

function rellenaDataList() {
    let listaUnica = new Array();
    let dataList = document.getElementById('opcionesCodigoPostal');
    let inputFiltro = document.getElementById('filtroCodigoPostal');
    inputFiltro.style.width = 'initial'
    centrosCulturales.forEach(x => {
        if (listaUnica.indexOf(x.properties.mun) === -1)
            listaUnica.push(x.properties.mun)
    });
    listaUnica.sort().forEach(x => {
        let option = document.createElement('option');
        option.value = x;
        dataList.appendChild(option);
    });
}

function agregaBorraEventos() {
    if (mostrado === true) {
        filtroTelefono.addEventListener('change', filtroTFN);
        btnCodigoPostal.addEventListener('click', filtroCP);
    } else {
        filtroTelefono.removeEventListener('change', filtroTFN);
        btnCodigoPostal.removeEventListener('click', filtroCP);
    }
}

function filtroTFN() {
    if (filtroTelefono.checked === true) {
        filtros[0] = true;
    } else {
        filtros[0] = false;
    }
    gestionaFiltros()
}

function filtroCP() {
    if (filtroCodigoPostal.value.length > 0) {
        filtros[1] = true;
    } else {
        filtros[1] = false;
    }
    gestionaFiltros();
}

/**
 * Gracias al array previamente dicho, se gestionan las combinaciones posibles con los filtros.
 */
function gestionaFiltros() {
    switch (true) {
        case (filtros[0] === true && filtros[1] === false): // Solo se marca el Checkbox
            centrosFiltrados = centrosCulturales.filter(function (x) {
                if (x.properties.tf)
                    return true;
                else
                    return false;
            })
            agregaCentros();
            agregaCentros();
            break;
        case (filtros[0] === false && filtros[1] === true): // Solo se introduce un código postal
            centrosFiltrados = [];
            centrosFiltrados = centrosCulturales.filter(function (x) {
                if (x.properties.mun.toString().indexOf(filtroCodigoPostal.value) != -1) {
                    return true;
                } else {
                    return false;
                }
            });
            agregaCentros();
            agregaCentros();
            break;
        case (filtros[0] === true && filtros[1] === true): // Se utilizan ambos
            centrosFiltrados = centrosCulturales.filter(function (x) {
                if (x.properties.tf && x.properties.mun.toString().indexOf(filtroCodigoPostal.value) != -1) {
                    return true;
                } else {
                    return false;
                }
            })
            agregaCentros();
            agregaCentros();
            break;
        case (filtros[0] === false && filtros[1] === false): // No se utiliza ninguno
            centrosFiltrados = [];
            agregaCentros();
            break;
    }
}

/**
 * Crea el mapa, y si ya hay uno creado, lo borra para volverlo a crear.
 * Contiene dos tipos de vista y el botón para pantalla completa.
 */
function pintaMapa() {
    var normal = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
            attribution:
                'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 80,
            minZoom: 10,
            id: "mapbox/streets-v11",
            accessToken:
                "pk.eyJ1IjoiYnJpYW5wZXJlenIiLCJhIjoiY2s1YTdxMnltMTRxMTNtcGdyYzRodXEwMSJ9.Z0_dAqd29S5HLEp_OlYhSQ"
        });
    var satelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 80,
            minZoom: 10
        }
    );

    if (mymap) {
        mymap.remove();
    }

    var bases = {
        "Satélite": satelite,
        "Normal": normal
    };

    mymap = L.map("divMapa", {
        layers: [satelite, normal]
    }).setView([28.2757924, -16.531399], 10);
    L.control.layers(bases).addTo(mymap);
    mymap.addControl(new L.Control.Fullscreen()); // Agrega el botón para poner el mapa a pantalla completa.
}

/**
 * Si se ha escogido un filtro, se pasa el array filtrado a la función. Si no, se pasa el original.
 */
function agregaCentros() {
    if (centrosFiltrados.length > 0) {
        agregaMarcadores(centrosFiltrados);
    } else {
        agregaMarcadores(centrosCulturales);
    }
}

/**
 * Recibe un array con el que crea los marcadores y los agrega al mapa, borrando previamente posibles marcadores que ya existan.
 * @param {Array} arrayCentros 
 */
function agregaMarcadores(arrayCentros) {
    let greyIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    let marker;
    borraMarcadores();
    arrayCentros.forEach(x => {
        marker = L.marker(x.geometry.coordinates.reverse(), {icon: greyIcon}); //<label></label><br/>
        marker.bindPopup(`<b>${x.properties.nombre}</b><br/><label>Ubicación: ${x.properties.dir}</label><br/>${x.properties.tf ? `<label>Teléfono: ${x.properties.tf}</label><br/>` : ''}${x.properties.email ? `<label>Email: ${x.properties.email}</label><br/>` : ''}${x.properties.web ? `<a target="_blank" href="https://${x.properties.web}">${x.properties.web}</a><br/>` : ''}`).openPopup();
        arrayMarkers.push(marker);
        mymap.addLayer(marker);
    });
}

/**
 * Primero se borran del mapa los markers, y luego del array que los contiene para no dejar restos o posibles errores.
 */
function borraMarcadores() {
    arrayMarkers.forEach(x => {
        mymap.removeLayer(x);
    })
    while (arrayMarkers.length > 0)
        arrayMarkers.pop();
}


