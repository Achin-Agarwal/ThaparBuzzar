import express from 'express';
import connectMongo from './config/db.js';
import config from './config/config.js';
// import responseHandler from './middlewares/responseHandler.js';
import cors from 'cors';
import path from 'path';
//Auth0 imports
import { auth } from 'express-openid-connect';


const app = express();

// connectMongo();
//checkout populate or whatevr

// app.use((req, res, next) => {
//     console.log(req.headers);
//     console.log(req.url, req.method);
//     next();
// })

app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin || '*'); // Allow all origins
  },
  credentials: true, // Allow cookies to be sent
}));

// Auth0 configuration
const Auth0Config = {
  authRequired: false,
  auth0Logout: true,
  secret: config.Auth0.secret,
  baseURL: config.Auth0.baseURL,
  clientID: config.Auth0.clientID,
  issuerBaseURL: config.Auth0.issuerBaseURL,
  // routes: {
  //   callback: '/callback',
  //   postLoginRedirect: 'http://http://localhost:5173'
  // }
};

// Auth0 middleware
app.use(auth(Auth0Config));

// Logging middleware
// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`);
//   next();
// });

// Custom /callback route
// app.get('/callback', (req, res) => {
//   console.log("Callback route reached"); // Debugging log to ensure this route is triggered
//   res.redirect("http://localhost:5173");
// });

// /login route to initiate Auth0 login
// app.get('/login', (req, res) => {
//   console.log('Login route triggered, redirecting to Auth0...');
//   res.oidc.login({ returnTo: 'http://localhost:5173' });
// });

// / route to test authentication and log user info
app.get('/', (req, res) => {
  console.log(req.oidc.isAuthenticated());
  console.log("***********************************************req.oidc****************************************************");
  console.log(req.oidc.user);
  console.log(req.oidc.idToken);
  console.log(req.oidc.accessToken);
  console.log(req.oidc.refreshToken);
  console.log(req.oidc.isAuthenticated());
  res.redirect("http://localhost:5173");
  // res.send("Hello World");
});

// /profile route to check the logged-in user's profile
import pkg from 'express-openid-connect';
const { requiresAuth } = pkg;
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});

// Global error handler to catch any potential issues
app.use((err, req, res, next) => {
  console.error("Error encountered:", err);
  res.status(500).send('Something went wrong!');
});

// Routes
// import Vendor from './routes/vendor.js';
// app.use('/vendor', Vendor);


// Start the server
app.listen(config.server.port, () => {
  console.log(`Server running at http://localhost:${config.server.port}`);
});


