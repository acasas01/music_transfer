const fetch = require('isomorphic-fetch');

let redirect_uri_login = 'http://localhost:8888/callback';
let client_id = '1ee776bc28734bcd9cb714259ebf7840' //'eb25ce039abf439ca6f94797f9bb321d';
let client_secret = 'fd9f0595a0ab41edafaa449b388749c6' //'27533ebf46ca4952ab4b8a69441f5447';

async function getAccessToken(code) {
  const authOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(
        client_id + ':' + client_secret
      ).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code: code,
      redirect_uri: redirect_uri_login,
      grant_type: 'authorization_code',
    }),
  };

  const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
  const data = await response.json();

  return data.access_token;
}

module.exports = {
  getAccessToken,
};
