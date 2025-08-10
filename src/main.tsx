import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'sonner'

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster 
      position="bottom-right" 
      theme="dark"
      toastOptions={{
        style: {
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          color: 'hsl(var(--foreground))',
        }
      }}
    />
  </>
);
