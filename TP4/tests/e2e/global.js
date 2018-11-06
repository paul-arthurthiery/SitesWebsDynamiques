module.exports = {
  before: function(done) {
    var request = require("request");
    var productsList = require("./data/products.json");

    // Deletes all the products in the database.
    request.delete("http://localhost:8000/api/products", function(err, response) {
      if (!err && response.statusCode === 204) {
        productsList.forEach(function(product, i) {
          // Creates a new product in the database.
          request.post({
            headers: { "content-type": "application/json" },
            url: "http://localhost:8000/api/products",
            json: product
          }, function(err, response){
            if (!err && response.statusCode === 201) {
              if (i === productsList.length - 1) {
                console.log("Dix produits ont été ajoutés dans la base de données pour les tests.\n");
                done();
              }
            } else {
              console.error("Une erreur est survenue lors de la création d'un produit avec l'API.");
            }
          });
        });
      } else {
        console.error("Une erreur est survenue durant l'accès à l'API des produits.");
      }
    });
  }
};
