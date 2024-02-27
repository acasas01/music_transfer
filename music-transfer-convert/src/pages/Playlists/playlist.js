import React from 'react';
// import Checkbox from 'react-simple-checkbox';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
//import { updateToken, fetchSpotifyPlaylists, prepareSpotifyDataToBeTransfered } from '../../modules/actions/spotify-actions'
import PlaylistCard from '../../components/Playlist/playlistcard'
import PacmanLoader from "react-spinners/PacmanLoader"
//import queryString from 'query-string';
//import { apple_auth } from '../../apple/apple-provider'
import like_track from "../../svg/like_track.png"
import './style.scss';
import * as apple_auth from '../../apple/apple_calls';

// take note of name, and get all track names to query for new playlist in apple music

var fakeplaylists = [
    {
        name: 'test',
        no_of_songs: 0,
        playlist_owner: 'Alan',
        image: like_track,
        id: 'allthelikedsongs',
        isChecked: false,
    }
]

class Playlist extends React.Component {

    constructor() {
        super();
        this.state = {
            parsedJsonData: [],
            loading: true,
            selectedPlaylists: []
        };
    };

    // componentDidMount() {
    //     // let parsed = queryString.parse(window.location.search);
    //     // this.props.updateToken(parsed.access_token)
    //     // this.setState({ spotifyAccessTokenJson: parsed })
    //     // this.props.fetchSpotifyPlaylists(parsed)
    //     // this.selectedPlaylists = new Set();
    //     this.selectedPlaylists = new Set();
    // }

    // componentDidUpdate(prevProps, prevState) {
    //     if(this.props.loaded !== prevProps.loaded){
    //         this.setState({
    //             loading: false,
    //             parsedJsonData: this.props.playlists
    //         })
    //     }

    //     if (this.props.transferReady !== prevProps.transferReady) {
    //         apple_auth.LogIn()
    //             .then((res) => {
    //                 if (res) {
    //                     this.props.history.push({
    //                         pathname: '/result',
    //                     })
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.log(error)
    //             })
    //     }
    // }

    componentDidMount() {
        // Make the API call to get the user's playlists
        this.setState({ loading: true });
        console.log("is this getting called");
        fetch('http://localhost:8888/playlist', {
        })
          .then(response => response.json())
          .then(data => {
            // Handle the response data, which will contain information about the user's playlists
            console.log(data.items);
            this.setState({
              loading: false,
              parsedJsonData: data, // Hopefully can handle the items returend
              selectedPlaylists: new Set()
            });
            //this.state.selectedPlaylists = new Set();
            //console.log("parsedJsonData ", this.state.parsedJsonData);
          })
          .catch(error => {
            console.error('Error fetching playlists:', error);
            this.setState({ loading: false });
          });
      }


    handleCheckChildElement = (event) => { // where to get playlistName.
        const { parsedJsonData, selectedPlaylists } = this.state;
        console.log(selectedPlaylists);
        // if (selectedPlaylists.includes(playlistName)) {
        //     // If the playlist name is already in the selectedPlaylists, remove it
        //     this.setState({
        //       selectedPlaylists: selectedPlaylists.filter(name => name !== playlistName),
        //     });
        //   } else {
        //     // If the playlist name is not in selectedPlaylists, add it
        //     this.setState({
        //       selectedPlaylists: [...selectedPlaylists, playlistName],
        //     });
        //   }

        const updatedData = parsedJsonData.map((data) => {
            if (data.id === event.target.id) {
                if (data.isChecked) {
                    console.log("deleted")
                    selectedPlaylists.delete(event.target.id);
                } else {
                    selectedPlaylists.add(event.target.id);
                }
                return { ...data, isChecked: !data.isChecked };
            }
            return data;
        });

        this.setState({
            parsedJsonData: updatedData,
        });
    };
    

    spinnerCss() {
        return (`height: 50vh;
        display: block;
        margin: 0 auto;
        margin-top: 100px;`)
    }

    transferToApple = () => {
        console.log("HWEREWR WERJKNFSDJKFSDNJKDFSDFJKS transferToApple is called");
        apple_auth.configure();
        this.setState({ loading: true });
        
        
        // fetch('http://localhost:8888/appleplaylist', {
        // })
        //   .then(response => response.json())
        //   .then(data => {
        //     // Handle the response data, which will contain information about the user's playlists
        //     console.log(data.items);
        //     this.setState({
        //       loading: false,
        //       parsedJsonData: data, // Hopefully can handle the items returend
        //       selectedPlaylists: new Set()
        //     });
        //     //this.state.selectedPlaylists = new Set();
        //     //console.log("parsedJsonData ", this.state.parsedJsonData);
        //   })
        //   .catch(error => {
        //     console.error('Error fetching playlists client:', error);
        //     this.setState({ loading: false });
        //   });
      }
        //console.log("playlists ", this.state.selectedPlaylists);
        
        //this.props.A(this.selectedPlaylists, this.state.spotifyAccessTokenJson)
    

    render() {
        return (
            <div className="playlist">
                {
                    this.state.loading ? <p>Fetching playlists you own ...</p>
                    :
                    <p>Showing playlists you own. Select the Playlists you want to transfer</p>
                }
                


                <div className="playlist-inner">
                <div className="button-wrapper">
                    <button className="butt" onClick={this.transferToApple}>Transfer Selected Playlists To Apple Music</button>
                </div>

                {this.state.t ? (
                    <PacmanLoader css={this.spinnerCss()} size={50} color={"#123abc"} />
                ) : (
                    this.state.parsedJsonData && this.state.parsedJsonData.map((data) => (
                        <PlaylistCard
                            key={data.id}
                            name={data.name}
                            no_of_songs={data.tracks.total}
                            playlist_owner={data.display_name}
                            image={data.images[0].url}
                            uid={data.id}
                            handleCheckboxChange={this.handleCheckChildElement}
                            isSelected={data.isChecked}
                        />
                    ))
                )}
                </div>
            </div>
        );
    }
}

// function mapStateToProps(state) {
//     return {
//         accessToken: state.spotify_reducer.accessToken,
//         transfer: state.spotify_reducer.transfer,
//         playlists: state.spotify_reducer.playlists,
//         loaded: state.spotify_reducer.loaded, 
//         transferReady: state.spotify_reducer.transferReady, 
//     };
// }

// function mapDispatchToProps(dispatch) {
//     return {
//         updateToken: bindActionCreators(updateToken, dispatch),
//         fetchSpotifyPlaylists: bindActionCreators(fetchSpotifyPlaylists, dispatch),
//         prepareSpotifyDataToBeTransfered: bindActionCreators(prepareSpotifyDataToBeTransfered, dispatch)
//     };
// }

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(Playlist);

export default Playlist