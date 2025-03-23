
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const paymentRoutes = require("./routes/paymentRoutes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// ✅ Debugging - Print all routes
app._router.stack.forEach(function(r) {
    if (r.route && r.route.path) {
        console.log(r.route.path);
    }
});


sequelize.sync().then(() => console.log("Database synced"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


