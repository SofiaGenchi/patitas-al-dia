import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Loader from './pages/Loader';
import CreateProfile from './pages/CreateProfile';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background w-full flex justify-center">
        <div className="w-full max-w-md bg-background min-h-screen flex flex-col relative shadow-sm border-x border-gray-200/50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/load" element={<Loader />} />
            <Route path="/create" element={<CreateProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
