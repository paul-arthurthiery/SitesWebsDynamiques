/* global getProducts $:true */


let products;
let firstLoad = true;


const sortWithCriteria = (criteria) => {
  let sortKey;
  let reverseSort = false;
  let priceSort = false;
  switch (true) {
    case (criteria === 'price'):
      sortKey = '.raw-price';
      priceSort = true;
      break;
    case (criteria === 'name'):
      sortKey = 'h2';
      break;
    case (criteria === 'reversePrice'):
      sortKey = '.raw-price';
      reverseSort = true;
      priceSort = true;
      break;
    case (criteria === 'reverseName'):
      sortKey = 'h2';
      reverseSort = true;
      break;
    default:
      return false;
  }
  const items = $('.products').children().sort((a, b) => {
    let aValue = $(sortKey, a).text();
    let bValue = $(sortKey, b).text();
    if (priceSort) {
      aValue = parseInt(aValue, 10);
      bValue = parseInt(bValue, 10);
    } else {
      aValue = aValue.toUpperCase();
      bValue = bValue.toUpperCase();
    }
    if (!reverseSort) {
      if (aValue < bValue) return -1;
      return aValue > bValue ? 1 : 0;
    }
    if (aValue < bValue) return 1;
    return aValue > bValue ? -1 : 0;
  });
  $('.products').append(items);
  return true;
};

const refreshProducts = () => {
  getProducts().then((productsJson) => {
    $('#products-list').empty();
    products = productsJson;
    let productCounter = 0;
    products.forEach((product) => {
      productCounter += 1;
      $('#products-list').append(`
        <div class="product">
          <a href="./product.html?id=${product.id}" title="En savoir plus...">
            <h2>${product.name}</h2>
            <img alt="${product.name}" src="./assets/img/${product.image}">
            <p class="price"><small>Prix</small> <span class="raw-price">${product.price}</span>&thinsp;$</p>
          </a>
        </div>`);
    });
    $('#products-count').text(`${productCounter} produits`);
    if (firstLoad) {
      firstLoad = false;
      sortWithCriteria('price');
    }
  });
};

const productsByCategory = (category) => {
  $('#products-list').empty();
  let productCounter = 0;
  if (category === 'all') return refreshProducts();
  products.forEach((product) => {
    if (product.category === category) {
      productCounter += 1;
      $('#products-list').append(`<div class="product">
        <a href="./product.html?id=${product.id}" title="En savoir plus...">
            <h2>${product.name}</h2>
            <img alt="${product.name}" src="./assets/img/${product.image}">
            <p class="raw-price"><small>Prix</small> ${product.price}&thinsp;$</p>
        </a>
        </div>`);
    }
  });
  $('#products-count').text(`${productCounter} produits`);
  return true;
};

$('#product-categories').children().click((e) => {
  const category = $(e.target).data('category');
  productsByCategory(category);
  const selected = $('#product-categories').children();
  selected.removeClass('selected');
  $(e.target).addClass('selected');
});

$('#product-criteria').children().click((e) => {
  sortWithCriteria($(e.target).data('criteria'));
  const selected = $('#product-criteria').children();
  selected.removeClass('selected');
  $(e.target).addClass('selected');
});

refreshProducts();
