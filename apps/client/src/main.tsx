import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { CountryProvider } from '@/features/country/provider';
import App from '@/app.tsx';
import '@/main.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CountryProvider>
      <App />
    </CountryProvider>
  </StrictMode>
);
