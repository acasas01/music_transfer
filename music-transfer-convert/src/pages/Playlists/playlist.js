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
        console.log("is this getting called")
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


    handleCheckChildElement = (event) => {
        const { parsedJsonData, selectedPlaylists } = this.state;
        
        if (selectedPlaylists.includes(playlistName)) {
            // If the playlist name is already in the selectedPlaylists, remove it
            this.setState({
              selectedPlaylists: selectedPlaylists.filter(name => name !== playlistName),
            });
          } else {
            // If the playlist name is not in selectedPlaylists, add it
            this.setState({
              selectedPlaylists: [...selectedPlaylists, playlistName],
            });
          }

        const updatedData = parsedJsonData.map((data) => {
            if (data.id === event.target.id) {
                if (data.isChecked) {
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
        console.log("playlists ", this.state.selectedPlaylists);
        this.setState({
            loading: true,
        })
        this.props.A(this.selectedPlaylists, this.state.spotifyAccessTokenJson)
    }

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
                    <button onClick={this.transferToApple}>Transfer Selected Playlists To Apple Music</button>
                </div>

                {this.state.loading ? (
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