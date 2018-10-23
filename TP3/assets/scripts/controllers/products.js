getProducts().then((products) => {
  products.forEach(product => $('#products-list').append(`<div class="product">
    <a href="./product.html" title="En savoir plus...">
      <h2>${product.name}</h2>
      <img alt="${product.name}" src="./assets/img/${product.image}">
      <p class="price"><small>Prix</small> ${product.price}&thinsp;$</p>
    </a>
  </div>`));
});
