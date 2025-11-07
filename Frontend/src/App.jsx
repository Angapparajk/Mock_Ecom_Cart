import { useState, useEffect } from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'

import Cookies from 'js-cookie'

import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from "./context";
import { getCart, addToCart, removeFromCart, clearCart } from './services/api'

import './App.css'

const App = () => {
  const [cartList, setCartList] = useState([])

  useEffect(() => {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken) {
      fetchAndSetCart(jwtToken)
    }

    const handleAuthChange = () => {
      const jwtToken = Cookies.get('jwt_token')
      if (jwtToken) {
        fetchAndSetCart(jwtToken)
      }
    }

    window.addEventListener('auth-changed', handleAuthChange)
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange)
    }
  }, [])

  const fetchAndSetCart = async (jwtToken) => {
    try {
      const data = await getCart(jwtToken)
      if (data && data.unauthorized) {
        Cookies.remove('jwt_token')
        return
      }

      if (data && data.cart && Array.isArray(data.cart.items)) {
        const mapped = data.cart.items
          .filter(item => item.productId)
          .map(item => ({
            id: (item.productId._id || item.productId.id || '').toString(),
            title: item.productId.title,
            brand: item.productId.brand,
            price: item.productId.price,
            imageUrl: item.productId.imageUrl || item.productId.image_url,
            quantity: item.quantity,
          }))
        setCartList(mapped)
      }
    } catch (err) {
      // Silent error
    }
  }

  const addCartItem = async (product) => {
    const jwtToken = Cookies.get('jwt_token')
    const productId = product.id || product._id
    const quantityToAdd = product.quantity || 1

    if (jwtToken) {
      try {
        const resp = await addToCart(jwtToken, productId, quantityToAdd)
        if (resp && resp.unauthorized) {
          Cookies.remove('jwt_token')
        } else {
          await fetchAndSetCart(jwtToken)
          return
        }
      } catch (err) {
        // Silent error
      }
    }

    setCartList(prevState => {
      const existingItem = prevState.find(
        item => item.id === productId,
      )

      if (existingItem) {
        return prevState.map(item =>
          item.id === productId
            ? {...item, quantity: item.quantity + quantityToAdd}
            : item,
        )
      }

      const newItem = {...product, id: productId, quantity: quantityToAdd}
      return [...prevState, newItem]
    })
  }

  const removeCartItem = async (id) => {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken) {
      try {
        await removeFromCart(jwtToken, id)
        await fetchAndSetCart(jwtToken)
        return Promise.resolve()
      } catch (err) {
        setCartList(prevState => prevState.filter(item => item.id !== id))
        return Promise.reject(err)
      }
    }

    setCartList(prevState => prevState.filter(item => item.id !== id))
    return Promise.resolve()
  }

  const removeAllCartItems = () => {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken) {
      clearCart(jwtToken)
        .then(() => fetchAndSetCart(jwtToken))
        .catch(() => {
          setCartList([])
        })
      return
    }

    setCartList([])
  }

  const incrementCartItemQuantity = async (id) => {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken) {
      try {
        await addToCart(jwtToken, id, 1)
        await fetchAndSetCart(jwtToken)
        return
      } catch (err) {
        // Silent error
      }
    }

    setCartList(prevState => 
      prevState.map(item =>
        item.id === id ? {...item, quantity: item.quantity + 1} : item,
      )
    )
  }

  const decrementCartItemQuantity = async (id) => {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken) {
      const existing = cartList.find(item => item.id === id)
      if (!existing) return
      const newQuantity = existing.quantity - 1
      try {
        if (newQuantity <= 0) {
          await removeFromCart(jwtToken, id)
        } else {
          await removeFromCart(jwtToken, id)
          await addToCart(jwtToken, id, newQuantity)
        }
        await fetchAndSetCart(jwtToken)
        return
      } catch (err) {
        // Silent error
      }
    }

    setCartList(prevState => 
      prevState
        .map(item =>
          item.id === id ? {...item, quantity: item.quantity - 1} : item,
        )
        .filter(item => item.quantity > 0)
    )
  }

  return (
    <CartContext.Provider
      value={{
        cartList,
        addCartItem,
        removeCartItem,
        removeAllCartItems,
        incrementCartItemQuantity,
        decrementCartItemQuantity,
      }}
    >
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        } />
        <Route path="/products/:id" element={
          <ProtectedRoute>
            <ProductItemDetails />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />

        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </CartContext.Provider>
  )
}

export default App
