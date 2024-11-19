require("dotenv").config();

// Importing modules
const mongoose              = require("mongoose");

// Destructuring env variables
const { 
    DB_USERNAME, 
    DB_NAME, 
    DB_PASSWORD, 
    DB_HOST 
}                           = process.env;

// DB connection string
const url                   = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

// DB connection with mongodb
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.info("MONGODB CONNECTED SUCCESSFULLY..."))
  .catch((err) => console.error(err));