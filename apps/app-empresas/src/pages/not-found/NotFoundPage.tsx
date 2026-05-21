/**
 * Not Found Page (404)
 * Página que se muestra cuando una ruta no existe
 */

import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="text-center">
        {/* 404 */}
        <h1 className="text-9xl font-bold text-primary/10">404</h1>
        
        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-900 mt-4">
          Página no encontrada
        </h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o fue movida a otra ubicación.
        </p>
        
        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            <Home size={20} />
            Ir al Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            <ArrowLeft size={20} />
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};
