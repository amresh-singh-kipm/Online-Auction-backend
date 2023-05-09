require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 5050;

app.listen(PORT);
console.log(`server is running on PORT ${PORT}`);
const cors = require("cors");
const { connectDB } = require("./mongodb");
const auth = require("./routes/auth");
const product = require("./routes/product");
const admin = require("./routes/admin");
const buyer = require("./routes/buyer");

app.use(cors());

app.use(express.json());
connectDB();

console.log("SERVER IS RUNNING", PORT);

//AUTH ROUTER
app.use("/api", auth);
app.use("/api", product);
app.use("/api/admin", admin);
app.use("/api",buyer)
