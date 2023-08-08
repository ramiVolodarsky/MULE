window.onload = function () {
    var urlParams = new URLSearchParams(window.location.search);
    var query = urlParams.get('q');
    if (query) {
        document.getElementById('searchInput').value = decodeURIComponent(query);
    }
}

document.getElementById('homeLink').addEventListener('click', function () {
    window.location.href = '../home/home.html';
});

// Función para guardar un producto
function saveProduct(index) {
    // Obtén el nombre del proveedor, el nombre y el precio del producto
    let supplierName = document.getElementById(`supplierName${index}`).textContent;
    let productName = document.getElementById(`productName${index}`).textContent;
    let productPrice = document.getElementById(`productPrice${index}`).textContent;

    // Si el nombre del proveedor, el nombre o el precio del producto están vacíos, no lo añadas
    if (!supplierName || !productName || !productPrice) {
        return;
    }

    // Crea un objeto de producto
    let product = {
        supplier: supplierName,
        name: productName,
        price: productPrice
    };

    // Obtén la lista de productos actual de localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];

    // Añade el nuevo producto a la lista
    products.push(product);

    // Guarda la lista de productos actualizada en localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // Mostrar notitificacion
    var myModal = new bootstrap.Modal(document.getElementById('productAddedModal'), {});
    myModal.show();
}

document.addEventListener('DOMContentLoaded', function() {
  // Este código se ejecutará después de que el DOM esté completamente cargado

  document.querySelector('.btn-search').addEventListener('click', function(event) {

      event.preventDefault(); // Evita que la página se recargue al enviar el formulario
      var searchQuery = document.querySelector('#searchInput').value; // Cambiado el ID aquí

      // Comprueba si searchQuery está vacío o sólo contiene espacios en blanco
      if (searchQuery.trim() === '') {
          // Si el input está vacío, añade la clase 'error' al input
          document.querySelector('#searchInput').classList.add('error'); // Cambiado el ID aquí

          // Elimina la clase 'error' después de 2 segundos
          setTimeout(function() {
              document.querySelector('#searchInput').classList.remove('error'); // Cambiado el ID aquí
          }, 2000);
      } else {
          // Hacer la solicitud a la API
          fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${searchQuery}&category=MLA1500&limit=8`)
              .then(response => {
                  if (response.ok) {
                      return response.json();
                  } else {
                      throw new Error(`Error en la solicitud: ${response.status}. Respuesta: ${response.statusText}`);
                  }
              })
              .then(data => {
                  console.log('Datos de la API recibidos:', data);
                  // Almacenar los datos
                  localStorage.setItem('searchResults', JSON.stringify(data));
                  storeData(data);

                  // Redirige a la página de búsqueda
                  window.location.href = '../search/index.html?q=' + encodeURIComponent(searchQuery);
              })
              .catch(error => {
                  console.error('Error:', error);
                  console.log('Error detallado:', JSON.stringify(error, null, 2));
              });
      }
  });
});

function storeData(data) {
  if (data.results.length > 0) {
      // Almacenar los datos en localStorage
      localStorage.setItem('searchResults', JSON.stringify(data.results));
  } else {
      console.log('No se encontraron resultados.');
      localStorage.removeItem('searchResults');  // Elimina los resultados de búsqueda antiguos si no hay nuevos resultados
  }
}


document.addEventListener('DOMContentLoaded', function () {
    // Comprueba si hay resultados de búsqueda almacenados
    if (localStorage.getItem('searchResults')) {
        // Recupera los datos de localStorage y los convierte a JSON
        var searchResults = JSON.parse(localStorage.getItem('searchResults'));

        var resultsContainer = document.querySelector('.container.mt-5 .row.justify-content-center');

        // Limpia el contenedor de resultados (para evitar duplicados al recargar la página)
        resultsContainer.innerHTML = '';

        // Por cada resultado, crea una estructura de tarjeta y la añade al contenedor
        searchResults.forEach((item) => {
            var cardDiv = document.createElement('div');
            cardDiv.classList.add('col-md-12');

            var cardHTML = `
            <div class="custom-card">
            <img src="${item.thumbnail}" class="product-image" alt="Imagen de ${item.title}">
            <div class="product-details">
               <h5>${item.title}</h5>
               <p>${item.seller.nickname}</p>
            </div>
            <div class="buttons-container">
            <svg class="detailsButton btn-svg" data-product-id=${item.id} xmlns="http://www.w3.org/2000/svg" width="213" height="52" viewBox="0 0 213 52" fill="none">
                  <rect y="0.594727" width="213" height="50.9424" rx="24.8433" fill="#00A3FF" fill-opacity="0.13"/>
                  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#1794FA" font-family="Roboto" font-size="19.047" font-weight="600">Ver detalle</text>
               </svg>
               <svg id="proveedoresButton" class="btn-svg" xmlns="http://www.w3.org/2000/svg" width="213" height="52" viewBox="0 0 213 52" fill="none">
                  <rect y="0.672852" width="213" height="50.9424" rx="24.8433" fill="#13C670" fill-opacity="0.13"/>
                  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#13C670" font-family="Roboto" font-size="19.047" font-weight="600">Ver proveedores</text>
               </svg>
            </div>
         </div>`;



            cardDiv.innerHTML = cardHTML;
            resultsContainer.appendChild(cardDiv);
        });
    } else {
        console.log('No hay resultados de búsqueda almacenados.');
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const detailsButtons = document.querySelectorAll(".detailsButton");
    if (detailsButtons.length > 0) {
      detailsButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          const productId = button.getAttribute("data-product-id");
          const apiUrl = `https://api.mercadolibre.com/items/${productId}`;
  
          fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
              // Obtengo el titulo y lo agrego al html
              const title = data.title;
              document.getElementById('DetallesModalLabel').textContent = title;
            
              const pictures = data.pictures;

              const carouselIndicators = document.querySelector("#carouselExampleIndicators .carousel-indicators");
              const carouselInner = document.querySelector("#carouselExampleIndicators .carousel-inner");
  
              // Vaciar el contenido del carrusel
              carouselIndicators.innerHTML = "";
              carouselInner.innerHTML = "";
  
              // Agregar los nuevos indicadores e imágenes
              pictures.forEach((picture, index) => {
                const indicator = document.createElement("li");
                indicator.setAttribute("data-target", "#carouselExampleIndicators");
                indicator.setAttribute("data-slide-to", index.toString());
                if (index === 0) indicator.classList.add("active");
                carouselIndicators.appendChild(indicator);
  
                const carouselItem = document.createElement("div");
                carouselItem.classList.add("carousel-item");
                if (index === 0) carouselItem.classList.add("active");
  
                const img = document.createElement("img");
                img.src = picture.url;
                img.alt = "...";
                img.classList.add("d-block", "w-100");
  
                carouselItem.appendChild(img);
                carouselInner.appendChild(carouselItem);
              });
  
              // Mostrar el modal
              $("#detallesModal").modal("show");
            })
            .catch((error) => {
              console.error("Hubo un error al obtener las imágenes:", error);
            });
        });
      });
    } else {
      console.error("No se encontraron botones de detalles. ¿Está la clase correcta?");
    }
  });
  



document.addEventListener("DOMContentLoaded", function() {
    const proveedoresButton = document.getElementById('proveedoresButton');
    if (proveedoresButton) {
        proveedoresButton.addEventListener('click', function() {
            $('#proveedoresModal').modal('show');
        });
    } else {
        console.error('No se encontró el botón de detalles. ¿Está el ID correcto?');
    }
});