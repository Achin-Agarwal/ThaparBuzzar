import express from 'express'
// import {request} from 'urllib'
import config from '../config/config.js'

 
const ATLAS_API_BASE_URL = config.database.atlasBaseUrl
console.log("ATLAS_API_BASE_URL: ", ATLAS_API_BASE_URL)
// console.log ("config.database ", config.database )
const ATLAS_PROJECT_ID = config.database.atlasProjectId
console.log("ATLAS_PROJECT_ID: ", ATLAS_PROJECT_ID)
const ATLAS_CLUSTER_NAME = config.database.atlasCluster
console.log("ATLAS_CLUSTER_NAME: ", ATLAS_CLUSTER_NAME)
const ATLAS_API_PUBLIC_KEY = config.database.atlasApiPublicKey
console.log("ATLAS_API_PUBLIC_KEY: ", ATLAS_API_PUBLIC_KEY)
const ATLAS_API_PRIVATE_KEY = config.database.atlasApiPrivateKey
console.log("ATLAS_API_PRIVATE_KEY: ", ATLAS_API_PRIVATE_KEY)


// printConfig
const ATLAS_CLUSTER_API_URL = `${ATLAS_API_BASE_URL}/groups/${ATLAS_PROJECT_ID}/clusters/${ATLAS_CLUSTER_NAME}`
const ATLAS_SEARCH_INDEX_API_URL = `${ATLAS_CLUSTER_API_URL}/fts/indexes`
const DIGEST_AUTH = `${ATLAS_API_PUBLIC_KEY}:${ATLAS_API_PRIVATE_KEY}`

const PRODUCT_SEARCH_INDEX_NAME = 'product_search'
const PRODUCT_AUTOCOMPLETE_INDEX_NAME = 'product_autocomplete'

const router = express.Router();

router.get('/', async (req, res) => {
    const searchQuery = req.query.query

    
    if (!searchQuery || searchQuery.length < 2) {
      res.json([])
      return
    }
    const db = mongoClient.db('buzzar');
    const collection = db.collection('products');
    const pipeline = [];

    pipeline.push({
        $search: {
          index: PRODUCT_SEARCH_INDEX_NAME,
          text: {
            query: searchQuery, // The search term from the user
            path: 'name', // Specify the field to search in
            fuzzy: {} // Optional: Enables fuzzy matching for typos
          },
        },
      });
      
      pipeline.push({
        $project: {
          _id: 0, // Exclude the `_id` field
          score: { $meta: 'searchScore' }, // Include the search relevance score
          name: 1, // Include the product name
          description: 1, // Include the product description
          price: 1, // Include the product price
          category: 1, // Include the product category
          image: 1, // Include product image(s)
          stock: 1, // Include stock details
        },
      });
      

  const result = await collection.aggregate(pipeline).sort({ score: -1 }).limit(10);
  const array = await result.toArray();
  res.json(array);
});
app.get('/autocomplete', async (req, res) => {
    const searchQuery = req.query.query;
    const country = req.query.country;
  
    const db = mongoClient.db('tutorial');
    const collection = db.collection(MONGODB_COLLECTION);
  
    const pipeline = [];
  
    if (country) {
      pipeline.push({
        $search: {
          index: USER_SEARCH_INDEX_NAME,
          compound: {
            must: [
              { autocomplete: { query: searchQuery, path: 'fullName', fuzzy: {} } },
              { text: { query: country, path: 'country' } },
            ],
          },
        },
      });
    } else {
      pipeline.push({
        $search: {
          index: USER_AUTOCOMPLETE_INDEX_NAME,
          autocomplete: {
            query: searchQuery,
            path: 'fullName',
            tokenOrder: 'sequential',
          },
        },
      });
    }
  
    pipeline.push({
      $project: {
        _id: 0,
        score: { $meta: 'searchScore' },
        userId: 1,
        fullName: 1,
        email: 1,
        avatar: 1,
        registeredAt: 1,
        country: 1,
      },
    });
  
    const result = await collection.aggregate(pipeline).sort({ score: -1 }).limit(10);
    const array = await result.toArray();
    res.json(array);
  });
  
  async function findIndexByName(indexName) {
    const allIndexesResponse = await request(
      `${ATLAS_SEARCH_INDEX_API_URL}/${MONGODB_DATABASE}/${MONGODB_COLLECTION}`,
      {
        dataType: 'json',
        contentType: 'application/json',
        method: 'GET',
        digestAuth: DIGEST_AUTH,
      }
    );
  
    return allIndexesResponse.data.find((i) => i.name === indexName);
  }
  
  async function upsertSearchIndex() {
    const userSearchIndex = await findIndexByName(USER_SEARCH_INDEX_NAME);
    if (!userSearchIndex) {
      await request(ATLAS_SEARCH_INDEX_API_URL, {
        data: {
          name: USER_SEARCH_INDEX_NAME,
          database: MONGODB_DATABASE,
          collectionName: MONGODB_COLLECTION,
          mappings: { dynamic: true },
        },
        dataType: 'json',
        contentType: 'application/json',
        method: 'POST',
        digestAuth: DIGEST_AUTH,
      });
    }
  }
  
  async function upsertAutocompleteIndex() {
    const userAutocompleteIndex = await findIndexByName(USER_AUTOCOMPLETE_INDEX_NAME);
    if (!userAutocompleteIndex) {
      await request(ATLAS_SEARCH_INDEX_API_URL, {
        data: {
          name: USER_AUTOCOMPLETE_INDEX_NAME,
          database: MONGODB_DATABASE,
          collectionName: MONGODB_COLLECTION,
          mappings: {
            dynamic: false,
            fields: {
              fullName: [
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
      });
    }
  }
  