import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';

const ICONS = [
  { id: 'dog', emoji: '🐶', label: 'Perro' },
  { id: 'cat', emoji: '🐱', label: 'Gato' },
  { id: 'bird', emoji: '🐦', label: 'Pájaro' },
  { id: 'other', emoji: '🐾', label: 'Otro' },
];

export default function CreateProfile() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('dog');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 4) setPin(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('El nombre es obligatorio.');
    if (pin.length !== 4) return setError('La contraseña debe tener exactamente 4 números.');

    setLoading(true);
    const iconObj = ICONS.find(i => i.id === selectedIcon)!;
    
    const result = await api.createProfile({
      petName: name.trim(),
      selectedIcon,
      emoji: iconObj.emoji,
      pin
    });

    setLoading(false);

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error || 'Hubo un error al crear el perfil.');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto">
      <div className="mt-8 mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Crear perfil</h1>
        <p className="text-gray-500">Agrega los datos iniciales de tu mascota.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Icono de la mascota</label>
          <div className="grid grid-cols-4 gap-3">
            {ICONS.map(icon => (
              <button
                key={icon.id}
                type="button"
                onClick={() => setSelectedIcon(icon.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  selectedIcon === icon.id 
                    ? 'border-slate-900 bg-white shadow-sm scale-[1.02]' 
                    : 'border-transparent bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="text-3xl mb-1">{icon.emoji}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
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

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="pin">
            Contraseña de 4 números
          </label>
          <input
            id="pin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            value={pin}
            onChange={handlePinChange}
            className="w-full bg-white px-4 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder:text-gray-400 font-mono tracking-widest text-lg"
            placeholder="••••"
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="mt-auto pt-6 flex flex-col gap-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-70 text-white py-4 rounded-2xl font-semibold text-lg transition-all active:scale-[0.98]"
          >
            {loading ? 'Guardando...' : 'Agregar'}
          </button>
          
          <Link 
            to="/login" 
            className="text-center text-sm font-medium text-gray-500 hover:text-slate-900 transition-colors py-2"
          >
            Ya tengo cuenta, ingresar
          </Link>
        </div>
      </form>
    </div>
  );
}
