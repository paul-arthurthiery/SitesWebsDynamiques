/* global getProducts $ localStorage window */

let products;

const createShoppingCart = async () => {
  products = await getProducts();
  const idarray = [];
  const panier = JSON.parse(localStorage.getItem('panier'));
  if (!panier || panier.length === 0) {
    $('article').append('<p>Aucun produit dans le panier.</p>');
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
    <p class="shopping-cart-total" id="total-amount"></p>
    <a class="btn pull-right" href="./order.html">Commander <i class="fa fa-angle-double-right"></i></a>
    <button class="btn" onClick="emptyCart()" id="remove-all-items-button"><i class="fa fa-trash-o"></i>&nbsp; Vider le panier</button>`);
  let price = 0;
  panier.forEach((id) => {
    const productOccurence = $.grep(idarray, elem => elem === id).length; // idarray.reduce((acc, curr) => curr===id ? acc+=1:acc, 0)
    if (productOccurence === 0) {
      idarray.push(id);
      const numOccurences = $.grep(panier, elem => elem === id).length;
      products.forEach((product) => {
        if (product.id === parseInt(id, 10)) {
          price += Math.round(numOccurences * parseFloat(product.price) * 100) / 100;
          const cleanedPrice = product.price.toString().replace('.', ',');
          const cleanedPriceTotal = (Math.round(numOccurences * parseFloat(product.price) * 100) / 100).toString().replace('.', ',');
          $('#table-body').append(`
            <tr id="${product.id}">
              <td><button title="Supprimer" onClick="deleteProduct(${product.id})" class="remove-item-button"><i class="fa fa-times"></i></button></td>
              <td><a href="./product.html?id=${id}" class="name">${product.name}</a></td>
              <td class="price">${cleanedPrice}$</td>
              <td>
                <div class="row">
                  <div class="col">
                    <button title="Retirer" onClick="removeProduct(${product.id})" class="remove-quantity-button" ${numOccurences === 1 ? 'disabled' : ''}><i class="fa fa-minus"></i></button>
                  </div>
                  <div class="col" id="quantity" class="quantity">${numOccurences}</div>
                  <div class="col">
                    <button title="Ajouter" onClick="addProduct(${product.id})" class="add-quantity-button"><i class="fa fa-plus"></i></button>
                  </div>
                </div>
              </td>
              <td class="price">${cleanedPriceTotal}$</td>
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
  $('#total-amount').html(`Total: <strong>${Math.round(price * 100) / 100}$</strong>`);
  return true;
};

createShoppingCart();

const refreshPrice = (product, amountOfProduct, previousAmount) => {
  if ($(`#${product.id}`)) {
    $(`#${product.id} td:nth-child(5)`).html(`${Math.round(amountOfProduct * parseFloat(product.price) * 100) / 100}&thinsp;$`);
  }
  $('.shopping-cart-total').html(`Total: <strong>${Math.round((parseFloat($('.shopping-cart-total strong').text()) + (amountOfProduct - previousAmount) * product.price) * 100) / 100}$</strong>`);
};

const removeProduct = (productId) => {
  const currentAmount = parseInt($(`#${productId} td div:nth-child(2)`).text(), 10);
  const cart = JSON.parse(localStorage.getItem('panier'));
  const productIndex = cart.indexOf(`${productId}`);
  if (productIndex !== -1) {
    cart.splice(productIndex, 1);
    localStorage.setItem('panier', JSON.stringify(cart));
    $(`#${productId} td div:nth-child(2)`).text(currentAmount - 1);
    if (currentAmount - 1 === 1) $(`#${productId} button:eq(1)`).attr('disabled', true);
    $('.count').text(cart.length);
    if (cart.length === 0) $('.count').css('display', 'none');
    if ($('.count').text() === 0) $('.count').css('display', 'none');
  }
  const productToRemove = products.filter(product => product.id === productId)[0];
  refreshPrice(productToRemove, currentAmount - 1, currentAmount);
};

const addProduct = (productId) => {
  const currentAmount = parseInt($(`#${productId} td div:nth-child(2)`).text(), 10);
  const cart = JSON.parse(localStorage.getItem('panier'));
  cart.push(`${productId}`);
  localStorage.setItem('panier', JSON.stringify(cart));
  $(`#${productId} td div:nth-child(2)`).text(currentAmount + 1);
  if (currentAmount + 1 > 1) $(`#${productId} button:eq(1)`).removeAttr('disabled');
  $('.count').text(parseInt($('.count').text(), 10) + 1);
  const productToAdd = products.filter(product => product.id === productId)[0];
  refreshPrice(productToAdd, currentAmount + 1, currentAmount);
};

const deleteProduct = (productId) => {
  const confirmed = window.confirm('Voulez-vous supprimer ce produit du panier ?');
  if (!confirmed) return false;
  const currentAmount = parseInt($(`#${productId} td div:nth-child(1)`).text(), 10);
  const cart = JSON.parse(localStorage.getItem('panier'));
  const newCart = cart.filter(value => value === productId);
  localStorage.setItem('panier', JSON.stringify(newCart));
  $(`#${productId}`).remove();
  if ($('#table-body').children().length === 0) {
    $('article').empty();
    $('article').append('<h1 id="panier">Panier</h1>');
    createShoppingCart();
  }
  $('.count').text(newCart.length);
  if (newCart.length === 0) $('.count').css('display', 'none');
  const productToDelete = products.filter(product => product.id === productId)[0];
  refreshPrice(productToDelete, 0, currentAmount);
  return true;
};

const emptyCart = () => {
  const confirmed = window.confirm('Voulez-vous supprimer tous les produits du panier ?');
  if (!confirmed) return false;
  localStorage.setItem('panier', '[]');
  $('article').empty();
  $('article').append('<h1 id="panier">Panier</h1>');
  $('.count').text(0);
  $('.count').css('display', 'none');
  createShoppingCart();
};
