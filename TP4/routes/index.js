const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Accueil", message: "Ça semble fonctionner!" });
});

module.exports = router;
