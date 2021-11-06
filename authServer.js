
const express = require('express')
const cors = require('cors');
const app = express()
var routes = require("./routes/user");
const loansRoutes = require('./routes/loans_route');
const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json())

app.use("/", express.static("./"));
app.use("/", routes);
app.use('/loans', loansRoutes);

app.listen(PORT, () => {
  console.log("Server is running..");
});
