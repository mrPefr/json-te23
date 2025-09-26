const express = require("express");
const app = express();
const port = process.env.port || 3400;
const escape = require("escape-html");

// Läs in skapade funktioner från db.js
const {getData, saveData} = require("./db");


function render(content){

    let html = require("fs").readFileSync("template.html").toString();

   return html.replace("%content%", content);

}




app.listen(port, function(){ console.log("Lyssnar på port "+port)})


app.get("/", function(req, res){

    res.send(render("HOME"))

});




// Route som hämtar datan och spottar ut den som JSON på skärmen.
// Det blir html om några lektioner.
app.get("/products", function(req, res){
  
    const products = getData();

    const html = products.map(p=>{
        return `
            <div id = "id_${p.id}">
                <h3>${escape(p.name)}</h3>
                <h5><i>${escape(p.price)}</i></h5>
                <a href="/products/delete/${p.id}">delete</a>
            </div>
        `
    }).join("")

    res.send(render(html));

})


// Vår första create-route där vi för enkelhetens skull använder params.
app.get("/products/create", function(req, res){


    // Hämtar data från queryString
    const product = req.query;
    // Genererar ett unikt id.
    product.id = Date.now();

    // Hämtar alla produkter -> detta blir en array
    const allProducts = getData();

    // Lägg till vår nya produkt i allProducts
    allProducts.push(product);

    // Spara alla produkter till json fil med hjälp av vår nybyggda funktion som ligger i db.js
    saveData(allProducts);

    // Istället för att skicka data så skickar vi användaren tillbaka till route / där alla produkter redan visas.
    res.redirect("/products");


})



app.get("/products/delete/:id", (req, res)=>{

    // Hämta id från url via params
    const id = req.params.id;

    // hämta alla produkter som ligger lagrade i json-fil.
    const products = getData();

    // Skapa ny array med alla produkter som INTE har det id som användaren skickat in
    const filteredProducts = products.filter(p=> p.id != id)

    saveData(filteredProducts);

    res.redirect("/products?"+id+"_is_deleted");


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
