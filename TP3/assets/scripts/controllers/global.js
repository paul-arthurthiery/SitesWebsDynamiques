localStorage.setItem("panier",JSON.stringify(['33','54','897','65','78']));
var panier = JSON.parse(localStorage.getItem("panier"));
if (!panier || panier.length === 0) {
    $("span.count").css("display", "none");
}else {
    $("span.count").css("display", "block");
    $("span.count").text(panier.length);
}