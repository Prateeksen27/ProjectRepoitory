import express from 'express'
import bodyParser from "body-parser";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import dotenv from "dotenv";
import path from "path";
import initializePassport from "./config/passport.js";
import userRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
const app = express()
const port = 3001
dotenv.config();

// ES Module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static('public'))
app.set("view engine", "ejs"); // Set EJS as the template engine

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
      secret: "TOPSECRETWORD",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60*24,
      }
  }
)
);
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use("/", userRoutes);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});