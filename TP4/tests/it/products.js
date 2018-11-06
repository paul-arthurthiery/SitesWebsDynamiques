process.env.NODE_ENV = "test";

var chai = require("chai");
var chaiHttp = require("chai-http");
var rn = require("random-number");

var server = require("../../app");
var Product = require("mongoose").model("Product");

chai.should();
chai.use(chaiHttp);

describe("API des produits", function() {
  beforeEach(function(done) { // Before each test we empty the database
    Product.remove({}, function() {
      done();
    });
  });

  /*
   * Tests the GET /api/products route
   */
  describe("GET /api/products", function() {
    it("doit récupérer une liste vide lorsque la base de données est vide", function(done) {
      chai.request(server)
        .get("/api/products")
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
    it("doit récupérer une liste de tous les produits triée selon le critère par défaut", function(done) {
      populateDatabase(function(productsList) {
        chai.request(server)
          .get("/api/products")
          .end(function(err, res) {
            res.should.have.status(200);
            productsList = applySortingCriteria(productsList, "price-asc");
            validateProductsList(res.body, productsList);
            done();
          });
      });
    });
    it("doit récupérer une liste de tous les produits qui doit être triée selon le critère 'price-asc'", function(done) {
      populateDatabase(function(productsList) {
        chai.request(server)
          .get("/api/products?criteria=price-asc")
          .end(function(err, res) {
            res.should.have.status(200);
            productsList = applySortingCriteria(productsList, "price-asc");
            validateProductsList(res.body, productsList);
            done();
          });
      });
    });
    it("doit récupérer une liste de tous les produits qui doit être triée selon le critère 'price-dsc'", function(done) {
      populateDatabase(function(productsList) {
        chai.request(server)
          .get("/api/products?criteria=price-dsc")
          .end(function(err, res) {
            res.should.have.status(200);
            productsList = applySortingCriteria(productsList, "price-dsc");
            validateProductsList(res.body, productsList);
            done();
          });
      });
    });
    it("doit récupérer une liste de tous les produits qui doit être triée selon le critère 'alpha-asc'", function(done) {
      populateDatabase(function(productsList) {
        chai.request(server)
          .get("/api/products?criteria=alpha-asc")
          .end(function(err, res) {
            res.should.have.status(200);
            productsList = applySortingCriteria(productsList, "alpha-asc");
            validateProductsList(res.body, productsList);
            done();
          });
      });
    });
    it("doit récupérer une liste de tous les produits qui doit être triée selon le critère 'alpha-dsc'", function(done) {
      populateDatabase(function(productsList) {
        chai.request(server)
          .get("/api/products?criteria=alpha-dsc")
          .end(function(err, res) {
            res.should.have.status(200);
            productsList = applySortingCriteria(productsList, "alpha-dsc");
            validateProductsList(res.body, productsList);
            done();
          });
      });
    });
    it("doit indiquer une erreur lorsque le critère de tri spécifié est invalide", function(done) {
      populateDatabase(function() {
        chai.request(server)
          .get("/api/products?criteria=invalid")
          .end(function(err, res) {
            res.should.have.status(400);
            done();
          });
      });
    });
    it("doit récupérer une liste contenant les produits appartenant à la catégorie 'cameras'", function(done) {
      populateDatabase(function(productsList) {
        chai.request(server)
          .get("/api/products?category=cameras")
          .end(function(err, res) {
            res.should.have.status(200);
            productsList = applySortingCriteria(applyCategory(productsList, "cameras"), "price-asc");
            validateProductsList(res.body, productsList);
            done();
          });
      });
    });
    it("doit récupérer une liste contenant les produits appartenant à la catégorie 'computers'", function(done) {
      populateDatabase(function(productsList) {
        chai.request(server)
          .get("/api/products?category=computers")
          .end(function(err, res) {
            res.should.have.status(200);
            productsList = applySortingCriteria(applyCategory(productsList, "computers"), "price-asc");
            validateProductsList(res.body, productsList);
            done();
          });
      });
    });
    it("doit récupérer une liste contenant les produits appartenant à la catégorie 'consoles'", function(done) {
      populateDatabase(function(productsList) {
        chai.request(server)
          .get("/api/products?category=consoles")
          .end(function(err, res) {
            res.should.have.status(200);
            productsList = applySortingCriteria(applyCategory(productsList, "consoles"), "price-asc");
            validateProductsList(res.body, productsList);
            done();
          });
      });
    });
    it("doit récupérer une liste contenant les produits appartenant à la catégorie 'screens'", function(done) {
      populateDatabase(function(productsList) {
        chai.request(server)
          .get("/api/products?category=screens")
          .end(function(err, res) {
            res.should.have.status(200);
            productsList = applySortingCriteria(applyCategory(productsList, "screens"), "price-asc");
            validateProductsList(res.body, productsList);
            done();
          });
      });
    });
    it("doit indiquer une erreur lorsque la catégorie spécifiée est invalide", function(done) {
      populateDatabase(function() {
        chai.request(server)
          .get("/api/products?category=invalid")
          .end(function(err, res) {
            res.should.have.status(400);
            done();
          });
      });
    });
  });

  /*
   * Tests the GET /api/products/:id route
   */
  describe("GET /api/products/:id", function() {
    it("doit récupérer le produit associé à l'identifiant spécifié", function(done) {
      populateDatabase(function(productsList) {
        var productId = rn({
          min:  1,
          max:  productsList.length,
          integer: true
        });
        chai.request(server)
          .get("/api/products/" + productId)
          .end(function(err, res) {
            res.should.have.status(200);
            var product = productsList.find(function(product) {
              return product.id === productId;
            });
            validateProduct(res.body, product);
            done();
          });
      });
    });
    it("doit indiquer une erreur lorsque l'identifiant spécifié est invalide", function(done) {
      populateDatabase(function(productsList) {
        var productId = rn({
          min: productsList.length + 1,
          max: 1000,
          integer: true
        });
        chai.request(server)
          .get("/api/products/" + productId)
          .end(function(err, res) {
            res.should.have.status(404);
            done();
          });
      });
    });
  });

  /*
   * Tests the POST /api/products route
   */
  describe("POST /api/products", function() {
    const PRODUCT = {
      id: 1,
      name: "Nom du produit",
      price: 99.99,
      image: "image.png",
      category: "computers",
      description: "La description du produit.",
      features: [
        "Caractéristique 1",
        "Caractéristique 2",
        "Caractéristique 3"
      ]
    };

    it("doit indiquer une erreur si l'identifiant du produit est déjà utilisé", function(done) {
      populateDatabase(function(productsList) {
        var product = JSON.parse(JSON.stringify(PRODUCT));
        product.id = rn({
          min:  1,
          max:  productsList.length,
          integer: true
        });
        chai.request(server)
          .post("/api/products/")
          .set("content-type", "application/json")
          .send(product)
          .end(function(err, res) {
            res.should.have.status(400);
            done();
          });
      });
    });
    it("doit indiquer une erreur lorsque l'identifiant spécifié est invalide", function(done) {
      var product = JSON.parse(JSON.stringify(PRODUCT));
      product.id = "invalid";
      chai.request(server)
        .post("/api/products/")
        .set("content-type", "application/json")
        .send(product)
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it("doit indiquer une erreur lorsque le nom spécifié est invalide", function(done) {
      var product = JSON.parse(JSON.stringify(PRODUCT));
      product.name = "";
      chai.request(server)
        .post("/api/products/")
        .set("content-type", "application/json")
        .send(product)
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it("doit indiquer une erreur lorsque le prix spécifié est invalide", function(done) {
      var product = JSON.parse(JSON.stringify(PRODUCT));
      product.price = "invalid";
      chai.request(server)
        .post("/api/products/")
        .set("content-type", "application/json")
        .send(product)
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it("doit indiquer une erreur lorsque l'image spécifiée est invalide", function(done) {
      var product = JSON.parse(JSON.stringify(PRODUCT));
      product.image = "";
      chai.request(server)
        .post("/api/products/")
        .set("content-type", "application/json")
        .send(product)
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it("doit indiquer une erreur lorsque la catégorie spécifiée est invalide", function(done) {
      var product = JSON.parse(JSON.stringify(PRODUCT));
      product.category = "invalid";
      chai.request(server)
        .post("/api/products/")
        .set("content-type", "application/json")
        .send(product)
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it("doit indiquer une erreur lorsque la description spécifiée est invalide", function(done) {
      var product = JSON.parse(JSON.stringify(PRODUCT));
      product.description = "";
      chai.request(server)
        .post("/api/products/")
        .set("content-type", "application/json")
        .send(product)
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it("doit indiquer une erreur lorsque les caractéristiques sont invalides", function(done) {
      var product = JSON.parse(JSON.stringify(PRODUCT));
      product.features = [""];
      chai.request(server)
        .post("/api/products/")
        .set("content-type", "application/json")
        .send(product)
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it("doit créer un produit dans la base de données lorsque les informations sont valides", function(done) {
      var product = JSON.parse(JSON.stringify(PRODUCT));
      chai.request(server)
        .post("/api/products/")
        .set("content-type", "application/json")
        .send(product)
        .end(function(err, res) {
          res.should.have.status(201);
          chai.request(server)
            .get("/api/products/" + product.id)
            .end(function(err, res) {
              res.should.have.status(200);
              validateProduct(res.body, product);
              done();
            });
        });
    });
  });

  /*
   * Tests the DELETE /api/products/:id route
   */
  describe("DELETE /api/products/:id", function() {
    it("doit supprimer le produit associé à l'identifiant spécifié dans la base de données", function(done) {
      populateDatabase(function(productsList) {
        var productId = rn({
          min:  1,
          max:  productsList.length,
          integer: true
        });
        chai.request(server)
          .delete("/api/products/" + productId)
          .end(function(err, res) {
            res.should.have.status(204);
            chai.request(server)
              .get("/api/products/" + productId)
              .end(function(err, res) {
                res.should.have.status(404);
                done();
              });
          });
      });
    });
    it("doit indiquer une erreur lorsque l'identifiant spécifié est invalide", function(done) {
      populateDatabase(function(productsList) {
        var productId = rn({
          min: productsList.length + 1,
          max: 1000,
          integer: true
        });
        chai.request(server)
          .delete("/api/products/" + productId)
          .end(function(err, res) {
            res.should.have.status(404);
            done();
          });
      });
    });
  });

  /*
   * Tests the DELETE /api/products route
   */
  describe("DELETE /api/products", function() {
    it("doit supprimer tous les produits de la base de données", function(done) {
      populateDatabase(function() {
        chai.request(server)
          .delete("/api/products/")
          .end(function(err, res) {
            res.should.have.status(204);
            chai.request(server)
              .get("/api/products/")
              .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a("array");
                res.body.length.should.be.eql(0);
                done();
              });
          });
      });
    });
  });

  after(function(done) {
    populateDatabase(function() {
      done();
    });
  });
});

/**
 * Populates the database with initials values.
 *
 * @param callback    The callback to call at the end of the operation.
 */
function populateDatabase(callback) {
  var productsList = require("./data/products");
  productsList.forEach(function(product, i) {
    new Product(product).save(function() {
      if (i === productsList.length - 1) {
        callback(productsList);
      }
    });
  });
}

/**
 * Validates a product.
 *
 * @param product               The product to validate.
 * @param expectedProduct       The expected product to use.
 */
function validateProduct(product, expectedProduct) {
  product.should.be.a("object");
  product.should.have.property("id").eql(expectedProduct.id);
  product.should.have.property("name").eql(expectedProduct.name);
  product.should.have.property("price").eql(expectedProduct.price);
  product.should.have.property("image").eql(expectedProduct.image);
  product.should.have.property("category").eql(expectedProduct.category);
  product.should.have.property("description").eql(expectedProduct.description);
  product.should.have.property("features");
  product.features.length.should.equals(expectedProduct.features.length);
  product.features.forEach(function(feature, i) {
    feature.should.equals(expectedProduct.features[i]);
  });
}

/**
 * Validates the products list.
 *
 * @param productsList            The products list to validate.
 * @param expectedProductsList    The expected product list to use.
 */
function validateProductsList(productsList, expectedProductsList) {
  productsList.should.be.a("array");
  productsList.length.should.equals(expectedProductsList.length);
  productsList.forEach(function(product, i) {
    validateProduct(product, expectedProductsList[i]);
  });
}

/**
 * Applies a filter to the specified products list to keep only the products of the specified category.
 *
 * @param products        The products list to filter.
 * @param category        The category to use with the filter.
 * @returns {*}           The products list filtered.
 */
function applyCategory(products, category) {
  if (products) {
    products = products.filter(function(product) {
      return category === "all" || product.category === category;
    });
  }
  return products;
}

/**
 * Applies a sorting criteria to the specified products list.
 *
 * @param products          The product list to sort.
 * @param sortingCriteria   The sorting criteria to use. The available values are:
 *                            - price-asc (ascendant price);
 *                            - price-dsc (descendant price);
 *                            - alpha-asc (alphabetical order ascending);
 *                            - alpha-dsc (alphabetical order descending).
 * @returns {*}             The products list sorted.
 */
function applySortingCriteria(products, sortingCriteria) {
  if (products) {
    switch (sortingCriteria) {
      case "price-asc":
        products = products.sort(function(a, b) {
          return a["price"] - b["price"];
        });
        break;
      case "price-dsc":
        products = products.sort(function(a, b) {
          return b["price"] - a["price"];
        });
        break;
      case "alpha-asc":
        products = products.sort(function(a, b) {
          var nameA = a["name"].toLowerCase();
          var nameB = b["name"].toLowerCase();
          if (nameA > nameB) {
            return 1;
          } else if (nameA < nameB) {
            return -1;
          }
          return 0;
        });
        break;
      case "alpha-dsc":
        products = products.sort(function(a, b) {
          var nameA = a["name"].toLowerCase();
          var nameB = b["name"].toLowerCase();
          if (nameA > nameB) {
            return -1;
          } else if (nameA < nameB) {
            return 1;
          }
          return 0;
        });
        break;
    }
  }
  return products;
}
