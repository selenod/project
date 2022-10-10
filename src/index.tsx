import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Router>
    <Routes>
      <Route path="/:projectID" element={<App />} />
      <Route path="/:projectID/:pageID" element={<App />} />
      <Route path="*" element={<App />} />
    </Routes>
  </Router>
);
