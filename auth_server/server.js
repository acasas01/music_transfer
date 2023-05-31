let express = require('express')
let request = require('request')
let querystring = require('querystring')
let cors = require('cors')
let app = express()

let redirect_url_login = 'http://localhost:8888/callback'
let client_id = '';
let client_secret = '';

app.use(cors())
