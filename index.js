const express = require("express");
const app = express();
const port = process.env.port || 3400;

const {getData, saveData} = require("./db");


app.listen(port, function(){ console.log("Lyssnar på port "+port)})
app.get("/", function(req, res){
    res.send(getData());
})

app.get("/create/:name/:price", function(req, res){


    const product = req.params;
    product.id = Date.now();

    const allProducts = getData();
    // Lägg till vår nya produkt i allProducts
    allProducts.push(product);

    saveData(allProducts);
    res.redirect("/");


})

