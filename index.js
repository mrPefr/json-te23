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



app.get("/delete/:id", (req, res)=>{

    // Hämta id från url via params
    const id = req.params.id;

    // hämta alla produkter som ligger lagrade i json-fil.
    const products = getData();

    // Skapa ny array med alla produkter som INTE har det id som användaren skickat in
    const filteredProducts = products.filter(p=> p.id != id)

    saveData(filteredProducts);

    res.redirect("/?"+id+"_is_deleted");


})



app.get("/update/:id", (req, res)=>{


    const id = req.params.id;

    // hämta alla produkter

    const products = getData();

    // Hitta produkt med id som skickats via params


    const uProd = products.find(p=>p.id == id)

    if(!uProd) return res.redirect("/?error=no_product_to_update")

    uProd.name = req.query.name || uProd.name;
    uProd.price = req.query.price || uProd.price;

    saveData(products);

    res.redirect("/")
  

})
