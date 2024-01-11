const {join} = require("path")

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const dbConnection = require("./config/dbConnection.js");
const ApiError = require("./src/utils/apiError");
const globalErrorMiddleware = require("./src/middlewares/globalErrorMiddleware")
const userAuthRoute = require("./src/routes/userAuthRoute");
const userRoute = require("./src/routes/userRoute");
const artistAuthRoute = require("./src/routes/artistAuthRoute");
const artistRoute = require("./src/routes/artistRoute");
const adminRoute = require("./src/routes/adminRoute");
const categoryRoute = require("./src/routes/categoryRoute");
const styleRoute = require("./src/routes/styleRoute");
const subjectRoute = require("./src/routes/subjectRoute");

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
app.use("/api/v1/artistAuth", artistAuthRoute);
app.use("/api/v1/artists", artistRoute);
app.use("/api/v1/admins", adminRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/styles", styleRoute);
app.use("/api/v1/subjects", subjectRoute);

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