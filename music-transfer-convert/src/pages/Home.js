import React from 'react';
import screenShot from '../svg/spot_to_applemusic.png'


class Home extends React.Component {
    // constructor() {
    //     super();
    //     this.state = {
    //         isShowing: false,
    //     }
    // }

    showForm = () => {
        window.location.replace('http://localhost:8888/login')
    }
    showForm2 = () => {
        window.location.replace('http://localhost:3000/playlist')
    }

    // closeForm = () => {
    //     this.setState({ isShowing: false });
    // }

    render() {
        return (
            <section className="landing-page" >
                <div className="main-container">
                    <div className="landing-inner-div">
                        <p>Transfer playlists from Spotify to Apple Music.</p>
                        <p><strong>Ensure you have accounts with both Spotify and Apple Music before starting.</strong></p>
                        

                        <button className="btn" onClick={this.showForm}>Transfer To Apple Music</button>
                        <img className="landingPageImage" src={screenShot} alt="Spotify <-> Apple music Playlist converter"></img>
                    </div>
                </div>
            </section>
        );
    }
}

export default Home;