const mongoose = require("mongoose");

const connectDatabase = () => {

    console.log(process.env.DB_URI)
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then((data) => {
        console.log(`Mongodb connected with server: ${data.connect.host}`);
    })
        .catch((err) => {
            console.log(err);
        })
}


module.exports = connectDatabase