const express = require("express");
const router = express.Router();
const ordersManager = require("../managers/orders");

// Gets all the orders in the database.
router.get("/", (req, res) => {
  ordersManager.getOrders().done(result => {
    res.json(result.data);
  });
});

// Gets the order associated with the specified ID.
router.get("/:id", (req, res) => {
  ordersManager.getOrder(req.params.id).done(result => {
    if (result.err) {
      res.status(404).send();
    } else {
      res.json(result.data);
    }
  });
});

// Adds a new order in the database.
router.post("/", (req, res) => {
  ordersManager.createOrder(req.body).done(err => {
    if (err) {
      res.status(400).send();
    } else {
      res.status(201).send();
    }
  });
});

// Deletes the order associated with the specified ID in the database.
router.delete("/:id", (req, res) => {
  ordersManager.deleteOrder(req.params.id).done(err => {
    if (err) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  })
});

// Deletes all the orders in the database.
router.delete("/", (req, res) => {
  ordersManager.deleteOrders().done(() => {
    res.status(204).send();
  })
});

module.exports = router;
