

const createShoppingCart = () => {
    getProducts().then((productsJson) => {
        $('#table-body').empty();
        let idarray = []
        products = productsJson;
        panier = JSON.parse(localStorage.getItem("panier"));
        if (!panier || panier.length === 0) {
            $("main").empty();
            $("main").append(' <h1>Panier</h1> <p>Aucun produit dans votre panier</p>')
        } else {
            panier.forEach(id => {
                var numoccur = $.grep(idarray, function (elem) {
                    return elem === id;
                }).length;
                if(numoccur === 0){
                    idarray.push(id)
                    var numOccurences = $.grep(panier, function (elem) {
                        return elem === id;
                    }).length;
                    products.forEach(product => {
                        if (product.id === id ) {
                            $('#table-body').append(`
    <tr>
            <td><button title="Supprimer"><i class="fa fa-times"></i></button></td>
            <td><a href="./product.html">${product.name}</a></td>
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
            <td>199,99&thinsp;$</td>
          </tr>`)

                        }


                    })

                }

        })
            ;
        }


    });
};

createShoppingCart();
