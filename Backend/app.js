import express from 'express';
import connectMongo from './src/config/db.js';
import config from './src/config/config.js';
import responseHandler from './src/middleware/responseHandler.js';
import cors from 'cors';
import path from 'path';
//routes
import seller from './src/routes/seller.js';
import home from './src/routes/home.js';
import restpass from './src/routes/resetPassword.js';
import auth from './src/routes/auth.js';
import creteNewAccount from './src/routes/createNewAccount.js';
import admin from './src/routes/admin.js';
import buyer from './src/routes/buyer.js';
import search from './src/routes/search2.js';
import buynow from './src/routes/buynow.js';
import { upsertAutocompleteIndex, upsertSearchIndex } from './src/routes/search2.js';
// import printConfig from './src/routes/search.js';
const app = express();
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

connectMongo();
console.log("index setup");
await upsertSearchIndex()
await upsertAutocompleteIndex()
console.log("index setup done");


// this is used to see which routes are being hit
app.use((req, res, next) => {
  // console.log(req.headers);
  console.log(req.url, req.method, req.body);
  next();
})

app.use(responseHandler);
app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin || '*'); // Allow all origins
  },
  credentials: true
}));

app.get('/', (req, res) => {
  res.send("Hello World");
});

// routes
app.use("/createnewaccount", creteNewAccount);
app.use("/seller", seller);
app.use("/home", home);
app.use("/resetpassword", restpass);
app.use("/auth", auth);
app.use("/admin", admin);
app.use("/buyer", buyer);
app.use("/search", search);
app.use("/buynow", buynow);

//TEST OUT THIS ERROR JARGON FIRST
app.use((error, req, res, next) => {
  console.log(error); // temp log
  // if (error.errors && error.errors[0].message) {
  //     return res.error(400, error.errors[0].message, 'VALIDATION_ERROR');
  // }

  if (error.isOperational) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    return res.error(statusCode, message, error.errorCode, error.data);
  } else {
    //send email
    //log in a special way maybe
    console.error("ALERT ALERT ALERT");
    console.error('Unhandled error:', error);
    return res.error(500, 'Internal Server Error', 'UNHANDLED_ERROR');
  }
});

// Global error handler to catch any potential issues
app.use((err, req, res, next) => {
  console.error("Error encountered:", err);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(config.server.port, () => {
  console.log(`Server running at http://localhost:${config.server.port}`);
});


