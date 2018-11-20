const express = require("express");
const router = express.Router();
const shoppingCartManager = require("../managers/shopping-cart");

// Initialize the shopping cart session.
router.use((req, res, next) => {
  shoppingCartManager.initialize(req.session);
  next();
});

// Gets all the items in the shopping cart.
router.get("/", (req, res) => {
  res.json(shoppingCartManager.getItems());
});

// Gets the item associated with the specified product ID.
router.get("/:id", (req, res) => {
  const item = shoppingCartManager.getItem(req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).send();
  }
});

// Adds a new item in the shopping cart.
router.post("/", (req, res) => {
  shoppingCartManager.addItem(req.body).done(err => {
    if (err) {
      res.status(400).send();
    } else {
      res.status(201).send();
    }
  });
});

// Updates the quantity associated with the specified product ID.
router.put("/:id", (req, res) => {
  const status = shoppingCartManager.updateItemQuantity(req.params.id, req.body.quantity);
  switch(status) {
    case 0:
      res.status(204).send();
      break;
    case 1:
      res.status(404).send();
      break;
    case 2:
      res.status(400).send();
  }
});

// Deletes the item associated with the specified ID.
router.delete("/:id", (req, res) => {
  if (shoppingCartManager.deleteItem(req.params.id)) {
    res.status(404).send();
  } else {
    res.status(204).send();
  }
});

// Deletes all the items in the shopping cart.
router.delete("/", (req, res) => {
  shoppingCartManager.deleteItems();
  res.status(204).send();
});

module.exports = router;
