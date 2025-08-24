import './wdyr';

import { StrictMode } from 'react'
import  { Suspense } from "react";
import { createRoot } from 'react-dom/client'
import App from "./App";
import "./index.css";



createRoot(document.getElementById('root')!).render(
  <StrictMode>
 <Suspense fallback={<p>Loading...</p>}>
        <div className="App">
          <App />
        </div>
    </Suspense>
      </StrictMode>,
)
