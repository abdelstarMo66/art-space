const {join} = require("path")

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

const dbConnection = require("./config/dbConnection.js");
const cloudinaryConnection = require("./config/cloudinaryConfig");
const ApiError = require("./src/utils/apiError");
const globalErrorMiddleware = require("./src/middlewares/globalErrorMiddleware")
const mountRoutes = require("./src/routes");
const {webhookCheckout} = require("./src/controllers/orderController");

dotenv.config({path: "config/config.env",});
dbConnection();
const app = express();

app.use(cors());
app.use(compression());

app.post("/webhook-checkout", express.raw({type: 'application/json'}), webhookCheckout);

app.use(express.json());
app.use(express.static(join(__dirname, "uploads")));

cloudinaryConnection();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

mountRoutes(app);

app.all("*", (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

app.use(globalErrorMiddleware);

const PORT = process.env.PORT || 4000
const server = app.listen(PORT, "localhost", () => {
    console.log(`App running on port ${PORT}`);
});

process.on("unhandledRejection", (error) => {
    console.error(`unhandledRejection Error: ${error.name} | ${error.message}`);
    server.close(() => {
        console.error(`shutting down...`);
        process.exit(1);
    });
});

module.exports = server