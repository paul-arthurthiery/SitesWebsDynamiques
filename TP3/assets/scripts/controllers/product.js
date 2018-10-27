let products;

let featureBuilder = (product) => {
    let listli = ''
    product.features.forEach(feature => {
        listli = listli + '<li>' + feature + '</li>'
    });
    return listli;
};


let pageBuilder = (id) => {
    $("main").empty();
    getProducts().then((productsJson) => {

        products = productsJson;
        let i = 0;
        products.forEach(product => {
            if (product.id === parseInt(id)) {
                i = i + 1
                $("main").append(`
        <article>
      <h1>${product.name}</h1>
      <div class="row">
        <div class="col">
          <img id="product-image" alt="${product.name}" src="./assets/img/${product.image}">
        </div>
        <div class="col">
          <section>
            <h2>Description</h2>
            <p>${product.description}</p>
          </section>
          <section>
            <h2>Caractéristiques</h2>
            <ul>
            ${featureBuilder(product)}
            </ul>
          </section>
          <hr>
          <form id="formadd" class="pull-right">
            <label for="product-quantity">Quantité:</label>
            <input class="form-control" data-id="${product.id}" id="product-quantity" type="number" value="1" min="1">
            <button class="btn" title="Ajouter au panier" type="submit">
              <i class="fa fa-cart-plus"></i>&nbsp; Ajouter
            </button>
          </form>
          <p>Prix: <strong>${product.price}&thinsp;$</strong></p>
        </div>
      </div>
    </article>`);
            }
        })
        if (i === 0) {
            $("main").append(' <article> <h1>Page non trouvée !</h1> </article>');
        }
    });
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};



$( "#formadd" ).submit(function( event ) {
    var panier = JSON.parse(localStorage.getItem("panier"));
    var quantity = $('#product-quantity').value();
    for (var i=0; i<quantity;i++ ){
        panier.append($("#product-quantity").data('id'))
    }
    localStorage.setItem("panier",JSON.stringify(panier));
});

$(document).ready(function () {
    var id = getUrlParameter('id');
    pageBuilder(id);
});