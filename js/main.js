// URLs para obtener la lista de razas y las imágenes de gatos
let urlrazas = 'https://api.thecatapi.com/v1/breeds';
let urlimgaleatorias = 'https://api.thecatapi.com/v1/images/search?limit=10';
let urlimgraza = 'https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=';

document.addEventListener('DOMContentLoaded', function() {
    let inputbusqueda = document.getElementById('searchInput');
    let botonbusqueda = document.getElementById('searchButton');
    let filtros = document.getElementById('filters');
    let listagatos = document.getElementById('catList');

    let datosderaza = [];

    //para obtener las razas de gatos
    function obtenerRazasGatos() {
        fetch(urlrazas)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                datosderaza = data;
                llenarFiltros(datosderaza);
            })
            .catch(function(error) {
                console.error('Error al obtener las razas:', error);
            });
    }

    //obtener imágenes aleatorias de gatos
    function obtenerImagenesAleatoriasGatos() {
        fetch(urlimgaleatorias)
            .then(function(response) {
                return response.json();
            })
            .then(function(imagesData) {
                mostrarImagenes(imagesData);
            })
            .catch(function(error) {
                console.error('Error al obtener imágenes de gatos:', error);
            });
    }

    function obtenerImagenesGatosPorRaza(razaid) {
        return fetch(`${urlimgraza}${razaid}`)
            .then(function(response) {
                return response.json();
            })
            .catch(function(error) {
                console.error('Error al obtener imágenes por raza:', error);
                return [];
            });
    }

    //mostrar imágenes en la página
    function mostrarImagenes(imagesData) {
        listagatos.innerHTML = '';
        imagesData.forEach(function(image) {
            let imgelemento = document.createElement('div');
            imgelemento.className = 'cat-item';
            imgelemento.innerHTML = `<img src="${image.url}" alt="Imagen de un gato">`;
            listagatos.appendChild(imgelemento);
        });
    }

    //llenar los filtros de origen
    function llenarFiltros(razas) {
        let origenesUnicos = [];
    
        //origenes de las razas
        razas.forEach(function(raza) {
            let origen = raza.origin;
            if (!origenesUnicos.includes(origen)) {
                origenesUnicos.push(origen);
            }
        });
    
        //contenido del filtro
        let contenidoFiltro = '<h2>Filtrar por Origen</h2>';
        contenidoFiltro += '<select id="filtroOrigen">';
        contenidoFiltro += '<option value="">Todos</option>'; // Opción para mostrar todas las razas
    
        // menú desplegable
        origenesUnicos.forEach(function(origen) {
            contenidoFiltro += `<option value="${origen}">${origen}</option>`;
        });
    
        contenidoFiltro += '</select>';
    
        // Insertar
        filtros.innerHTML = contenidoFiltro;
    
        // Añadir un evento para filtrar las razas por origen seleccionado
        document.getElementById('filtroOrigen').addEventListener('change', function(evento) {
            filtrarRazasPorOrigen(evento.target.value);
        });
    }
    

    // Función para filtrar razas por origen
    function filtrarRazasPorOrigen(origen) {
        const razasFiltradas = datosderaza.filter(function(raza) {
            //mastrar razas si esq esta vacio
            if (origen === "") {
                return true;
            }
            // mostrar solo esa raza
            if (raza.origin === origen) {
                return true;
            }
            //no mostrar raza
            return false;
        });
    
        // Mostrar las razas filtradas si hay resultados
        if (razasFiltradas.length > 0) {
            mostrarRazas(razasFiltradas);
        } else {
            // si no hay razas que aparazcan las imgs
            obtenerImagenesAleatoriasGatos();
        }
    }
    

    //mostrar las razas en la página
    function mostrarRazas(razas) {
        listagatos.innerHTML = '';
        razas.forEach(function(raza) {
            let razaelement = document.createElement('div');
            razaelement.className = 'cat-item';
            razaelement.innerHTML = `
                <h3>${raza.name}</h3>
                <p>${raza.description}</p>
            `;
            razaelement.addEventListener('click', function() {
                obtenerImagenesGatosPorRaza(raza.id).then(function(imagesData) {
                    if (imagesData.length > 0) {
                        mostrarImagenes(imagesData);
                    } else {
                        obtenerImagenesAleatoriasGatos();
                    }
                });
            });
            listagatos.appendChild(razaelement);
        });
    }

    //buscar gatos por nombre de raza
    botonbusqueda.addEventListener('click', function() {
        let busqueda = inputbusqueda.value.toLowerCase();
        let razaseleccionada = datosderaza.find(function(raza) {
            return raza.name.toLowerCase() === busqueda;
        });

        if (razaseleccionada) {
            obtenerImagenesGatosPorRaza(razaseleccionada.id).then(function(imagesData) {
                if (imagesData.length > 0) {
                    mostrarImagenes(imagesData);
                } else {
                    obtenerImagenesAleatoriasGatos();
                }
            });
        } else {
            listagatos.innerHTML = '<p>No se encontró ninguna raza con ese nombre.</p>';
            obtenerImagenesAleatoriasGatos();
        }
    });

    // Cargar imágenes en el inicio
    obtenerImagenesAleatoriasGatos();
    // Obtener la lista de razas
    obtenerRazasGatos();
});