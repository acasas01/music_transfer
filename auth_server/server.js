let express = require('express');
const fetch = require('isomorphic-fetch');
let querystring = require('querystring');
let cors = require('cors');
let app = express();
const { getAccessToken } = require('./utils/spotify'); // Import the new function

let redirect_uri_login = 'http://localhost:8888/callback';
let client_id = '1ee776bc28734bcd9cb714259ebf7840' //'eb25ce039abf439ca6f94797f9bb321d';
let client_secret = 'fd9f0595a0ab41edafaa449b388749c6' //'27533ebf46ca4952ab4b8a69441f5447';
let g_access_token = '';

app.use(cors());

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

app.get('/login', function(req, res) {
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: 'user-read-private user-read-email user-library-read playlist-read-private playlist-read-collaborative',
        redirect_uri: redirect_uri_login,
        state: generateRandomString(16)
      })
  );
});

app.get('/callback', async function(req, res) {
  try {
    let code = req.query.code || null;
    // Call the getAccessToken function to obtain the access token
    let access_token = await getAccessToken(code);
    console.log("callback token ", access_token);
    g_access_token = access_token;
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000/playlist';
    res.redirect(uri + '?access_token=' + access_token);
  } catch (error) {
    console.log(error);
    res.redirect('/#' +
      querystring.stringify({
        error: 'invalid_token'
      }));
  }
});
// app.get('/callback', function(req, res) {
//   let code = req.query.code || null;
//   let state = req.query.state || null;

//   if (state === null) {
//     res.redirect('/#' +
//       querystring.stringify({
//         error: 'state_mismatch'
//       }));
//   }

//   let authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     form: {
//       code: code,
//       redirect_uri: redirect_uri_login,
//       grant_type: 'authorization_code'
//     },
//     headers: {
//       'Authorization': 'Basic ' + (new Buffer.from(
//         client_id + ':' + client_secret
//       ).toString('base64'))
//     },
//     json: true
//   };

//   fetch(authOptions.url, {
//     method: 'POST',
//     body: new URLSearchParams(authOptions.form),
//     headers: {
//       'Authorization': 'Basic ' + (new Buffer.from(
//         client_id + ':' + client_secret
//       ).toString('base64')),
//       'Content-Type': 'application/x-www-form-urlencoded'
//     }
//   })
//     .then(function(response) {
//       return response.json();
//     })
//     .then(function(body) {
//       var access_token = body.access_token;
//       console.log("a token ", access_token);
//       let uri = process.env.FRONTEND_URI || 'http://localhost:3000/playlist';
//       res.redirect(uri + '?access_token=' + access_token);
//     })
//     .catch(function(error) {
//       console.log(error);
//       res.redirect('/#' +
//         querystring.stringify({
//           error: 'invalid_token'
//         }));
//     });
// });

// app.get('/playlist', function(req,res){
//     console.log("is this qorkingjsnadfan");
//     const access_token = req.query.access_token;
//     console.log("HELLO", access_token);
//     // Make the API call to get the user's playlists
//     fetch('https://api.spotify.com/v1/me/playlists?limit=20&offset=0', {
//       headers: {
//         'Authorization': `Bearer ${access_token}`,
//       },
//     })
//       .then(response => response.json())
//       .then(data => {
//         // Handle the response data, which will contain information about the user's playlists
//         console.log(data);
//         res.json({ playlists: data.items})
//       })
//       .catch(error => {
//         console.error('Error fetching playlists:', error);
//         res.status(500).json({ error: 'Internal Server Error'})
//       });
  
// });
app.get('/playlist', async function (req, res) {
  try {
    const code = req.query.code; // Retrieve the code from the query parameter
    //const access_token = await getAccessToken(code); // Call the new function to get the access token
    //console.log("playlist access t ", g_access_token);
    const result = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': `Bearer ${g_access_token}`,
      },
    });
    //console.log("API Response:", await result.text()); // Print raw response

    const data = await result.json();
    //console.log(data);
    res.json(data.items);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Generate token for Apple Music playlist
const jwt = require('jsonwebtoken');
const fs = require('fs');

const private_key = fs.readFileSync('AuthKey_2H7DC3BRNY.p8').toString();
const team_id = 'B6GVCPR67Y';
const key_id = '2H7DC3BRNY';

const token = jwt.sign(
  {
    iss: team_id,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 1500000
  },
  private_key,
  {
    algorithm: 'ES256',
    header: {
      alg: 'ES256',
      kid: key_id
    }
  }
);
console.log('jwt token: ', token);

app.get('/token', function(req, res) {
  console.log("activated")
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ token: token }));
});

app.get('/appleplaylist', async function (req, res) {
  try {
    const code = req.query.code; // Retrieve the code from the query parameter
    //const access_token = await getAccessToken(code); // Call the new function to get the access token
    //console.log("playlist access t ", g_access_token);
    const result = await fetch('https://api.music.apple.com/v1/me/', {
      headers: {
        'Authorization': `Bearer ${g_access_token}`,
      },
    });
    //console.log("API Response:", await result.text()); // Print raw response

    const data = await result.json();
    //console.log(data);
    res.json(data.items);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

let port = 8888;
console.log('Listening on port ' + port + '. Go to /login to initiate authentication.');
app.listen(port);
