import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import YoutubeDownloader from './components/YoutubeDownloader';
import RedditDownloader from './components/RedditDownloader';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<NavigationBar />}>
          <Route index element={<Home />} />
          <Route path="youtube" element={<YoutubeDownloader />} />
          <Route path="reddit" element={<RedditDownloader />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
