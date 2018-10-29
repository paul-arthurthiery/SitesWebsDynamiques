/* global getProducts $ localStorage */
const createShoppingCart = async () => {
  const products = await getProducts();
  const idarray = [];
  const panier = JSON.parse(localStorage.getItem('panier'));
  if (!panier || panier.length === 0) {
    $('article').html('<h1 id="panier">Panier</h1> <p>Aucun produit dans votre panier</p>');
  } else {
    let price = 0;
    panier.forEach((id) => {
      const productOccurence = $.grep(idarray, elem => elem === id).length; // idarray.reduce((acc, curr) => curr===id ? acc+=1:acc, 0)
      if (productOccurence === 0) {
        idarray.push(id);
        const numOccurences = $.grep(panier, elem => elem === id).length;
        products.forEach((product) => {
          if (product.id === parseInt(id, 10)) {
            price += Math.round(numOccurences * parseFloat(product.price) * 100) / 100;
            console.log(numOccurences * parseFloat(product.price));
            $('#table-body').append(`
              <tr>
                <td><button title="Supprimer"><i class="fa fa-times"></i></button></td>
                <td><a href="./product.html?id=${id}">${product.name}</a></td>
                <td>${product.price}&thinsp;$</td>
                <td>
                  <div class="row">
                    <div class="col">
                      <button title="Retirer" disabled=""><i class="fa fa-minus"></i></button>
                    </div>
                    <div class="col">${numOccurences}</div>
                    <div class="col">
                      <button title="Ajouter"><i class="fa fa-plus"></i></button>
                    </div>
                  </div>
                </td>
                <td>${Math.round(numOccurences * parseFloat(product.price) * 100) / 100}&thinsp;$</td>
              </tr>`);
          }
        });
      }
    });
    $('#prixtotal').html(`Total: <strong>${price}$</strong>`);
  }
};


createShoppingCart();
