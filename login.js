/* ==========================================
   PASSWORD TOGGLE
========================================== */

function togglePassword() {

    const password =
        document.getElementById("password");

    password.type =
        password.type === "password"
        ? "text"
        : "password";

}

/* ==========================================
   ADMIN LOGIN
========================================== */

async function login() {

    const button =
        document.querySelector(".login-btn");

    const userid =
        document.getElementById("userid")
        .value
        .trim();

    const password =
        document.getElementById("password")
        .value
        .trim();

    if (userid === "" || password === "") {

        alert("Please enter User ID and Password");

        return;

    }

    button.disabled = true;
    button.innerHTML = "Logging In...";

    try {

        const response = await fetch(

            "http://localhost:5000/admin-login",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    username: userid,

                    password: password

                })

            }

        );

        const result = await response.json();

        if (result.success) {

            sessionStorage.setItem(

                "loggedIn",

                "true"

            );

            if (

                document.getElementById("rememberMe")?.checked

            ) {

                localStorage.setItem(

                    "rememberAdmin",

                    userid

                );

            }

            button.innerHTML =
                "Login Successful";

            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 500);

        }

        else {

            alert(result.message);

            button.disabled = false;

            button.innerHTML =
                "🔐 LOGIN";

        }

    }

    catch (error) {

        console.error(error);

        alert("Unable to connect to server.");

        button.disabled = false;

        button.innerHTML =
            "🔐 LOGIN";

    }

}

/* ==========================================
   SEND OTP
========================================== */

function sendOTP() {

    const mobile =
        document.getElementById("mobile")
        .value
        .trim();

    if (!/^[6-9]\d{9}$/.test(mobile)) {

        alert(

            "Please enter a valid 10-digit mobile number."

        );

        return;

    }

    localStorage.setItem(

        "demoOTP",

        "1234"

    );

    alert(

        "Demo OTP : 1234"

    );

}

/* ==========================================
   VERIFY OTP
========================================== */

function verifyOTP() {

    const mobile =
        document.getElementById("mobile")
        .value
        .trim();

    const otp =
        document.getElementById("otp")
        .value
        .trim();

    const savedOTP =
        localStorage.getItem("demoOTP");

    if (otp !== savedOTP) {

        alert("Invalid OTP");

        return;

    }

    const customer = {

        phone: mobile

    };

    localStorage.setItem(

        "customer",

        JSON.stringify(customer)

    );

    localStorage.setItem(

        "customerPhone",

        mobile

    );

    alert(

        "Customer Login Successful"

    );

    window.location.href =
        "customer-home.html";

}

/* ==========================================
   AUTO FOCUS
========================================== */

window.addEventListener("load", () => {

    document.getElementById("userid").focus();

    const remembered =
        localStorage.getItem("rememberAdmin");

    if (remembered) {

        document.getElementById("userid").value =
            remembered;

        const remember =
            document.getElementById("rememberMe");

        if (remember) {

            remember.checked = true;

        }

    }

});