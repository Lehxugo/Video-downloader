import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import YoutubeDownloader from './components/YoutubeDownloader';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<NavigationBar />}>
          <Route index element={<Home />} />
          <Route path="youtube" element={<YoutubeDownloader />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
