const mongoose = require("mongoose");
const dbName = "Estudiantes";

const connectDb = () => mongoose.connect(`mongodb://localhost:27019/${dbName}`);
module.exports = connectDb;
