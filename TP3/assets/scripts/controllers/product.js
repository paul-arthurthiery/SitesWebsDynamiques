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
    e.preventDefault();
    let panier = JSON.parse(localStorage.getItem('panier'));
    const quantity = parseInt($('#product-quantity').val(), 10);
    if (!panier || panier.length === 0) {
      panier = [];
    }
    for (let i = 0; i < quantity; i += 1) {
      panier.push(id);
    }
    localStorage.setItem('panier', JSON.stringify(panier));
    $('span.count').text(panier.length);
    $(`<span id="dialog">Added ${$('h1').text()} to cart</span>`).insertAfter('article');
    setTimeout(() => $('#dialog').remove(), 5000);
  });
};

const getId = () => {
  const sPageURL = decodeURIComponent(window.location.search.substring(1));
  return sPageURL.match('(?<=id=)[0-9]*')[0];
};


$(document).ready(() => {
  const id = getId();
  pageBuilder(id);
});
