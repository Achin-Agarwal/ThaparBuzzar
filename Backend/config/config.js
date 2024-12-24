import dotenv from 'dotenv';
dotenv.config();

const config = {
    server: {
        port: process.env.PORT || 3000,
    },
    database: {
        url: process.env.MONGO_URL,
    },
    Auth0: {
        secret: process.env.AUTH0_SECRET,
        baseURL: process.env.AUTH0_BASEURL,
        clientID: process.env.AUTH0_CLIENTID,
        issuerBaseURL: process.env.AUTH0_ISSUER_BASEURL,

    },
    paths: {
        images: {
            product: "images/products",
        },
    }

};

export default config;