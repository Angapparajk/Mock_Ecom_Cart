import React, { useState, useEffect, useContext } from 'react'
import Header from '../Header'
import CartListView from '../CartListView'
import CartSummary from '../CartSummary'
import CartContext from "./../../context";
import EmptyCartView from '../EmptyCartView'
import { ThreeDots } from 'react-loader-spinner'
import { apiStatusConstants } from '../../services/api'

import './index.css'

const Cart = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.success)
  const { cartList, removeAllCartItems } = useContext(CartContext)

  useEffect(() => {
    if (apiStatus === apiStatusConstants.inProgress) {
      setApiStatus(apiStatusConstants.success)
    }
  }, [apiStatus])

  const setLoadingStatus = () => {
    setApiStatus(apiStatusConstants.inProgress)
  }

  const setSuccessStatus = () => {
    setApiStatus(apiStatusConstants.success)
  }

  const renderLoadingView = () => (
    <div className="cart-loader-container">
      <ThreeDots color="#0b69ff" height={50} width={50} />
    </div>
  )

  const renderCartContent = () => {
    const showEmptyView = cartList.length === 0

    return (
      <div className="cart-container">
        {showEmptyView ? (
          <EmptyCartView />
        ) : (
          <div className="cart-content-container">
            <h1 className="cart-heading">My Cart</h1>
            <CartListView setLoading={setLoadingStatus} setSuccess={setSuccessStatus} />
            <CartSummary />
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Header />
      {apiStatus === apiStatusConstants.inProgress ? 
        renderLoadingView() : 
        renderCartContent()
      }
    </>
  )
}

export default Cart
