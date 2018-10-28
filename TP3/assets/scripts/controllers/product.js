/* global getProducts $ window localStorage document */
let products;

const featureBuilder = (product) => {
  let listli = '';
  product.features.forEach((feature) => {
    listli = `${listli}<li>${feature}</li>`;
  });
  return listli;
};


const pageBuilder = async (id) => {
  $('main').empty();
  await getProducts().then((productsJson) => {
    products = productsJson;
    let i = 0;
    products.forEach((product) => {
      if (product.id === parseInt(id, 10)) {
        i += 1;
        $('main').append(`
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
          <form id="formadd" class="pull-right" action="">
            <label for="product-quantity">Quantité:</label>
            <input class="form-control" data-id="${product.id}" id="product-quantity" type="number" value="1" min="1">
            <button id="submitproduct" class="btn" title="Ajouter au panier" type="submit">
              <i class="fa fa-cart-plus"></i>&nbsp; Ajouter
            </button>
          </form>
          <p>Prix: <strong>${product.price}&thinsp;$</strong></p>
        </div>
      </div>
    </article>`);
            }
        });
        if (i === 0) {
            $('main').append(' <article> <h1>Page non trouvée !</h1> </article>');
        }
    });
    $('#formadd').submit((e) => {
        e.preventDefault()
        panier = JSON.parse(localStorage.getItem('panier'));
        const quantity = parseInt($('#product-quantity').val());
        let id = $('#product-quantity').data('id');
        if (!panier || panier.length === 0) {
            panier = [];
            for (let i = 0; i < quantity; i += 1) {
                console.log(id)
                panier.push(id);
            }
            console.log(panier)
            localStorage.setItem('panier', JSON.stringify(panier));
        } else {
            for (let i = 0; i < quantity; i += 1) {
                panier.push(id);
            }
            localStorage.setItem('panier', JSON.stringify(panier));
        }
        console.log('submitted');
        $('main').append(`<span>Added ${$('h1').text()} to cart</span>`);
        panier = JSON.parse(localStorage.getItem('panier'));
        $("span.count").css("display", "block");
        $("span.count").text(panier.length);
        e.preventDefault();
    });
};

const getUrlParameter = (sParam) => {
  const sPageURL = decodeURIComponent(window.location.search.substring(1));
  const sURLVariables = sPageURL.split('&');
  let sParameterName;

  for (let i = 0; i < sURLVariables.length; i += 1) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
  return true;
};



$(document).ready(() => {
  const id = getUrlParameter('id');
  pageBuilder(id);
});
