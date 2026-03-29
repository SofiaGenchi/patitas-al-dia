import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [emoji, setEmoji] = useState('🐾');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Debounced check for pet name to get avatar
  useEffect(() => {
    const checkName = async () => {
      if (name.trim().length > 1) {
        const profile = await api.getProfile(name.trim());
        if (profile) setEmoji(profile.emoji);
        else setEmoji('🐾');
      } else {
        setEmoji('🐾');
      }
    };
    
    const timeout = setTimeout(checkName, 500);
    return () => clearTimeout(timeout);
  }, [name]);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 4) setPin(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Ingresa el nombre de la mascota.');
    if (pin.length !== 4) return setError('La contraseña debe tener 4 números.');

    setLoading(true);
    
    const profileExists = await api.getProfile(name.trim());
    if (!profileExists) {
      setLoading(false);
      alert('No hay ningún perfil existente con ese nombre.');
      return navigate('/create');
    }

    const result = await api.login(name.trim(), pin);
    setLoading(false);

    if (result.success && result.profile) {
      // Store in session storage for simple auth
      sessionStorage.setItem('patitas_profile', JSON.stringify(result.profile));
      navigate('/dashboard');
    } else {
      setError('Contraseña incorrecta.');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto items-center">
      
      <div className="mt-12 mb-8 bg-white w-24 h-24 rounded-full shadow-sm flex items-center justify-center text-5xl border border-gray-100">
        {emoji}
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-10 w-full text-center">Ingresar</h1>

      <form onSubmit={handleSubmit} className="flex flex-col w-full flex-1">
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="petName">
            Nombre de la mascota
          </label>
          <input
            id="petName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white px-4 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder:text-gray-400"
            placeholder="Ej. Firulais"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="pin">
            Contraseña
          </label>
          <input
            id="pin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            value={pin}
            onChange={handlePinChange}
            className="w-full bg-white px-4 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all font-mono tracking-widest text-lg"
            placeholder=""
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div className="mt-auto pt-6 flex flex-col gap-4 pb-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-70 text-white py-4 rounded-2xl font-semibold text-lg transition-all active:scale-[0.98]"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          
          <Link 
            to="/create" 
            className="text-center text-sm font-medium text-gray-500 hover:text-slate-900 transition-colors py-2"
          >
            No tengo cuenta, crear perfil
          </Link>
        </div>
      </form>
    </div>
  );
}
