const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/authRoute");

require("dotenv").config();

const app = express();

//1) Middlewares
app.use(cors());
app.use(express.json());

//2) Route
app.use("/api/auth", authRouter);

//3)MONGO DB CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERROR", err));
app.use(cors({ origin: true, credentials: true }));

const port = process.env.PORT || 4000;
const backend = app.listen(port, () =>
  console.log(`server is running ${port}`)
);
