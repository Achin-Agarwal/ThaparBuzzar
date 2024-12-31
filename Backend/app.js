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

// app.use(cors({
//     origin: (origin, callback) => {
//         callback(null, origin || '*'); // Allow all origins
//     },
//     credentials: true, // Allow cookies to be sent
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(responseHandler);
// app.use(express.static(path.join(__dirname, 'public')));




// Auth0 configuration
const Auth0Config = {
    authRequired: false,
    auth0Logout: true,
    secret: config.Auth0.secret,
    baseURL: config.Auth0.baseURL,
    clientID: config.Auth0.clientID,
    issuerBaseURL: config.Auth0.issuerBaseURL
  };
//Auth0 middleware
app.use(auth(Auth0Config));

app.get('/login', (req, res) => {
  res.redirect('/login');
});

app.get('/callback', (req, res) => {
  // Redirect to React home page after login
  res.redirect("http://localhost:5173");
});
  app.get('/', (req, res) => {
    console.log(req.oidc.isAuthenticated());
console.log("***********************************************req.oidc****************************************************");
    console.log(req.oidc.user);
    console.log(req.oidc.idToken);
    console.log(req.oidc.accessToken);
    console.log(req.oidc.refreshToken);
    console.log(req.oidc.isAuthenticated());
    res.send("Hello World");
  });
  import pkg from 'express-openid-connect';
const { requiresAuth } = pkg; 
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});
 
app.listen(config.server.port, () => {
    console.log(`http://localhost:${config.server.port}`);
});