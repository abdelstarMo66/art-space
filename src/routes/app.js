const userAuthRoute = require("./userAuthRoute");
const userRoute = require("./userRoute");
const artistAuthRoute = require("./artistAuthRoute");
const artistRoute = require("./artistRoute");
const adminRoute = require("./adminRoute");
const categoryRoute = require("./categoryRoute");
const styleRoute = require("./styleRoute");
const subjectRoute = require("./subjectRoute");
const productRoute = require("./productRoute");
const eventRoute = require("./eventRoute");
const cartRoute = require("./cartRoute");
const searchRoute = require("./searchRoute");
const orderRoute = require("./orderRoute");
const complaintRoute = require("./complaintRoute");
const auctionRoute = require("./auctionRoute");
const registerAuctionRoute = require("./registerAuctionRoute")
const bookEventRoute = require("./bookEventRoute")
const reportRoute = require("./reportRoute");
const testRoute = require("../test/testRoute");

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
    app.use("/api/v1/events", eventRoute);
    app.use("/api/v1/cart", cartRoute);
    app.use("/api/v1/search", searchRoute);
    app.use("/api/v1/order", orderRoute);
    app.use("/api/v1/complaint", complaintRoute);
    app.use("/api/v1/auction", auctionRoute);
    app.use("/api/v1/registerAuction", registerAuctionRoute);
    app.use("/api/v1/bookEvent", bookEventRoute);
    app.use("/api/v1/reports", reportRoute);
    app.use("/api/v1/tests", testRoute);
}

module.exports = mountRoutes;