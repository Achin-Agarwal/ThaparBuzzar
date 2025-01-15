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
// const ATLAS_CLUSTER_API_URL = `${ATLAS_API_BASE_URL}/groups/${ATLAS_PROJECT_ID}/clusters/${ATLAS_CLUSTER_NAME}`
// const ATLAS_SEARCH_INDEX_API_URL = `${ATLAS_CLUSTER_API_URL}/fts/indexes`
// const DIGEST_AUTH = `${ATLAS_API_PUBLIC_KEY}:${ATLAS_API_PRIVATE_KEY}`

