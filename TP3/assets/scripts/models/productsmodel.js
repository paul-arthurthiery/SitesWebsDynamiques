

export let getProducts = () => {

    $.getJSON( "../../data/products.json", function( data ) {
        return JSON.parse(data);
    });
};


