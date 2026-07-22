const fs = require("fs");

const products = fs.readFileSync("products.txt", "utf8")
    .split("\n")
    .map(p => p.trim())
    .filter(Boolean);

products.forEach(product => {
    const fileName =
        product.toLowerCase().replace(/[^a-z0-9]/g, "_") + ".jpg";

    console.log(fileName);
});