import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from 'axios'

// Configure axios
axios.defaults.baseURL = 'http://192.168.0.3:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

createRoot(document.getElementById("root")!).render(<App />);
