let products;
getProducts().then((productsJson) => {
    products = productsJson;
    products.forEach(product => $('#products-list').append(`<div class="product">
    <a href="./product.html?id=${product.id}" title="En savoir plus...">
      <h2>${product.name}</h2>
      <img alt="${product.name}" src="./assets/img/${product.image}">
      <p class="price"><small>Prix</small> ${product.price}&thinsp;$</p>
    </a>
  </div>`));
});


let productsByCategory = (category) => {
    $('#products-list').empty();
    products.forEach(product => {
        if(category === 'all'){
            //mettre ici la fonction build all products
        }
            else{if (product.category === category) {
                $('#products-list').append(`<div class="product">
        <a href="./product.html?id=${product.id}" title="En savoir plus...">
            <h2>${product.name}</h2>
            <img alt="${product.name}" src="./assets/img/${product.image}">
            <p class="price"><small>Prix</small> ${product.price}&thinsp;$</p>
        </a>
        </div>`);

            }}
        }
    );
};




$('#product-categories').children().click(e => {
    let category = $(e.target).data("category");
    productsByCategory(category)
    var selected = $('#product-categories').children()
    selected.removeClass("selected")
    $(e.target).addClass("selected")
});
