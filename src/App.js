import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from './components/NavigationBar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<NavigationBar />}>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
