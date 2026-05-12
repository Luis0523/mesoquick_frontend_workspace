/**
 * App Principal
 * Punto de entrada de la aplicación con React Router
 */

import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
