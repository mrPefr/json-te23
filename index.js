const express = require("express");
const app = express();
const port = process.env.port || 3400;
const escape = require("escape-html");
const session = require("express-session");

// Läs in skapade funktioner från db.js
const {getData, saveData} = require("./db");

/* FIXA SÅ ATT VI FÅR EN REQ.BODY DVS TA EMOT DATA VIA POST */

app.use(express.urlencoded({extended:true}))



// sätt igång session
app.use(session(
    {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}
));


function render(content){

    let html = require("fs").readFileSync("template.html").toString();

   return html.replace("%content%", content);

}




app.listen(port, function(){ console.log("Lyssnar på port "+port)})


app.get("/", function(req, res){

    res.send(render("HOME"))

});

app.get("/session", function(req, res){

    res.send(req.session);

});





app.post("/login", function(req, res){

    const pin = req.body.pin;

    if(pin != process.env.pin) return res.send(render("Bad Credentials"));


    req.session.auth = true;  // Hålla oss inloggade.

    res.send(render("Login Success"));

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

    if(!req.session.auth) return res.send(render("FORBIDDEN"))

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


    if(!req.session.auth) return res.send(render("FORBIDDEN"))

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
