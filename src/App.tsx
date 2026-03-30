import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Login }      from './components/Login';
import { Dashboard }  from './components/Dashboard';
import { Register }   from './components/Register';
import { NotFound }   from './components/NotFound';
import { ToastContainer } from './components/Toast';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* Toast system — accesible desde cualquier componente */}
      <ToastContainer />

      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*"          element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;