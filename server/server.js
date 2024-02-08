const express = require("express");
const cors = require("cors"); // Import the cors middleware
const app = express();
app.use(express.json());
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const port = process.env.PORT || 5000;

const usersRoute = require("./routes/usersRoute");
const productsRoute = require("./routes/productsRoute");
const bidsRoute = require("./routes/bidsRoute");
const notificationsRoute = require('./routes/notificationsRoute');

// Use the cors middleware to allow requests from all origins
app.use(cors());

app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);
app.use("/api/bids", bidsRoute);
app.use('/api/notifications', notificationsRoute);

// deployment config
const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/Client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "Client", "dist", "index.html"));
  });
}


app.listen(port, () =>
  console.log(`Node/Express Server started on port ${port}`)
);