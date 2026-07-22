require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("./db");

const app = express();

const PORT = process.env.PORT || 5000;

/* ==========================================
   MIDDLEWARE
========================================== */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ==========================================
   CREATE UPLOAD FOLDER
========================================== */

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {

    fs.mkdirSync(uploadDir);

}

/* ==========================================
   MULTER CONFIGURATION
========================================== */

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, uploadDir);

    },

    filename(req, file, cb) {

        const ext = path.extname(file.originalname);

        const name =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            ext;

        cb(null, name);

    }

});

const upload = multer({

    storage,

    limits: {

        fileSize: 5 * 1024 * 1024

    }

});

/* ==========================================
   HOME
========================================== */

app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "SLV Stores Backend Running"

    });

});

/* ==========================================
   IMAGE UPLOAD
========================================== */

app.post(

    "/upload",

    upload.single("image"),

    (req, res) => {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "No image uploaded"

            });

        }

        res.json({

            success: true,

            filename: req.file.filename,

            image_url:
                `/uploads/${req.file.filename}`

        });

    }

);

/* ==========================================
   PRODUCT APIs
========================================== */
/* ==========================================
   GET ALL PRODUCTS
========================================== */

app.get("/products", (req, res) => {

    const sql =
        `SELECT *
         FROM products
         ORDER BY product_name`;

    db.query(sql, (err, rows) => {

        if (err) {

            return res.status(500).json({

                success: false,

                message: "Failed to load products",

                error: err

            });

        }

        res.json(rows);

    });

});

/* ==========================================
   GET PRODUCT BY ID
========================================== */

app.get("/products/:id", (req, res) => {

    const sql =
        `SELECT *
         FROM products
         WHERE id=?`;

    db.query(

        sql,

        [req.params.id],

        (err, rows) => {

            if (err) {

                return res.status(500).json(err);

            }

            if (rows.length === 0) {

                return res.status(404).json({

                    success: false,

                    message: "Product not found"

                });

            }

            res.json(rows[0]);

        }

    );

});

/* ==========================================
   ADD PRODUCT
========================================== */

app.post("/products", (req, res) => {

    const {

        main_category,
        sub_category,
        product_type,
        brand,
        product_name,
        variant_name,
        mode,
        pack_size,
        bag_25kg_price,
        bag_10kg_price,
        loose_price,
        cost_price,
        retail_price,
        wholesale_price,
        stock_quantity,
        unit,
        description,
        product_image

    } = req.body;

    const sql =

`INSERT INTO products
(
main_category,
sub_category,
product_type,
brand,
product_name,
variant_name,
mode,
pack_size,
bag_25kg_price,
bag_10kg_price,
loose_price,
cost_price,
retail_price,
wholesale_price,
stock_quantity,
unit,
description,
product_image
)
VALUES
(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    db.query(

        sql,

        [

            main_category,
            sub_category,
            product_type,
            brand,
            product_name,
            variant_name,
            mode,
            pack_size,
            bag_25kg_price,
            bag_10kg_price,
            loose_price,
            cost_price,
            retail_price,
            wholesale_price,
            stock_quantity,
            unit,
            description,
            product_image

        ],
                (err, result) => {

            if (err) {

                return res.status(500).json({

                    success: false,

                    message: "Failed to add product",

                    error: err

                });

            }

            res.json({

                success: true,

                message: "Product added successfully",

                product_id: result.insertId

            });

        }

    );

});

/* ==========================================
   UPDATE PRODUCT
========================================== */

app.put("/products/:id", (req, res) => {

    const id = req.params.id;

    const {

        main_category,
        sub_category,
        product_type,
        brand,
        product_name,
        variant_name,
        mode,
        pack_size,
        bag_25kg_price,
        bag_10kg_price,
        loose_price,
        cost_price,
        retail_price,
        wholesale_price,
        stock_quantity,
        unit,
        description,
        product_image

    } = req.body;

    const sql =

`UPDATE products SET

main_category=?,
sub_category=?,
product_type=?,
brand=?,
product_name=?,
variant_name=?,
mode=?,
pack_size=?,
bag_25kg_price=?,
bag_10kg_price=?,
loose_price=?,
cost_price=?,
retail_price=?,
wholesale_price=?,
stock_quantity=?,
unit=?,
description=?,
product_image=?

WHERE id=?`;

    db.query(

        sql,

        [

            main_category,
            sub_category,
            product_type,
            brand,
            product_name,
            variant_name,
            mode,
            pack_size,
            bag_25kg_price,
            bag_10kg_price,
            loose_price,
            cost_price,
            retail_price,
            wholesale_price,
            stock_quantity,
            unit,
            description,
            product_image,
            id

        ],
                (err) => {

            if (err) {

                return res.status(500).json({

                    success: false,

                    message: "Failed to update product",

                    error: err

                });

            }

            res.json({

                success: true,

                message: "Product updated successfully"

            });

        }

    );

});

/* ==========================================
   DELETE PRODUCT
========================================== */

app.delete("/products/:id", (req, res) => {

    const sql =
        `DELETE
         FROM products
         WHERE id=?`;

    db.query(

        sql,

        [req.params.id],

        (err) => {

            if (err) {

                return res.status(500).json({

                    success: false,

                    message: "Failed to delete product",

                    error: err

                });

            }

            res.json({

                success: true,

                message: "Product deleted successfully"

            });

        }

    );

});

/* ==========================================
   STOCK IN
========================================== */

app.post("/stock-in", (req, res) => {

    const {

        product_id,
        quantity,
        supplier,
        purchase_date

    } = req.body;

    db.query(

        `SELECT
            product_name,
            stock_quantity
         FROM products
         WHERE id=?`,

        [product_id],

        (err, rows) => {

            if (err || rows.length === 0) {

                return res.status(500).json({

                    success: false,

                    message: "Product not found"

                });

            }

            const oldStock =
                Number(rows[0].stock_quantity);

            const newStock =
                oldStock + Number(quantity);

            db.query(

                `UPDATE products
                 SET stock_quantity=?
                 WHERE id=?`,

                [

                    newStock,
                    product_id

                ],

                (updateErr) => {

                    if (updateErr) {

                        return res.status(500).json(updateErr);

                    }
                                        db.query(

                        `INSERT INTO stock_history
                        (
                            product_id,
                            product_name,
                            supplier,
                            quantity_added,
                            old_stock,
                            new_stock,
                            purchase_date
                        )
                        VALUES(?,?,?,?,?,?,?)`,

                        [

                            product_id,
                            rows[0].product_name,
                            supplier || "",
                            quantity,
                            oldStock,
                            newStock,
                            purchase_date || null

                        ],

                        (historyErr) => {

                            if (historyErr) {

                                return res.status(500).json(historyErr);

                            }

                            res.json({

                                success: true,

                                message: "Stock added successfully"

                            });

                        }

                    );

                }

            );

        }

    );

});

/* ==========================================
   STOCK HISTORY
========================================== */

app.get("/stock-history", (req, res) => {

    const sql =

`SELECT
stock_history.*,
products.product_image
FROM stock_history
LEFT JOIN products
ON stock_history.product_id = products.id
ORDER BY stock_history.id DESC`;

    db.query(

        sql,

        (err, rows) => {

            if (err) {

                return res.status(500).json({

                    success: false,

                    error: err

                });

            }

            res.json(rows);

        }

    );

});

/* ==========================================
   ORDER APIs
========================================== */
/* ==========================================
   CREATE ORDER
========================================== */

app.post("/orders", (req, res) => {

    const {

        customer_name,
        phone,
        address,
        order_details,
        grand_total

    } = req.body;

    const sql =

`INSERT INTO orders
(
customer_name,
phone,
address,
order_details,
grand_total,
status
)
VALUES
(?,?,?,?,?,'Pending')`;

    db.query(

        sql,

        [

            customer_name,
            phone,
            address,
            JSON.stringify(order_details),
            grand_total

        ],

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    success: false,

                    error: err

                });

            }

            res.json({

                success: true,

                order_id: result.insertId,

                message: "Order placed successfully"

            });

        }

    );

});

/* ==========================================
   GET ALL ORDERS
========================================== */

app.get("/orders", (req, res) => {

    db.query(

        `SELECT *
         FROM orders
         ORDER BY id DESC`,

        (err, rows) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json(rows);

        }

    );

});

/* ==========================================
   GET CUSTOMER ORDERS
========================================== */

app.get("/orders/:phone", (req, res) => {

    db.query(

        `SELECT *
         FROM orders
         WHERE phone=?
         ORDER BY id DESC`,

        [req.params.phone],

        (err, rows) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json(rows);

        }

    );

});
app.put("/orders/:id",(req,res)=>{

const {status}=req.body;

const {id}=req.params;

const sql=
"UPDATE orders SET status=? WHERE id=?";

db.query(

sql,

[status,id],

(err)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json({

message:
"Status Updated"

});

}

);

});
/* ==========================================
   UPDATE ORDER STATUS
========================================== */
app.delete("/orders/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM orders WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        res.json({
            success: true
        });

    });

});
app.put("/orders/:id", (req, res) => {

    const {

        status

    } = req.body;

    db.query(

        `UPDATE orders
         SET status=?
         WHERE id=?`,

        [

            status,
            req.params.id

        ],

        (err) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json({

                success: true,

                message: "Order status updated"

            });

        }

    );

});

/* ==========================================
   DASHBOARD APIs
========================================== */
/* ==========================================
   DASHBOARD STATISTICS
========================================== */

app.get("/dashboard-stats", (req, res) => {

    const sql =

`SELECT

(SELECT COUNT(*) FROM products) AS total_products,

(SELECT IFNULL(SUM(stock_quantity),0)
FROM products) AS total_stock,

(SELECT IFNULL(
SUM(retail_price * stock_quantity),0)
FROM products) AS inventory_value,

(SELECT COUNT(*) FROM orders)
AS total_orders,

(SELECT COUNT(*)
FROM orders
WHERE status='Pending')
AS pending_orders,

(SELECT COUNT(*)
FROM orders
WHERE status='Delivered')
AS delivered_orders,

(SELECT IFNULL(
SUM(grand_total),0)
FROM orders)
AS total_revenue`;

    db.query(

        sql,

        (err, rows) => {

            if (err) {

                return res.status(500).json({

                    success:false,

                    error:err

                });

            }

            res.json(rows[0]);

        }

    );

});

/* ==========================================
   ANALYTICS
========================================== */

app.get("/analytics", (req, res) => {

    const sql =

`SELECT

(SELECT IFNULL(SUM(grand_total),0)
FROM orders)
AS total_revenue,

(SELECT COUNT(*)
FROM orders)
AS total_orders,

(SELECT COUNT(*)
FROM orders
WHERE status='Delivered')
AS delivered_orders,

(SELECT COUNT(*)
FROM orders
WHERE status='Pending')
AS pending_orders,

(SELECT IFNULL(
SUM(total_amount),0)
FROM bills
WHERE DATE(created_at)=CURDATE())
AS today_revenue,

(SELECT IFNULL(
SUM(total_amount),0)
FROM bills
WHERE MONTH(created_at)=MONTH(CURDATE())
AND YEAR(created_at)=YEAR(CURDATE()))
AS monthly_revenue`;

    db.query(

        sql,

        (err, rows) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json(rows[0]);

        }

    );

});

/* ==========================================
   SALES REPORT APIs
========================================== */
/* ==========================================
   SALES REPORT
========================================== */

app.get("/sales-report", (req, res) => {

    const sql =

`SELECT

(SELECT COUNT(*) FROM bills)
AS total_bills,

(SELECT IFNULL(SUM(total_amount),0)
FROM bills)
AS total_revenue,

(SELECT COUNT(*)
FROM orders
WHERE status='Pending')
AS pending_orders,

(SELECT COUNT(*)
FROM orders
WHERE status='Delivered')
AS delivered_orders`;

    db.query(sql, (err, rows) => {

        if (err) {

            return res.status(500).json(err);

        }

        res.json(rows[0]);

    });

});

/* ==========================================
   RECENT BILLS
========================================== */

app.get("/recent-bills", (req, res) => {

    db.query(

        `SELECT *
         FROM bills
         ORDER BY created_at DESC
         LIMIT 10`,

        (err, rows) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json(rows);

        }

    );

});

/* ==========================================
   TOP SELLING PRODUCTS
========================================== */

app.get("/top-products", (req, res) => {

    db.query(

        `SELECT
            product_name,
            SUM(quantity) AS total_qty
         FROM bill_items
         GROUP BY product_name
         ORDER BY total_qty DESC
         LIMIT 10`,

        (err, rows) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json(rows);

        }

    );

});

/* ==========================================
   TODAY REVENUE
========================================== */

app.get("/today-revenue", (req, res) => {

    db.query(

        `SELECT
            IFNULL(SUM(total_amount),0)
            AS revenue
         FROM bills
         WHERE DATE(created_at)=CURDATE()`,

        (err, rows) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json(rows[0]);

        }

    );

});

/* ==========================================
   MONTHLY REVENUE
========================================== */
/* ==========================================
   MONTHLY REVENUE
========================================== */

app.get("/monthly-revenue", (req, res) => {

    db.query(

        `SELECT
            IFNULL(SUM(total_amount),0)
            AS revenue
         FROM bills
         WHERE MONTH(created_at)=MONTH(CURDATE())
         AND YEAR(created_at)=YEAR(CURDATE())`,

        (err, rows) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json(rows[0]);

        }

    );

});

/* ==========================================
   LOW STOCK
========================================== */

app.get("/low-stock", (req, res) => {

    db.query(

        `SELECT *
         FROM products
         WHERE stock_quantity < 20
         ORDER BY stock_quantity ASC`,

        (err, rows) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json(rows);

        }

    );

});

/* ==========================================
   CUSTOMER HISTORY
========================================== */

app.get("/customer-history/:phone", (req, res) => {

    db.query(

        `SELECT
            invoice_number,
            total_amount,
            created_at
         FROM bills
         WHERE customer_phone=?
         ORDER BY created_at DESC`,

        [req.params.phone],

        (err, rows) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json(rows);

        }

    );

});
/* ==========================================
   ADMIN LOGIN
========================================== */

app.post("/admin-login", (req, res) => {

    const {

        username,
        password

    } = req.body;

    const sql =

    `SELECT *
     FROM admin_users
     WHERE username=? AND password=?`;

    db.query(

        sql,

        [

            username,
            password

        ],

        (err, rows) => {

            if (err) {

                return res.status(500).json({

                    success:false,

                    message:"Database Error"

                });

            }

            if(rows.length===0){

                return res.json({

                    success:false,

                    message:"Invalid Username or Password"

                });

            }

            res.json({

                success:true,

                message:"Login Successful",

                admin:rows[0]

            });

        }

    );

});
/* ==========================================
   GENERATE BILL
========================================== */

app.post("/generate-bill", (req, res) => {

    const {

        invoice_number,
        customer_name,
        customer_phone,
        billing_mode,
        total_amount,
        items

    } = req.body;

    const sql =

`INSERT INTO bills
(
invoice_number,
customer_name,
customer_phone,
billing_mode,
total_amount
)
VALUES
(?,?,?,?,?)`;

    db.query(

        sql,

        [

            invoice_number,
            customer_name,
            customer_phone,
            billing_mode,
            total_amount

        ],

        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({

                    success:false,

                    message:"Failed to save bill"

                });

            }

           // const billId = result.insertId;

            if(!items || items.length===0){

                return res.json({

                    success:true

                });

            }

            const values = items.map(item => [

    invoice_number,

    item.id,

    item.product,

    item.quantity,

    item.price,

    item.total

]);

            db.query(

                `INSERT INTO bill_items
(
invoice_number,
product_id,
product_name,
quantity,
price,
total
)
VALUES ?`,

                [values],

                (err2)=>{

                    if(err2){

                        console.log(err2);

                        return res.status(500).json({

                            success:false,

                            message:"Bill saved but items failed"

                        });

                    }

                    res.json({

                        success:true,

                        message:"Bill Generated"

                    });

                }

            );

        }

    );

});
/* ==========================================
   SERVER
========================================== */

app.listen(PORT, () => {

    console.log(

        `🚀 SLV Stores Server Running On Port ${PORT}`

    );

});