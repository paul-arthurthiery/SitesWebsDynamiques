/* global getProducts $ localStorage */

const createShoppingCart = async () => {
  const products = await getProducts();
  const idarray = [];
  const panier = JSON.parse(localStorage.getItem('panier'));
  if (!panier || panier.length === 0) {
    $('article').append('<p>Aucun produit dans votre panier</p>');
    return false;
  }
  $('article').append(`
      <table class="table shopping-cart-table">
        <thead>
        <tr>
            <th></th>
            <th>Produit</th>
            <th>Prix unitaire</th>
            <th>Quantité</th>
            <th>Prix</th>
        </tr>
        </thead>
        <tbody id="table-body">

        </tbody>
    </table>
    <p class="shopping-cart-total" id="prixtotal"></p>
    <a class="btn pull-right" href="./order.html">Commander <i class="fa fa-angle-double-right"></i></a>
    <button class="btn"><i class="fa fa-trash-o"></i>&nbsp; Vider le panier</button>`);
  let price = 0;
  panier.forEach((id) => {
    const productOccurence = $.grep(idarray, elem => elem === id).length; // idarray.reduce((acc, curr) => curr===id ? acc+=1:acc, 0)
    if (productOccurence === 0) {
      idarray.push(id);
      const numOccurences = $.grep(panier, elem => elem === id).length;
      products.forEach((product) => {
        if (product.id === parseInt(id, 10)) {
          price += Math.round(numOccurences * parseFloat(product.price) * 100) / 100;
          $('#table-body').append(`
            <tr id="${product.id}">
              <td><button title="Supprimer"><i class="fa fa-times"></i></button></td>
              <td><a href="./product.html?id=${id}" class="name">${product.name}</a></td>
              <td>${product.price}&thinsp;$</td>
              <td>
                <div class="row">
                  <div class="col">
                    <button title="Retirer" onClick="removeProduct(${product.id})"><i class="fa fa-minus"></i></button>
                  </div>
                  <div class="col">${numOccurences}</div>
                  <div class="col">
                    <button title="Ajouter" onClick="addProduct(${product.id})"><i class="fa fa-plus"></i></button>
                  </div>
                </div>
              </td>
              <td>${Math.round(numOccurences * parseFloat(product.price) * 100) / 100}&thinsp;$</td>
            </tr>`);
        }
      });
    }
  });
  const sortedTable = $('#table-body').children().sort((a, b) => {
    const aValue = $('.name', a).text().toUpperCase();
    const bValue = $('.name', b).text().toUpperCase();
    if (aValue < bValue) return -1;
    return aValue > bValue ? 1 : 0;
  });
  $('#table-body').append(sortedTable);
  $('#prixtotal').html(`Total: <strong>${price}$</strong>`);
  return true;
};

createShoppingCart();

const removeProduct = (productId) => {
  const currentAmount = parseInt($(`#${productId} td div:nth-child(2)`).text(), 10);
  const cart = JSON.parse(localStorage.getItem('panier'));
  const productIndex = cart.indexOf(`${productId}`);
  if (productIndex !== -1) {
    cart.splice(productIndex, 1);
    localStorage.setItem('panier', JSON.stringify(cart));
    $(`#${productId} td div:nth-child(2)`).text(currentAmount - 1);
    $('.count').text(parseInt($('.count').text(), 10) - 1);
  }
};

const addProduct = (productId) => {
  const currentAmount = parseInt($(`#${productId} td div:nth-child(2)`).text(), 10);
  const cart = JSON.parse(localStorage.getItem('panier'));
  console.log(cart);
  cart.push(`${productId}`);
  localStorage.setItem('panier', JSON.stringify(cart));
  $(`#${productId} td div:nth-child(2)`).text(currentAmount + 1);
  $('.count').text(parseInt($('.count').text(), 10) + 1);
};
