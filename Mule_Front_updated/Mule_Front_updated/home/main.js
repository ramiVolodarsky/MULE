document.addEventListener('DOMContentLoaded', function() {
    // Este código se ejecutará después de que el DOM esté completamente cargado

    document.querySelector('.btn-search').addEventListener('click', function(event) {

        event.preventDefault(); // Evita que la página se recargue al enviar el formulario
        var searchQuery = document.querySelector('#search-input').value;

        // Comprueba si searchQuery está vacío o sólo contiene espacios en blanco
        if (searchQuery.trim() === '') {
            // Si el input está vacío, añade la clase 'error' al input
            document.querySelector('#search-input').classList.add('error');

            // Elimina la clase 'error' después de 2 segundos
            setTimeout(function() {
                document.querySelector('#search-input').classList.remove('error');
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
                    console.log('Datos de la API recibidos:', data); // Añadido para verificar los datos recibidos de la API
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


