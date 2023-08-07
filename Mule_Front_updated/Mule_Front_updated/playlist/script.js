// Para redireccionar a home
document.getElementById('homeLink').addEventListener('click', function () {
    window.location.href = '../home/home.html';
});

// Para obtener todos los productos
// Obtén la referencia al contenedor donde se mostrarán los productos
var productListContainer = document.getElementById('productList');

// Recupera la lista de productos del almacenamiento local
var storedProducts = localStorage.getItem('products');

// Los productos se almacenan como una cadena de texto en formato JSON,
// necesitamos convertirlos de nuevo a un array de objetos de JavaScript
var products = JSON.parse(storedProducts) || [];

var total = 0; // Variable para almacenar el total

// Crea una función para calcular el total
function calculateTotal() {
    total = 0; // Reinicia el total
    // Suma el precio de cada producto al total
    products.forEach(product => {
        total += Number(product.price.replace('$', ''));
    });
    // Actualiza el total en la página
    document.getElementById('totalPrice').textContent = 'Total: $' + total.toFixed(2);
}

function createProductCard(product, index) {
    var productCard = document.createElement('div');
    productCard.className = 'card';

    var productImage = document.createElement('img');
    productImage.className = 'card-img-top';
    productImage.src = 'Ferrocons.jpg'; 
    productCard.appendChild(productImage);

    var productBody = document.createElement('div');
    productBody.className = 'card-body';
    productCard.appendChild(productBody);

    var supplierName = document.createElement('h4');
    supplierName.className = 'card-supplier';
    supplierName.textContent = product.supplier;
    productBody.appendChild(supplierName);

    var productTitle = document.createElement('h5');
    productTitle.className = 'card-title';
    productTitle.textContent = product.name;
    productBody.appendChild(productTitle);

    var productPrice = document.createElement('h4');
    productPrice.className = 'card-text';
    productPrice.textContent = product.price;
    productBody.appendChild(productPrice);

    var deleteButton = document.createElement('button');
    deleteButton.className = 'btn-round-delete';  // Cambia la clase aquí
    deleteButton.textContent = 'Eliminar';
    deleteButton.onclick = function () { deleteProduct(index); };
    productBody.appendChild(deleteButton);    

    productListContainer.appendChild(productCard);
}

function deleteProduct(index) {
    // Remueve el producto del array de productos
    products.splice(index, 1);

    // Actualiza la lista de productos en localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // Limpia el contenedor de productos
    productListContainer.innerHTML = '';

    // Recorre el array de productos y crea los elementos HTML necesarios para mostrar cada producto
    products.forEach(createProductCard);

    // Recalcula y muestra el total
    calculateTotal();
}

// Inicia el código
products.forEach(createProductCard);
calculateTotal(); // Calcula y muestra el total al cargar la página


