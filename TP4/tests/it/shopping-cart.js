process.env.NODE_ENV = "test";

var chai = require("chai");
var chaiHttp = require("chai-http");
var rn = require("random-number");

var server = require("../../app");
var Product = require("mongoose").model("Product");
var productsListLength = 0;

chai.should();
chai.use(chaiHttp);

describe("API du panier d'achats", function() {
  before(function(done) {
    Product.remove({}, function() {
      var productsList = require("./data/products");
      productsList.forEach(function(product, i) {
        new Product(product).save(function() {
          if (i === productsList.length - 1) {
            productsListLength = productsList.length;
            done();
          }
        });
      });
    });
  });

  /*
   * Tests the GET /api/shopping-cart route
   */
  describe("GET /api/shopping-cart", function() {
    it("doit récupérer une liste vide lorsqu'il n'y a pas de produits dans le panier", function(done) {
      var agent = chai.request.agent(server);
      agent.get("/api/shopping-cart")
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
    it("doit récupérer une liste non vide lorsqu'il y a des produits dans la panier", function(done) {
      var entry1 = {
        productId: 1,
        quantity: 1
      };
      var entry2 = {
        productId: 2,
        quantity: 1
      };
      var agent = chai.request.agent(server);
      addEntry(agent, entry1, function() {
        addEntry(agent, entry2, function() {
          agent.get("/api/shopping-cart")
            .end(function(err, res) {
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.length.should.be.eql(2);
              var expectedEntries = [entry1, entry2];
              res.body.forEach(function(entry, i) {
                validateEntry(entry, expectedEntries[i]);
              });
              done();
            });
        });
      });
    });
  });

  /*
   * Tests the GET /api/shopping-cart/:productId route
   */
  describe("GET /api/shopping-cart/:productId", function() {
    it("doit récupérer l'entrée à l'identifiant de produit spécifié", function(done) {
      var productId = rn({
        min:  1,
        max:  productsListLength,
        integer: true
      });
      var entry = {
        productId: productId,
        quantity: 1
      };
      var agent = chai.request.agent(server);
      addEntry(agent, entry, function() {
        agent.get("/api/shopping-cart/" + productId)
          .end(function(err, res) {
            res.should.have.status(200);
            validateEntry(res.body, entry);
            done();
          });
      });
    });
    it("doit indiquer une erreur lorsque l'identifiant de produit spécifié n'existe pas dans le panier", function(done) {
      var productId = rn({
        min:  1,
        max:  productsListLength,
        integer: true
      });
      var agent = chai.request.agent(server);
      agent.get("/api/shopping-cart/" + productId)
        .end(function(err, res) {
          res.should.have.status(404);
          done();
        });
    });
  });

  /*
   * Tests the POST /api/shopping-cart route
   */
  describe("POST /api/shopping-cart", function() {
    it("doit indiquer une erreur si l'identifiant du produit spécifié n'existe pas", function(done) {
      var invalidProductId = rn({
        min:  productsListLength + 1,
        max:  1000,
        integer: true
      });
      var agent = chai.request.agent(server);
      agent.post("/api/shopping-cart")
        .set("content-type", "application/json")
        .send({
          productId: invalidProductId,
          quantity: 1
        })
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it("doit indiquer une erreur si l'identifiant du produit spécifié est invalide", function(done) {
      var agent = chai.request.agent(server);
      agent.post("/api/shopping-cart")
        .set("content-type", "application/json")
        .send({
          productId: "invalid",
          quantity: 1
        })
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it("doit indiquer une erreur si la quantité spécifiée est invalide", function(done) {
      var agent = chai.request.agent(server);
      agent.post("/api/shopping-cart")
        .set("content-type", "application/json")
        .send({
          productId: 1,
          quantity: "invalid"
        })
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it("doit créer une entrée dans le panier d'achats lorsque les informations sont valides", function(done) {
      var productId = rn({
        min:  1,
        max:  productsListLength,
        integer: true
      });
      var quantity = rn({
        min: 1,
        max: 10,
        integer: true
      });
      var entry = {
        productId: productId,
        quantity: quantity
      };
      var agent = chai.request.agent(server);
      agent.post("/api/shopping-cart")
        .set("content-type", "application/json")
        .send(entry)
        .end(function(err, res) {
          res.should.have.status(201);
          agent.get("/api/shopping-cart/" + productId)
            .end(function(err, res) {
              res.should.have.status(200);
              validateEntry(res.body, entry);
              done();
            });
        });
    });
  });

  /*
   * Tests the PUT /api/shopping-cart/:productId route
   */
  describe("PUT /api/shopping-cart/:productId", function() {
    it("doit indiquer une erreur si l'identifiant du produit spécifié n'existe pas dans le panier", function(done) {
      var invalidProductId = rn({
        min:  2,
        max:  1000,
        integer: true
      });
      var entry = {
        productId: 1,
        quantity: 1
      };
      var agent = chai.request.agent(server);
      addEntry(agent, entry, function() {
        agent.put("/api/shopping-cart/" + invalidProductId)
          .set("content-type", "application/json")
          .send({
            quantity: 1
          })
          .end(function(err, res) {
            res.should.have.status(404);
            done();
          });
      });
    });
    it("doit indiquer une erreur si la quantité spécifiée est invalide", function(done) {
      var agent = chai.request.agent(server);
      var entry = {
        productId: 1,
        quantity: 1
      };
      addEntry(agent, entry, function() {
        agent.put("/api/shopping-cart/" + entry.productId)
          .set("content-type", "application/json")
          .send({
            quantity: "invalid"
          })
          .end(function(err, res) {
            res.should.have.status(400);
            done();
          });
      });
    });
    it("doit mettre à jour la quantité associée à l'identifiant de produit spécifié lorsque les informations " +
      "sont valides", function(done) {
      var agent = chai.request.agent(server);
      var randomQuantity = rn({
        min: 2,
        max: 10,
        integer: true
      });
      var entry = {
        productId: 1,
        quantity: randomQuantity
      };
      addEntry(agent, entry, function() {
        agent.put("/api/shopping-cart/" + entry.productId)
          .set("content-type", "application/json")
          .send({
            quantity: randomQuantity
          })
          .end(function(err, res) {
            res.should.have.status(204);
            agent.get("/api/shopping-cart/" + entry.productId)
              .end(function(err, res) {
                res.should.have.status(200);
                validateEntry(res.body, entry);
                done();
              });
          });
      });
    });
  });

  /*
   * Tests the DELETE /api/shopping-cart/:productId route
   */
  describe("DELETE /api/shopping-cart/:productId", function() {
    it("doit supprimer l'entrée associée à l'identifiant du produit spécifié dans le panier", function(done) {
      var productId = rn({
        min:  1,
        max:  productsListLength,
        integer: true
      });
      var entry = {
        productId: productId,
        quantity: 1
      };
      var agent = chai.request.agent(server);
      addEntry(agent, entry, function() {
        agent.delete("/api/shopping-cart/" + productId)
          .end(function(err, res) {
            res.should.have.status(204);
            agent.get("/api/shopping-cart/")
              .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a("array");
                res.body.length.should.be.eql(0);
                done();
              });
          });
      });
    });
    it("doit indiquer une erreur si l'identifiant du produit spécifié n'existe pas dans le panier", function(done) {
      var invalidProductId = rn({
        min:  productsListLength + 1,
        max:  1000,
        integer: true
      });
      var entry = {
        productId: 1,
        quantity: 1
      };
      var agent = chai.request.agent(server);
      addEntry(agent, entry, function() {
        agent.delete("/api/shopping-cart/" + invalidProductId)
          .end(function(err, res) {
            res.should.have.status(404);
            done();
          });
      });
    });
  });

  /*
   * Tests the DELETE /api/shopping-cart route
   */
  describe("DELETE /api/shopping-cart", function() {
    it("doit supprimer toutes les entrées se trouvant dans le panier", function(done) {
      var entry = {
        productId: 1,
        quantity: 1
      };
      var agent = chai.request.agent(server);
      addEntry(agent, entry, function() {
        agent.delete("/api/shopping-cart/")
          .end(function(err, res) {
            res.should.have.status(204);
            agent.get("/api/shopping-cart/")
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
});

/**
 * Validates the entry.
 *
 * @param entry           The entry to validate.
 * @param expectedEntry   The expected entry to use.
 */
function validateEntry(entry, expectedEntry) {
  entry.should.be.a("object");
  entry.should.have.property("productId").eql(expectedEntry.productId);
  entry.should.have.property("quantity").eql(expectedEntry.quantity);
}

/**
 * Adds an entry in the shopping cart.
 *
 * @param agent     The agent to use.
 * @param entry     The entry to add.
 * @param callback  The callback to call at the end of the operation.
 */
function addEntry(agent, entry, callback) {
  agent.post("/api/shopping-cart")
    .set("content-type", "application/json")
    .send(entry)
    .end(function(err, res) {
      res.should.have.status(201);
      callback();
    });
}
