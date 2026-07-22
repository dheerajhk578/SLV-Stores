const API_URL = "http://localhost:5000";

/* ===========================
   PRODUCTS
=========================== */

async function getProducts() {

    try {

        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        return await response.json();

    }
    catch (error) {

        console.error(error);

        return [];

    }

}

async function getProduct(id) {

    try {

        const response = await fetch(`${API_URL}/products/${id}`);

        return await response.json();

    }
    catch (error) {

        console.error(error);

        return null;

    }

}

/* ===========================
   BILL
=========================== */

async function createBill(billData) {

    try {

        const response = await fetch(`${API_URL}/create-bill`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(billData)

        });

        return await response.json();

    }
    catch (error) {

        console.error(error);

    }

}

async function saveBillItems(items) {

    try {

        const response = await fetch(`${API_URL}/bill-items`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(items)

        });

        return await response.json();

    }
    catch (error) {

        console.error(error);

    }

}

/* ===========================
   STOCK
=========================== */

async function updateStock(items) {

    try {

        const response = await fetch(`${API_URL}/update-stock`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(items)

        });

        return await response.json();

    }
    catch (error) {

        console.error(error);

    }

}

/* ===========================
   REPORTS
=========================== */

async function getTodaySales() {

    const response =

        await fetch(`${API_URL}/today-sales`);

    return await response.json();

}

async function getTodayRevenue() {

    const response =

        await fetch(`${API_URL}/today-revenue`);

    return await response.json();

}

async function getRecentBills() {

    const response =

        await fetch(`${API_URL}/recent-bills`);

    return await response.json();

}

async function getTopProducts() {

    const response =

        await fetch(`${API_URL}/top-products`);

    return await response.json();

}

/* ===========================
   CUSTOMERS
=========================== */

async function getCustomers() {

    const response =

        await fetch(`${API_URL}/customers`);

    return await response.json();

}

async function getCustomerHistory(phone) {

    const response =

        await fetch(

            `${API_URL}/customer-history/${phone}`

        );

    return await response.json();

}
