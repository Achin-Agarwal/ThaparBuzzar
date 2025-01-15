import dotenv from 'dotenv';
dotenv.config();


// console.log('Environment Variables:', process.env);

const config = {
    server: {
        port: process.env.PORT || 3000,
    },
    database: {
        uri: process.env.MONGO_URI,
        atlasBaseUrl: process.env.MONGO_ATLAS_API_BASE_URL, // Atlas API base URL
        atlasProjectId: process.env.MONGO_ATLAS_Project_ID, // Atlas project ID
        atlasCluster: process.env.MONGO_ATLAS_CLUSTER, // Cluster name
        atlasApiPublicKey: process.env.MONGO_ATLAS_API_PUBLIC_KEY, // Public API key
        atlasApiPrivateKey: process.env.MONGO_ATLAS_API_PRIVATE_KEY, // Private API key

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
            paymentConfirmation: 'images/paymentConfirmations',
            productImages: 'images/productImages'
        },
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        timeout: process.env.JWT_TIMEOUT,
    },

};

export default config;