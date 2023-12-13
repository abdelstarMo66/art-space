const {join} = require("path")

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const dbConnection = require("./config/dbConnection.js");
const ApiError = require("./src/utils/apiError");
const globalErrorMiddleware = require("./src/middlewares/globalErrorMiddleware")
const userAuthRoute = require("./src/routes/userAuthRoute");
const userRoute = require("./src/routes/userRoute");

dotenv.config({path: "config/config.env",});
dbConnection();
const app = express();

app.use(express.json());
app.use(express.static(join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use("/api/v1/userAuth", userAuthRoute);
app.use("/api/v1/users", userRoute);

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