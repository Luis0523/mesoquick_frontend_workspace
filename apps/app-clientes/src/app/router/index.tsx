import { Routes, Route } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout'
import { CheckoutLayout } from '../layout/CheckoutLayout'
import { SplashPage } from '../../pages/splash/SplashPage'
import { HomePage } from '../../pages/home/HomePage'
import { RestaurantsPage } from '../../pages/restaurants/RestaurantsPage'
import { RestaurantDetailPage } from '../../pages/restaurants/RestaurantDetailPage'
import { BusinessesPage } from '../../pages/businesses/BusinessesPage'
import { CartPage } from '../../pages/cart/CartPage'
import { CheckoutPage } from '../../pages/checkout/CheckoutPage'
import { OrdersPage } from '../../pages/orders/OrdersPage'
import { OrderTrackingPage } from '../../pages/orders/OrderTrackingPage'
import { ProductDetailPage } from '../../pages/product/ProductDetailPage'
import { ProfilePage } from '../../pages/profile/ProfilePage'
import { SearchPage } from '../../pages/search/SearchPage'
import { NotFoundPage } from '../../pages/not-found/NotFoundPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route element={<AppLayout />}>
        <Route path="/inicio" element={<HomePage />} />
        <Route path="/buscar" element={<SearchPage />} />
        <Route path="/restaurantes" element={<RestaurantsPage />} />
        <Route path="/restaurantes/:id" element={<RestaurantDetailPage />} />
        <Route path="/negocios" element={<BusinessesPage />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/pedidos" element={<OrdersPage />} />
        <Route path="/pedidos/:id" element={<OrderTrackingPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
      </Route>
      <Route element={<CheckoutLayout />}>
        <Route path="/producto/:id" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
