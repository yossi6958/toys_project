const indexR = require("./index")
const userR = require("./users")
const productR = require("./toys")

exports.routes = (app) => {
    app.use("/" , indexR);
    app.use("/users" , userR);
    app.use("/toys" , productR);
}