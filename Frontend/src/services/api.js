// API Status Constants
export const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// Base URL
const BASE_URL = 'http://localhost:5000/api'

// API Endpoints
const ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: (id) => `/products/${id}`,
  CART: '/cart',
  CHECKOUT: '/cart/checkout',
}

// Helper function to get common headers
const getHeaders = (jwtToken = '') => ({
  method: 'GET',
  headers: {
    Authorization: `Bearer ${jwtToken}`,
  },
})

// API Functions
export const loginUser = async (email, password) => {
  const url = `${BASE_URL}${ENDPOINTS.LOGIN}`;
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  };
  const response = await fetch(url, options);
  const data = await response.json();
  if (data && data.token) {
    return { ...data, jwt_token: data.token };
  }
  return data;
}

export const registerUser = async (name, email, password) => {
  const url = `${BASE_URL}${ENDPOINTS.REGISTER}`;
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  };
  const response = await fetch(url, options);
  const data = await response.json();
  if (data && data.token) {
    return { ...data, jwt_token: data.token };
  }
  return data;
}

export const getProducts = async ({
  activeOptionId = '',
  activeCategoryId = '',
  searchInput = '',
  activeRatingId = '',
} = {}) => {
  const params = new URLSearchParams();
  if (activeOptionId) params.append('sort_by', activeOptionId);
  if (activeCategoryId) params.append('category', activeCategoryId);
  if (searchInput) params.append('title_search', searchInput);
  if (activeRatingId) params.append('rating', activeRatingId);

  const apiUrl = `${BASE_URL}${ENDPOINTS.PRODUCTS}?${params.toString()}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

export const getProductDetails = async (id) => {
  const apiUrl = `${BASE_URL}${ENDPOINTS.PRODUCT_DETAILS(id)}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

export const getCart = async (jwtToken) => {
  const apiUrl = `${BASE_URL}${ENDPOINTS.CART}`;
  const options = getHeaders(jwtToken);
  const response = await fetch(apiUrl, options);
  if (response.status === 401) {
    return { unauthorized: true };
  }
  const data = await response.json();
  return data;
}

export const addToCart = async (jwtToken, productId, quantity) => {
  const apiUrl = `${BASE_URL}${ENDPOINTS.CART}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ productId, quantity }),
  };
  const response = await fetch(apiUrl, options);
  if (response.status === 401) {
    return { unauthorized: true };
  }
  const data = await response.json();
  return data;
}

export const removeFromCart = async (jwtToken, productId) => {
  const apiUrl = `${BASE_URL}${ENDPOINTS.CART}/${productId}`;
  const options = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
  const response = await fetch(apiUrl, options);
  if (response.status === 401) {
    return { unauthorized: true };
  }
  const data = await response.json();
  return data;
}

export const clearCart = async (jwtToken) => {
  const apiUrl = `${BASE_URL}${ENDPOINTS.CART}`;
  const options = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
  const response = await fetch(apiUrl, options);
  if (response.status === 401) {
    return { unauthorized: true };
  }
  const data = await response.json();
  return data;
}

export const checkoutCart = async (jwtToken) => {
  const apiUrl = `${BASE_URL}${ENDPOINTS.CHECKOUT}`;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
  const response = await fetch(apiUrl, options);
  const data = await response.json();
  return data;
}
