import { useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 bg-slate-800 text-white p-4 rounded-3xl shadow-sm">
        <PawPrint size={64} strokeWidth={1.5} />
      </div>
      
      <h1 className="text-4xl font-bold mb-3 tracking-tight text-slate-900">Patitas al Día</h1>
      
      <p className="text-gray-500 mb-12 max-w-[280px] leading-relaxed">
        Registro simple para controlar la comida de tu mascota.
      </p>

      <button
        onClick={() => navigate('/load')}
        className="w-full max-w-[280px] bg-slate-900 hover:bg-slate-700 text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-colors active:scale-[0.98]"
      >
        Ingresar
      </button>
    </div>
  );
}
