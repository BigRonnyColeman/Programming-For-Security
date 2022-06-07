const express = require("express");
const connectDB = require("./src/services/db");
const app = express();
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("./src/middleware/auth.js"); //USER AUTH/ACCESS CONTROL
const mongoSanitize = require('express-mongo-sanitize'); //NOSQL INJECTION SANITISATION
const helmet = require('helmet'); //XXS AND OTHER VULNS
var winston = require('winston'), //LOGGING
expressWinston = require('express-winston');//LOGGING
const rateLimit = require('express-rate-limit') //RATE LIMITING

require('dotenv').config();

const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

const PORT = process.env.port;

app.set("view engine", "ejs");

connectDB();

app.use(express.json());
app.use(cookieParser());

// By default, $ and . characters are removed completely from user-supplied input in the following places:
// - req.body
// - req.params
// - req.headers
// - req.query
app.use(mongoSanitize());

//Content Security (XXS)
//Strict Transport Security headers
//Clickjacking
app.use(helmet())

//HTTPS request Logging
app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({
      // Create the log directory if it does not exist
      filename: 'logs/example.log'
    })
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

//Rate Limiting
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 2 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: function (req, res, /*next*/) {
    return res.status(429).json({
      error: 'You sent too many requests. Please wait a while then try again'
    })
  }
})

app.use(limiter);

// Routes
app.use("/api/auth", require("./src/routes/route"));

//Error logging (has to be after routing)
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
}));

app.get("/", (req, res) => res.render("home"));
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.redirect("/");
});
app.get("/admin", adminAuth, (req, res) => res.render("admin"));
app.get("/basic", userAuth, (req, res) => res.render("user"));

const server = https
  .createServer(
    // Provide the private and public key to the server by reading each
    // file's content with the readFileSync() method.
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app)
  .listen(PORT, () =>
    console.log(`Server Connected to port ${PORT}`)
  );

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
