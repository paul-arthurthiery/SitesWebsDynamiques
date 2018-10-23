const getProducts = () => {
  $.getJSON('../../data/products.json', data => data);
};
