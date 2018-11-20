const express = require("express");
const router = express.Router();
const productsManager = require("../managers/products");

// Gets all the products in the database.
router.get("/", (req, res) => {
  productsManager.getProducts(req.query.criteria, req.query.category).done(result => {
    if (result.err) {
      res.status(400).send();
    } else {
      res.json(result.data);
    }
  });
});

// Gets the product associated with the specified ID.
router.get("/:id", (req, res) => {
  productsManager.getProduct(req.params.id).done(result => {
    if (result.err) {
      res.status(404).send();
    } else {
      res.json(result.data);
    }
  });
});

// Adds a new product in the database.
router.post("/", (req, res) => {
  productsManager.createProduct(req.body).done(err => {
    if (err) {
      res.status(400).send();
    } else {
      res.status(201).send();
    }
  });
});

// Deletes the product associated with the specified ID in the database.
router.delete("/:id", (req, res) => {
  productsManager.deleteProduct(req.params.id).done(err => {
    if (err) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  });
});

// Deletes all the products in the database.
router.delete("/", (req, res) =>  {
  productsManager.deleteProducts().done(() => {
    res.status(204).send();
  });
});

module.exports = router;
