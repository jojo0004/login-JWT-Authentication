

const express = require('express')
const app = express()
var routes = require("./routes/user");
const PORT = process.env.PORT || 3000
app.use(express.json())

app.use("/", express.static("./"));
app.use("/", routes);



app.listen(PORT, () => {
  console.log("Server is running..");
});




