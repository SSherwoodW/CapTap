import React from 'react';
import ReactDOM from 'react-dom/client';

import { RouterProvider } from 'react-router-dom';
import './index.css';

import router from "./routes-nav/Routes";
import { AuthProvider } from "../src/auth/authContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <div className="min-h-screen bg-gray-700">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  </React.StrictMode>,
)
