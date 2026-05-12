/**
 * Script de prueba para verificar conexión con la API
 * Ejecutar: npm run test:api
 */

import { restaurantService } from './features/manage-restaurant/api/restaurant.service';
import { getCurrentRestaurantId } from './shared/mocks/mockAuth';

async function testRestaurantAPI() {
  console.log('🧪 Testing Restaurant API...\n');
  
  const restaurantId = getCurrentRestaurantId();
  console.log(`📍 Using mock restaurant ID: ${restaurantId}\n`);

  try {
    // Test 1: Obtener todos los restaurantes
    console.log('1️⃣ Testing GET /restaurantes...');
    const restaurants = await restaurantService.getAll({ activo: true });
    console.log(`✅ Found ${restaurants.length} restaurants`);
    console.log('First restaurant:', restaurants[0]);
    console.log('');

    // Test 2: Obtener un restaurante por ID
    if (restaurants.length > 0) {
      const firstRestaurantId = restaurants[0].id;
      console.log(`2️⃣ Testing GET /restaurantes/${firstRestaurantId}...`);
      const restaurant = await restaurantService.getById(firstRestaurantId);
      console.log('✅ Restaurant details:', {
        id: restaurant.id,
        nombre: restaurant.nombre,
        disponible: restaurant.disponible,
        activo: restaurant.activo,
      });
      console.log('');
    }

    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Ejecutar tests
testRestaurantAPI();
