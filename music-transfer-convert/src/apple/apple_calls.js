const instance = window.MusicKit

// I need to fucking encrypt this
const key = 'fart666fuckAPPLEBRUH'

/**
 * Configure the MusicKit library using the developer token, 
 * the call to the server for the token passes a key that the server is expecting
 * if you dont upload the key, the server will not return a result
 * @param {String} token 
 */
export async function configure() {
    console.log("CALLED CONFIGURE");
    var serverurl = 'http://localhost:8888/token?key='+key
    await fetch(serverurl, {
        mode: 'cors',
    })
        .then(response => response.json())
        .then(res => {
            console.log("ap calls HERE ", res.token);
            instance.configure({
                developerToken: res.token,
                app: {
                    name: 'Playlist Converter',
                    build: '1978.4.1'
                }
            });
        })
        .catch((error) => {
            console.log(error)
        })
}

/**
 * Return the Musickit instance
 */
export function getMusicInstance() {
    return instance.getInstance();
}