const express = require("express");
const app = express();
const port = process.env.port || 3400;


// Läs in skapade funktioner från db.js
const {getData, saveData} = require("./db");


app.listen(port, function(){ console.log("Lyssnar på port "+port)})

// Route som hämtar datan och spottar ut den som JSON på skärmen.
// Det blir html om några lektioner.
app.get("/", function(req, res){
    res.send(getData());
})


// Vår första create-route där vi för enkelhetens skull använder params.
app.get("/create/:name/:price", function(req, res){


    // Hämtar data från params
    const product = req.params;
    // Genererar ett unikt id.
    product.id = Date.now();

    // Hämtar alla produkter -> detta blir en array
    const allProducts = getData();

    // Lägg till vår nya produkt i allProducts
    allProducts.push(product);

    // Spara alla produkter till json fil med hjälp av vår nybyggda funktion som ligger i db.js
    saveData(allProducts);

    // Istället för att skicka data så skickar vi användaren tillbaka till route / där alla produkter redan visas.
    res.redirect("/");


})

