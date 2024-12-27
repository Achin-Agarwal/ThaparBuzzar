import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));

const redirectUri = import.meta.env.VITE_AUTH0_BASEURL;
console.log("Redirect URI:", redirectUri);

root.render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_ISSUER_BASEURL}
    clientId={import.meta.env.VITE_AUTH0_CLIENTID}
    authorizationParams={{
      redirect_uri: redirectUri,
    }}
  >
    <App />
  </Auth0Provider>
);
