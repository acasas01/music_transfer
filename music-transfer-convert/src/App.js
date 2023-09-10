import React from 'react';

import Home from './pages/Home';
// import Playlist from './pages/Playlists/Playlist';
import Results from './pages/Results/results'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Playlist from './pages/Playlists/playlist';

class App extends React.Component {
  render() {
    return (
      <main>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/result" element={<Results />} />
          </Routes>
        </Router>
      </main>)
  }
}

export default App;
