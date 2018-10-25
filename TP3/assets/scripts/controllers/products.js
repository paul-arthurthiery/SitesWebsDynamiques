/* global getProducts $:true */


let products;


const refreshProducts = () => {
  getProducts().then((productsJson) => {
    products = productsJson;
    products.forEach(product => $('#products-list').append(`<div class="product">
    <a href="./product.html?id=${product.id}" title="En savoir plus...">
      <h2>${product.name}</h2>
      <img alt="${product.name}" src="./assets/img/${product.image}">
      <p class="price"><small>Prix</small> <span class="raw-price">${product.price}</span>&thinsp;$</p>
    </a>
  </div>`));
  });
};

refreshProducts();

const sortWithCriteria = (criteria) => {
  let sortKey;
  let reverseSort = false;
  switch (true) {
    case (criteria === 'price'):
      sortKey = 'raw-price';
      break;
    case (criteria === 'name'):
      sortKey = 'h2';
      break;
    case (criteria === 'reversePrice'):
      sortKey = 'raw-price';
      reverseSort = true;
      break;
    case (criteria === 'reverseName'):
      sortKey = 'h2';
      reverseSort = true;
      break;
    default:
      return false;
  }
  const items = $('.products').children().sort((a, b) => {
    const aValue = $(sortKey, a).text();
    const bValue = $(sortKey, b).text();
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


const productsByCategory = (category) => {
  $('#products-list').empty();
  products.forEach((product) => {
    if (category === 'all') {
      // mettre ici la fonction build all products
    } else if (product.category === category) {
      $('#products-list').append(`<div class="product">
        <a href="./product.html?id=${product.id}" title="En savoir plus...">
            <h2>${product.name}</h2>
            <img alt="${product.name}" src="./assets/img/${product.image}">
            <p class="price"><small>Prix</small> ${product.price}&thinsp;$</p>
        </a>
        </div>`);
    }
  });
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
});
