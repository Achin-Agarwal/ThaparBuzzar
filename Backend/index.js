const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const emailRoutes = require("./routes/emailRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/", emailRoutes);
app.use("/", fileRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
