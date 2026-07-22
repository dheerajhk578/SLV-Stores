/* ==========================================
   SLV STORES BILLING SYSTEM
========================================== */

let products = [];

let filteredProducts = [];

let billItems = [];

let selectedProduct = null;

let billingMode = "Retail";

let invoiceNumber = "";

/* ==========================================
   INITIALIZE
========================================== */

window.addEventListener("load", () => {

    generateInvoice();

    updateDateTime();

    loadProducts();

    initializeEvents();

    setInterval(updateDateTime, 1000);

});

/* ==========================================
   GENERATE INVOICE
========================================== */

function generateInvoice() {

    invoiceNumber =
        "SLV" +
        Date.now();

    document.getElementById(
        "invoiceNumber"
    ).innerText =
        invoiceNumber;

}

/* ==========================================
   DATE & TIME
========================================== */

function updateDateTime() {

    const now =
        new Date();

    document.getElementById(
        "billDate"
    ).innerText =
        now.toLocaleDateString();

    document.getElementById(
        "billTime"
    ).innerText =
        now.toLocaleTimeString();

}

/* ==========================================
   EVENTS
========================================== */

function initializeEvents() {

    document
        .getElementById("productSearch")
        .addEventListener(
            "input",
            searchProducts
        );

    document
        .getElementById("plusBtn")
        .addEventListener(
            "click",
            increaseQuantity
        );

    document
        .getElementById("minusBtn")
        .addEventListener(
            "click",
            decreaseQuantity
        );

    document
        .getElementById("addItemBtn")
        .addEventListener(
            "click",
            addItemToBill
        );

    document
        .getElementById("generateBillBtn")
        .addEventListener(
            "click",
            generateBill
        );

    document
        .getElementById("printBillBtn")
        .addEventListener(
            "click",
            printBill
        );

    document
        .getElementById("newBillBtn")
        .addEventListener(
            "click",
            newBill
        );

}
/* ==========================================
   LOAD PRODUCTS
========================================== */

async function loadProducts() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/products"
            );

        products =
            await response.json();

        filteredProducts =
            [...products];

    }

    catch (error) {

        console.error(error);

        alert(
            "Failed to load products."
        );

    }

}

/* ==========================================
   SEARCH PRODUCTS
========================================== */

function searchProducts() {

    const keyword =
        document
        .getElementById(
            "productSearch"
        )
        .value
        .trim()
        .toLowerCase();

    const resultBox =
        document.getElementById(
            "searchResults"
        );

    if (keyword === "") {

        resultBox.innerHTML = "";

        resultBox.style.display = "none";

        return;

    }

    filteredProducts =
        products.filter(product => {

            return (

                product.product_name
                .toLowerCase()
                .includes(keyword)

                ||

                (product.brand || "")
                .toLowerCase()
                .includes(keyword)

                ||

                (product.variant_name || "")
                .toLowerCase()
                .includes(keyword)

            );

        });

    renderSearchResults();

}

/* ==========================================
   SEARCH RESULT LIST
========================================== */

function renderSearchResults() {

    const resultBox =
        document.getElementById(
            "searchResults"
        );

    if (filteredProducts.length === 0) {

        resultBox.innerHTML =

        `<div class="search-item">

            No Products Found

        </div>`;

        resultBox.style.display =
            "block";

        return;

    }

    let html = "";

    filteredProducts.forEach(product => {

        html += `

        <div
            class="search-item"
            onclick="selectProduct(${product.id})">

            <strong>

                ${product.product_name}

            </strong>

            <br>

            ${product.brand || "-"}

            |

            ${product.variant_name || ""}

        </div>

        `;

    });

    resultBox.innerHTML =
        html;

    resultBox.style.display =
        "block";

}
/* ==========================================
   SELECT PRODUCT
========================================== */

function selectProduct(id) {

    selectedProduct =
        products.find(
            product => product.id == id
        );

    if (!selectedProduct)
        return;

    document.getElementById(
        "productName"
    ).value =
        selectedProduct.product_name;

    document.getElementById(
        "productBrand"
    ).value =
        selectedProduct.brand || "";

    document.getElementById(
        "productVariant"
    ).value =
        selectedProduct.variant_name || "";

    document.getElementById(
        "productUnit"
    ).value =
        selectedProduct.unit || "";

    document.getElementById(
        "retailPrice"
    ).value =
        Number(
            selectedProduct.retail_price
        ).toFixed(2);

    document.getElementById(
        "wholesalePrice"
    ).value =
        Number(
            selectedProduct.wholesale_price
        ).toFixed(2);

    if (billingMode === "Retail") {

        document.getElementById(
            "sellingPrice"
        ).value =
            Number(
                selectedProduct.retail_price
            ).toFixed(2);

    }

    else {

        document.getElementById(
            "sellingPrice"
        ).value =
            Number(
                selectedProduct.wholesale_price
            ).toFixed(2);

    }

    document.getElementById(
        "quantity"
    ).value = 1;

    document.getElementById(
        "productSearch"
    ).value =
        selectedProduct.product_name;

    document.getElementById(
        "searchResults"
    ).style.display =
        "none";

    document.getElementById(
        "quantity"
    ).focus();

}

/* ==========================================
   BILLING MODE
========================================== */

function changeBillingMode() {

    billingMode =
        document.querySelector(
            'input[name="billingMode"]:checked'
        ).value;

    if (!selectedProduct)
        return;

    if (billingMode === "Retail") {

        document.getElementById(
            "sellingPrice"
        ).value =
            Number(
                selectedProduct.retail_price
            ).toFixed(2);

    }

    else {

        document.getElementById(
            "sellingPrice"
        ).value =
            Number(
                selectedProduct.wholesale_price
            ).toFixed(2);

    }

}

/* ==========================================
   QUANTITY CONTROLS
========================================== */

function increaseQuantity() {

    const quantity =
        document.getElementById(
            "quantity"
        );

    let value =
        parseFloat(quantity.value) || 1;

    if (
        selectedProduct &&
        selectedProduct.mode === "loose"
    ) {

        value += 0.25;

    }

    else {

        value += 1;

    }

    quantity.value = value;

}

function decreaseQuantity() {

    const quantity =
        document.getElementById(
            "quantity"
        );

    let value =
        parseFloat(quantity.value) || 1;

    if (
        selectedProduct &&
        selectedProduct.mode === "loose"
    ) {

        value -= 0.25;

        if (value < 0.25)
            value = 0.25;

    }

    else {

        value -= 1;

        if (value < 1)
            value = 1;

    }

    quantity.value = value;

}

/* ==========================================
   ADD ITEM TO BILL
========================================== */

function addItemToBill() {

    if (!selectedProduct) {

        alert(
            "Please select a product."
        );

        return;

    }

    const quantity =
        parseFloat(
            document.getElementById(
                "quantity"
            ).value
        );

    const sellingPrice =
        parseFloat(
            document.getElementById(
                "sellingPrice"
            ).value
        );

    if (

        isNaN(quantity) ||

        quantity <= 0

    ) {

        alert(
            "Enter valid quantity."
        );

        return;

    }

    const total =
        quantity *
        sellingPrice;

    const existing =
        billItems.find(

            item =>

            item.id === selectedProduct.id

        );

    if (existing) {

        existing.quantity += quantity;

        existing.total =
            existing.quantity *
            existing.price;

    }

    else {

        billItems.push({

            id:
                selectedProduct.id,

            product:
                selectedProduct.product_name,

            brand:
                selectedProduct.brand,

            unit:
                selectedProduct.unit,

            quantity,

            price:
                sellingPrice,

            total

        });

    }

    renderBill();

}
/* ==========================================
   RENDER BILL
========================================== */

function renderBill() {

    const tbody = document.getElementById("billItems");

    if (billItems.length === 0) {

        tbody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align:center;padding:25px;">
                No Products Added
            </td>
        </tr>`;

        updateSummary();

        return;

    }

    let html = "";

    billItems.forEach((item,index)=>{

        html += `

        <tr>

            <td>${item.product}</td>

            <td>${item.brand || "-"}</td>

            <td>

                <input

                    type="number"

                    min="1"

                    value="${item.quantity}"

                    onchange="updateQuantity(${index},this.value)"

                    style="width:70px;text-align:center;">

            </td>

            <td>${item.unit || "-"}</td>

            <td>₹${item.price.toFixed(2)}</td>

            <td>₹${item.total.toFixed(2)}</td>

            <td>

                <button

                    class="remove-btn"

                    onclick="removeItem(${index})">

                    ✖

                </button>

            </td>

        </tr>

        `;

    });

    tbody.innerHTML = html;

    updateSummary();

}
function updateQuantity(index,value){

    value = parseFloat(value);

    if(isNaN(value) || value<=0){

        value=1;

    }

    billItems[index].quantity=value;

    billItems[index].total=

        value*billItems[index].price;

    renderBill();

}
/* ==========================================
   REMOVE ITEM
========================================== */

function removeItem(index) {

    billItems.splice(index, 1);

    renderBill();

}

/* ==========================================
   SUMMARY
========================================== */

function updateSummary() {

    let subTotal = 0;

    billItems.forEach(item => {

        subTotal += item.total;

    });

    document.getElementById(
        "itemCount"
    ).innerText =
        billItems.length;

    document.getElementById(
        "subTotal"
    ).innerText =
        "₹" +
        subTotal.toFixed(2);

    document.getElementById(
        "grandTotal"
    ).innerText =
        "₹" +
        subTotal.toFixed(2);

}
/* ==========================================
   GENERATE BILL
========================================== */

/* ==========================================
   GENERATE BILL
========================================== */

async function generateBill() {

    if (billItems.length === 0) {

        alert("Please add at least one product.");

        return;

    }

    const customerName =
        document.getElementById("customerName")
        .value
        .trim();

    const customerPhone =
        document.getElementById("customerPhone")
        .value
        .trim();

    if (customerName === "" || customerPhone === "") {

        alert("Please enter customer details.");

        return;

    }

    const grandTotal = billItems.reduce(

        (sum, item) => sum + item.total,

        0

    );

    const billData = {

        invoice_number: invoiceNumber,

        customer_name: customerName,

        customer_phone: customerPhone,

        billing_mode: billingMode,

        total_amount: grandTotal,

        items: billItems

    };

    const generateButton =
        document.getElementById("generateBillBtn");

    try {

        generateButton.disabled = true;

        generateButton.innerText = "Generating Bill...";

        const response = await fetch(

            "http://localhost:5000/generate-bill",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(billData)

            }

        );

        if (!response.ok) {

            throw new Error("Server Error");

        }

        const result = await response.json();

        if (!result.success) {

            throw new Error(

                result.message ||

                "Failed to generate bill."

            );

        }

        /* Save Bill Items */

        if (typeof saveBillItems === "function") {

            await saveBillItems({

                invoice_number: invoiceNumber,

                items: billItems

            });

        }

        /* Update Stock */

        if (typeof updateStock === "function") {

            await updateStock(billItems);

        }

        /* Load Invoice Preview */

        loadInvoicePreview();

        document.getElementById(
            "invoicePreview"
        ).style.display = "block";

        alert("Bill Generated Successfully.");

        generateButton.disabled = false;

        generateButton.innerText = "Generate Bill";

    }

    catch (error) {

        console.error(error);

        alert(

            error.message ||

            "Failed to generate bill."

        );

        generateButton.disabled = false;

        generateButton.innerText = "Generate Bill";

    }

}

/* ==========================================
   LOAD INVOICE PREVIEW
========================================== */

function loadInvoicePreview() {

    document.getElementById(
        "previewInvoiceNo"
    ).innerText =
        invoiceNumber;

    document.getElementById(
        "previewDate"
    ).innerText =
        document.getElementById(
            "billDate"
        ).innerText;

    document.getElementById(
        "previewTime"
    ).innerText =
        document.getElementById(
            "billTime"
        ).innerText;

    document.getElementById(
        "previewCustomer"
    ).innerText =
        document.getElementById(
            "customerName"
        ).value;

    document.getElementById(
        "previewPhone"
    ).innerText =
        document.getElementById(
            "customerPhone"
        ).value;
    let previewHtml = "";

    billItems.forEach(item => {

        previewHtml += `

        <tr>

            <td>

                ${item.product}

            </td>

            <td>

                ${item.quantity}

            </td>

            <td>

                ₹${item.price.toFixed(2)}

            </td>

            <td>

                ₹${item.total.toFixed(2)}

            </td>

        </tr>

        `;

    });

    document.getElementById(
        "previewItems"
    ).innerHTML =
        previewHtml;

    const grandTotal =
        billItems.reduce(
            (sum, item) => sum + item.total,
            0
        );

    document.getElementById(
        "previewGrandTotal"
    ).innerText =
        "₹" +
        grandTotal.toFixed(2);

}

/* ==========================================
   PRINT BILL
========================================== */

function printBill() {

    let rows = "";

    billItems.forEach(item => {

        rows += `
        <tr>
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>₹${item.total.toFixed(2)}</td>
        </tr>`;
    });

    const grandTotal =
        billItems.reduce((sum, item) => sum + item.total, 0);

    const receipt = `
<!DOCTYPE html>
<html>

<head>

<title>Receipt</title>

<style>

@page{
    size:80mm auto;
    margin:2mm;
}

body{
    width:80mm;
    margin:0;
    padding:5px;
    font-family:Arial,sans-serif;
    color:#000;
}

h2{
    text-align:center;
    margin:3px 0;
    font-size:18px;
}

p{
    text-align:center;
    margin:2px 0;
    font-size:11px;
}

hr{
    border:none;
    border-top:1px dashed #000;
    margin:6px 0;
}

table{
    width:100%;
    border-collapse:collapse;
    font-size:11px;
}

th{
    border-bottom:1px solid #000;
    padding:4px;
}

td{
    padding:4px;
}

.total{
    text-align:right;
    font-size:16px;
    font-weight:bold;
    margin-top:10px;
}

.footer{
    text-align:center;
    margin-top:12px;
    font-size:11px;
}

</style>

</head>

<body>

<h2>SLV PROVISION STORE</h2>

<p>Turuvekere, Karnataka</p>

<hr>

<p>Invoice : ${invoiceNumber}</p>

<p>Date : ${document.getElementById("billDate").innerText}</p>

<p>Time : ${document.getElementById("billTime").innerText}</p>

<p>Customer : ${document.getElementById("customerName").value}</p>

<p>Phone : ${document.getElementById("customerPhone").value}</p>

<hr>

<table>

<thead>

<tr>

<th>Item</th>

<th>Qty</th>

<th>Rate</th>

<th>Total</th>

</tr>

</thead>

<tbody>

${rows}

</tbody>

</table>

<hr>

<div class="total">

Grand Total : ₹${grandTotal.toFixed(2)}

</div>

<div class="footer">

Thank You<br>

Visit Again

</div>

</body>

</html>`;

    const win = window.open("", "_blank");

    win.document.write(receipt);

    win.document.close();

    win.focus();

    setTimeout(() => {

        win.print();

        win.close();

    }, 500);

}
/* ==========================================
   WHATSAPP BILL
========================================== */

function sendWhatsAppBill() {

    const customerPhone =
        document.getElementById(
            "customerPhone"
        ).value.trim();

    if (customerPhone === "") {

        alert(
            "Enter customer mobile number."
        );

        return;

    }

    let message =

`*SLV PROVISION STORE*
Invoice : ${invoiceNumber}

Customer : ${document.getElementById("customerName").value}

--------------------------------
`;

    billItems.forEach(item => {

        message +=

`${item.product}
Qty : ${item.quantity}
Price : ₹${item.price}
Total : ₹${item.total}

`;

    });

    const grandTotal =
        billItems.reduce(
            (sum, item) => sum + item.total,
            0
        );

    message +=

`------------------------------
Grand Total : ₹${grandTotal.toFixed(2)}

Thank You
Visit Again`;

    window.open(

        `https://wa.me/91${customerPhone}?text=${encodeURIComponent(message)}`,

        "_blank"

    );

}

/* ==========================================
   NEW BILL
========================================== */

function newBill() {

    if (

        !confirm(

            "Start a new bill?"

        )

    ) {

        return;

    }

    billItems = [];

    selectedProduct = null;

    document.getElementById(
        "productForm"
    )?.reset?.();

    document.getElementById(
        "customerName"
    ).value = "";

    document.getElementById(
        "customerPhone"
    ).value = "";

    document.getElementById(
        "billItems"
    ).innerHTML = "";

    renderBill();

    generateInvoice();

}
/* ==========================================
   CUSTOMER HISTORY
========================================== */

async function loadCustomerHistory() {

    const phone =
        document.getElementById(
            "customerPhone"
        ).value.trim();

    if (phone === "") {

        return;

    }

    try {

        const response =
            await fetch(

                `http://localhost:5000/customer-history/${phone}`

            );

        const history =
            await response.json();

        let totalBills = history.length;

        let totalPurchase = 0;

        let lastPurchase = "--";

        history.forEach(bill => {

            totalPurchase +=
                Number(
                    bill.total_amount || 0
                );

        });

        if (history.length > 0) {

            lastPurchase =
                new Date(
                    history[0].created_at
                ).toLocaleDateString();

        }

        document.getElementById(
            "totalBills"
        ).innerText =
            totalBills;

        document.getElementById(
            "totalPurchase"
        ).innerText =
            "₹" +
            totalPurchase.toFixed(2);

        document.getElementById(
            "lastPurchase"
        ).innerText =
            lastPurchase;

        let html = "";

        history.forEach(bill => {

            html += `

            <div class="history-item">

                <b>

                ${bill.invoice_number}

                </b>

                <br>

                ₹${Number(
                    bill.total_amount
                ).toFixed(2)}

                <br>

                ${new Date(
                    bill.created_at
                ).toLocaleString()}

            </div>

            `;

        });

        document.getElementById(
            "customerHistory"
        ).innerHTML =

        html ||

        "<p>No Purchase History</p>";

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================
   AUTO LOAD CUSTOMER HISTORY
========================================== */

document.getElementById(

    "customerPhone"

).addEventListener(

    "change",

    loadCustomerHistory

);

/* ==========================================
   KEYBOARD SHORTCUTS
========================================== */

document.addEventListener(

    "keydown",

    function(event) {

        if (

            event.key === "F2"

        ) {

            event.preventDefault();

            generateBill();

        }

        if (

            event.key === "F4"

        ) {

            event.preventDefault();

            printBill();

        }

        if (

            event.key === "F6"

        ) {

            event.preventDefault();

            newBill();

        }

    }

);

/* ==========================================
   END OF BILLING.JS
========================================== */