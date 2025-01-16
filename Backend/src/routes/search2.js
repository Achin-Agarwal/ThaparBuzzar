import express from 'express';
import config from '../config/config.js';
import { safeHandler } from '../middleware/safeHandler.js';
import Product from '../models/product.js';
import { request } from 'urllib';

const ATLAS_API_BASE_URL = config.database.atlasBaseUrl;
// console.log("ATLAS_API_BASE_URL: ", ATLAS_API_BASE_URL);
const ATLAS_PROJECT_ID = config.database.atlasProjectId;
// console.log("ATLAS_PROJECT_ID: ", ATLAS_PROJECT_ID);
const ATLAS_CLUSTER_NAME = config.database.atlasCluster;
// console.log("ATLAS_CLUSTER_NAME: ", ATLAS_CLUSTER_NAME);
const ATLAS_API_PUBLIC_KEY = config.database.atlasApiPublicKey;
// console.log("ATLAS_API_PUBLIC_KEY: ", ATLAS_API_PUBLIC_KEY);
const ATLAS_API_PRIVATE_KEY = config.database.atlasApiPrivateKey;
// console.log("ATLAS_API_PRIVATE_KEY: ", ATLAS_API_PRIVATE_KEY);

const ATLAS_CLUSTER_API_URL = `${ATLAS_API_BASE_URL}/groups/${ATLAS_PROJECT_ID}/clusters/${ATLAS_CLUSTER_NAME}`
const ATLAS_SEARCH_INDEX_API_URL = `${ATLAS_CLUSTER_API_URL}/fts/indexes`
const DIGEST_AUTH = `${ATLAS_API_PUBLIC_KEY}:${ATLAS_API_PRIVATE_KEY}`

// Index names for search
const PRODUCT_SEARCH_INDEX_NAME = 'product_search';
const PRODUCT_AUTOCOMPLETE_INDEX_NAME = 'product_autocomplete';

const router = express.Router();

// Search route for product names
router.get('/', safeHandler(async (req, res) => {
    const searchQuery = req.query.query;

    if (!searchQuery || searchQuery.length < 2) {
        res.json([]);
        return;
    }

    const pipeline = [
        {
            $search: {
                index: PRODUCT_SEARCH_INDEX_NAME,
                text: {
                    query: searchQuery,
                    path: 'name', // Search within the 'name' field
                    fuzzy: {} // Enable fuzzy matching for minor typos
                }
            }
        },
        {
            $project: {
                _id: 1, // Exclude the _id field
                score: { $meta: 'searchScore' }, // Include the search relevance score
                name: 1,
                description: 1,
                price: 1,
                category: 1,
                image: 1,
                stock: 1
            }
        }
    ];

    const result = await Product.aggregate(pipeline).sort({ score: -1 }).limit(10); // Mongoose aggregates and returns an array
    res.json(result);
}));

// Autocomplete route for product names
router.get('/autocomplete', safeHandler(async (req, res) => {
    const searchQuery = req.query.query;

    if (!searchQuery || searchQuery.length < 2) {
        res.json([]);
        return;
    }

    const pipeline = [
        {
            $search: {
                index: PRODUCT_AUTOCOMPLETE_INDEX_NAME,
                autocomplete: {
                    query: searchQuery,
                    path: 'name',
                    tokenOrder: 'sequential' // Token order for sequential matching
                }
            }
        },
        {
            $project: {
                _id: 0,
                score: { $meta: 'searchScore' },
                name: 1
                // description: 0,
                // price: 0,
                // category: 0,
                // image: 0,
                // stock: 0
            }
        }
    ];

    const result = await Product.aggregate(pipeline).sort({ score: -1 }).limit(10);
    res.json(result);
}));

export async function findIndexByName(indexName) {
    try {
        const allIndexesResponse = await request(
            `${ATLAS_SEARCH_INDEX_API_URL}/buzzar/products`,
            {
                dataType: 'json',
                contentType: 'application/json',
                method: 'GET',
                digestAuth: DIGEST_AUTH,
            }
        );

        return allIndexesResponse.data.find((i) => i.name === indexName);
    } catch (err) {
        console.log("error in findIndexByName", err);
    }
}

export async function upsertSearchIndex() {
    try {
        const productSearchIndex = await findIndexByName(PRODUCT_SEARCH_INDEX_NAME)
        if (!productSearchIndex) {
            await request(ATLAS_SEARCH_INDEX_API_URL, {
                data: {
                    name: PRODUCT_SEARCH_INDEX_NAME,
                    database: 'buzzar',
                    collectionName: 'products',
                    // https://www.mongodb.com/docs/atlas/atlas-search/index-definitions/#syntax
                    mappings: {
                        dynamic: true,
                    },
                },
                dataType: 'json',
                contentType: 'application/json',
                method: 'POST',
                digestAuth: DIGEST_AUTH,
            })

        }
    } catch (err) {
        console.log("error in upsertSearchIndex", err);
    }
}

export async function upsertAutocompleteIndex() {
    try {
        const productAutocompleteIndex = await findIndexByName(PRODUCT_AUTOCOMPLETE_INDEX_NAME)
        if (!productAutocompleteIndex) {
            await request(ATLAS_SEARCH_INDEX_API_URL, {
                data: {
                    name: PRODUCT_AUTOCOMPLETE_INDEX_NAME,
                    database: 'buzzar',
                    collectionName: 'products',
                    // https://www.mongodb.com/docs/atlas/atlas-search/autocomplete/#index-definition
                    mappings: {
                        dynamic: false,
                        fields: {
                            name: [
                                {
                                    foldDiacritics: false,
                                    maxGrams: 7,
                                    minGrams: 3,
                                    tokenization: 'edgeGram',
                                    type: 'autocomplete',
                                },
                            ],
                        },
                    },
                },
                dataType: 'json',
                contentType: 'application/json',
                method: 'POST',
                digestAuth: DIGEST_AUTH,
            })
        }
    }
    catch (err) {
        console.log("error in upsertAutocompleteIndex", err);
    }
}
export default router;

