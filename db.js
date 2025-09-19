// använd filsystemet 
const fs = require("fs");


// Funktion för att spara data som json i en .json-fil
function saveData(data){
    fs.writeFileSync("db.json",JSON.stringify(data,null, 3))
}

// Hämta och parsa data till array eller object
function getData(){
    return JSON.parse(fs.readFileSync("db.json").toString())
}


// Exportera två funktioner så att t ex index.js kan använda dessa.
module.exports = {getData, saveData}