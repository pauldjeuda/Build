import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import AppRoutes from '../routes';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '10px', fontSize: '14px' },
            success: { style: { background: '#10B981', color: '#fff' } },
            error: { style: { background: '#EF4444', color: '#fff' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  );
}
