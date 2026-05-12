export interface AuthUser {
  id?: number;
  id_usuario?: number;
  userId?: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  rol?: string;
  role?: string;
  activo?: boolean;
  verificado?: boolean;
  restaurantId?: number;
  businessId?: number;
  negocioId?: number;
  businessType?: string;
  accountType?: 'restaurant' | 'business';
  restaurantes?: Array<{
    id: number;
    nombre: string;
    tipoAcceso?: string;
  }>;
  businesses?: Array<{
    id?: number;
    businessId?: number;
    tradeName?: string;
    name?: string;
    businessType?: string;
  }>;
  negocios?: Array<{
    id?: number;
    businessId?: number;
    nombre?: string;
    tradeName?: string;
    businessType?: string;
  }>;
}

export interface AuthSession {
  token: string;
  usuario: AuthUser;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RestaurantRegisterDTO {
  rol: 2;
  restaurant: {
    nombre: string;
    descripcion: string;
    telefono: string;
    direccion: string;
  };
  owner: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    passwordRaw: string;
  };
}
