process.env.NODE_ENV = "test";

var chai = require("chai");
var chaiHttp = require("chai-http");
var rn = require("random-number");

var server = require("../../app");
var mongoose = require("mongoose");
var Order = mongoose.model("Order");
var Product = mongoose.model("Product");
var productsListLength = 0;

chai.should();
chai.use(chaiHttp);

describe("API des commandes", function() {
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

  beforeEach(function(done) { // Before each test we empty the database
    Order.remove({}, function() {
      done();
    });
  });

  /*
   * Tests the GET /api/orders route
   */
  describe("GET /api/orders", function() {
    it("doit récupérer une liste vide lorsque la base de données est vide", function(done) {
      chai.request(server)
        .get("/api/orders")
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
    it("doit récupérer une liste de toutes les commandes se trouvant dans la base de données", function(done) {
      populateDatabase(function(ordersList) {
        chai.request(server)
          .get("/api/orders")
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.be.a("array");
            res.body.length.should.be.eql(ordersList.length);
            sortOrders(res.body).forEach(function(order, i) {
              validateOrder(order, ordersList[i]);
            });
            done();
          });
      });
    });
  });

  /*
   * Tests the GET /api/orders/:id route
   */
  describe("GET /api/orders/:id", function() {
    it("doit récupérer la commande liée à l'identifiant spécifié", function(done) {
      populateDatabase(function(ordersList) {
        var orderId = rn({
          min:  1,
          max:  ordersList.length,
          integer: true
        });
        chai.request(server)
          .get("/api/orders/" + orderId)
          .end(function(err, res) {
            res.should.have.status(200);
            validateOrder(res.body, ordersList[orderId - 1]);
            done();
          });
      });
    });
    it("doit indiquer une erreur lorsque l'identifiant spécifié est invalide", function(done) {
      populateDatabase(function(ordersList) {
        var invalidOrderId = rn({
          min:  ordersList.length + 1,
          max:  1000,
          integer: true
        });
        chai.request(server)
          .get("/api/orders/" + invalidOrderId)
          .end(function(err, res) {
            res.should.have.status(404);
            done();
          });
      });
    });
  });

  /*
   * Tests the POST /api/orders route
   */
  describe("POST /api/orders", function() {
    const ORDER = {
      id: 3,
      firstName: "Antoine",
      lastName: "Béland",
      email: "antoine.beland@polymtl.ca",
      phone: "514-340-4711",
      products: [
        {
          id: 1,
          quantity: 2
        },
        {
          id: 2,
          quantity: 1
        }
      ]
    };

    it("doit indiquer une erreur si l'identifiant de commande est déjà utilisé", function(done) {
      populateDatabase(function(ordersList) {
        var order = JSON.parse(JSON.stringify(ORDER));
        order.id = rn({
          min:  1,
          max:  ordersList.length,
          integer: true
        });
        chai.request(server)
          .post("/api/orders/")
          .set("content-type", "application/json")
          .send(order)
          .end(function(err, res) {
            res.should.have.status(400);
            done();
          });
      });
    });
    it("doit indiquer une erreur lorsque l'identifiant spécifié est invalide", function(done) {
      var order = JSON.parse(JSON.stringify(ORDER));
      order.id = "invalid";
      chai.request(server)
        .post("/api/orders/")
        .set("content-type", "application/json")
        .send(order)
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it("doit indiquer une erreur lorsque le prénom spécifié est invalide", function(done) {
      var order = JSON.parse(JSON.stringify(ORDER));
      order.firstName = "";
      chai.request(server)
        .post("/api/orders/")
        .set("content-type", "application/json")
        .send(order)
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it("doit indiquer une erreur lorsque le nom de famille spécifié est invalide", function(done) {
      var order = JSON.parse(JSON.stringify(ORDER));
      order.lastName = "";
      chai.request(server)
        .post("/api/orders/")
        .set("content-type", "application/json")
        .send(order)
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it("doit indiquer une erreur lorsque l'adresse courriel spécifiée est invalide", function(done) {
      var order = JSON.parse(JSON.stringify(ORDER));
      order.email = "antoine.beland@";
      chai.request(server)
        .post("/api/orders/")
        .set("content-type", "application/json")
        .send(order)
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it("doit indiquer une erreur lorsque le numéro de téléphone spécifié est invalide", function(done) {
      var order = JSON.parse(JSON.stringify(ORDER));
      order.phone = "514-340-";
      chai.request(server)
        .post("/api/orders/")
        .set("content-type", "application/json")
        .send(order)
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it("doit indiquer une erreur lorsqu'un identifiant de produit se trouvant dans la liste de produits " +
      "n'existe pas", function(done) {
      var order = JSON.parse(JSON.stringify(ORDER));
      order.products = [
        {
          id: productsListLength + 1,
          quantity: 1
        }
      ];
      chai.request(server)
        .post("/api/orders/")
        .set("content-type", "application/json")
        .send(order)
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it("doit indiquer une erreur lorsqu'une liste de produits invalide est spécifiée", function(done) {
      var order = JSON.parse(JSON.stringify(ORDER));
      order.products = [
        { id: "invalid", quantity: 1 },
        { id: 2, quantity: "invalid" }
      ];
      chai.request(server)
        .post("/api/orders/")
        .set("content-type", "application/json")
        .send(order)
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it("doit créer une commande dans la base de données lorsque les informations sont valides", function(done) {
      var order = JSON.parse(JSON.stringify(ORDER));
      chai.request(server)
        .post("/api/orders/")
        .set("content-type", "application/json")
        .send(order)
        .end(function(err, res) {
          res.should.have.status(201);
          chai.request(server)
            .get("/api/orders/" + order.id)
            .end(function(err, res) {
              res.should.have.status(200);
              validateOrder(res.body, order);
              done();
            });
        });
    });
  });

  /*
   * Tests the DELETE /api/orders/:id route
   */
  describe("DELETE /api/orders/:id", function() {
    it("doit supprimer la commande associée à l'identifiant spécifié dans la base de données", function(done) {
      populateDatabase(function(ordersList) {
        var orderId = rn({
          min:  1,
          max:  ordersList.length,
          integer: true
        });
        chai.request(server)
          .delete("/api/orders/" + orderId)
          .end(function(err, res) {
            res.should.have.status(204);
            chai.request(server)
              .get("/api/orders/" + orderId)
              .end(function(err, res) {
                res.should.have.status(404);
                done();
              });
          });
      });
    });
    it("doit indiquer une erreur lorsque l'identifiant spécifié est invalide", function(done) {
      populateDatabase(function(ordersList) {
        var productId = rn({
          min: ordersList.length + 1,
          max: 1000,
          integer: true
        });
        chai.request(server)
          .delete("/api/orders/" + productId)
          .end(function(err, res) {
            res.should.have.status(404);
            done();
          });
      });
    });
  });

  /*
   * Tests the DELETE /api/orders route
   */
  describe("DELETE /api/orders", function() {
    it("doit supprimer tous les commandes de la base de données", function(done) {
      populateDatabase(function() {
        chai.request(server)
          .delete("/api/orders")
          .end(function(err, res) {
            res.should.have.status(204);
            chai.request(server)
              .get("/api/orders")
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
 * Populates the database with initials values.
 *
 * @param callback    The callback to call at the end of the operation.
 */
function populateDatabase(callback) {
  var ordersList = require("./data/orders");
  ordersList.forEach(function(product, i) {
    new Order(product).save(function() {
      if (i === ordersList.length - 1) {
        callback(ordersList);
      }
    });
  });
}

/**
 * Validates an order.
 *
 * @param order           The order to validate.
 * @param expectedOrder   The expected order to use.
 */
function validateOrder(order, expectedOrder) {
  order.should.be.a("object");
  order.should.have.property("id").eql(expectedOrder.id);
  order.should.have.property("firstName").eql(expectedOrder.firstName);
  order.should.have.property("lastName").eql(expectedOrder.lastName);
  order.should.have.property("email").eql(expectedOrder.email);
  order.should.have.property("phone").eql(expectedOrder.phone);
  order.should.have.property("products");
  order.products.length.should.equals(expectedOrder.products.length);
  order.products.forEach(function(product, i) {
    var expectedProduct = expectedOrder.products[i];
    product.should.be.a("object");
    product.should.have.property("id").eql(expectedProduct.id);
    product.should.have.property("quantity").eql(expectedProduct.quantity);
  });
}

/**
 * Sorts the orders based on their IDs.
 *
 * @param ordersList    The orders to sorts.
 * @return {array}      The orders sorted.
 */
function sortOrders(ordersList) {
  return ordersList.sort(function(a, b) {
    return a.id - b.id;
  });
}
