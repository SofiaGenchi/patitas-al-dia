import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { api } from '../lib/api';

export default function Loader() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkStatus = async () => {
      // Minimum 3 seconds loading as requested
      const timer = new Promise(resolve => setTimeout(resolve, 3000));
      
      try {
        const [hasProfiles] = await Promise.all([
          api.checkProfilesExist(),
          timer
        ]);
        
        if (!mounted) return;
        
        if (hasProfiles) {
          navigate('/login', { replace: true });
        } else {
          navigate('/create', { replace: true });
        }
      } catch (err) {
        if (!mounted) return;
        console.error(err);
        setError(true);
      }
    };

    checkStatus();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white h-screen">
      <div className="mb-6">
        <PawPrint size={100} strokeWidth={1} className="animated-paw" />
      </div>
      
      {!error ? (
        <p className="text-orange-500 font-medium tracking-widest mt-4 uppercase text-sm animate-pulse">Cargando...</p>
      ) : (
        <div className="flex flex-col items-center mt-4">
          <p className="text-red-500 mb-4 bg-red-50 px-4 py-2 rounded-lg">Error de conexión con el servidor.</p>
          <div className="flex gap-4 w-full">
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="flex-1 bg-white border-2 border-slate-200 py-3 rounded-xl font-medium"
            >
              Ir a Login
            </button>
            <button
              onClick={() => navigate('/create', { replace: true })}
              className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-medium"
            >
              Crear perfil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
