const userAuthRoute = require("./userAuthRoute");
const userRoute = require("./userRoute");
const artistAuthRoute = require("./artistAuthRoute");
const artistRoute = require("./artistRoute");
const adminRoute = require("./adminRoute");
const categoryRoute = require("./categoryRoute");
const styleRoute = require("./styleRoute");
const subjectRoute = require("./subjectRoute");
const productRoute = require("./productRoute");

const mountRoutes = (app) => {
    app.use("/api/v1/userAuth", userAuthRoute);
    app.use("/api/v1/users", userRoute);
    app.use("/api/v1/artistAuth", artistAuthRoute);
    app.use("/api/v1/artists", artistRoute);
    app.use("/api/v1/admins", adminRoute);
    app.use("/api/v1/categories", categoryRoute);
    app.use("/api/v1/styles", styleRoute);
    app.use("/api/v1/subjects", subjectRoute);
    app.use("/api/v1/products", productRoute);
}

module.exports = mountRoutes;