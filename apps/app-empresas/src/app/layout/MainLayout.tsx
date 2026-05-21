/**
 * Layout principal de la aplicación
 * Contiene el sidebar y el área de contenido
 */

import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-base">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-base to-white">
        <div className="container mx-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
