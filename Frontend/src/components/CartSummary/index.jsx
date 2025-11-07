import { useState } from 'react'
import Cookies from 'js-cookie'
import CartContext from "../../context";
import { checkoutCart } from '../../services/api'
import './index.css'

const ConfirmationModal = ({ onConfirm, onCancel, totalAmount }) => (
  <div className="confirmation-overlay">
    <div className="confirmation-container">
      <h2>Confirm Order</h2>
      <p>Are you sure you want to place this order?</p>
      <p className="confirm-amount">Total Amount: ₹{totalAmount}/-</p>
      <div className="confirmation-buttons">
        <button className="confirm-button" onClick={onConfirm}>Yes, Place Order</button>
        <button className="cancel-button" onClick={onCancel}>No, Cancel</button>
      </div>
    </div>
  </div>
)

const Receipt = ({ receipt, onClose }) => {
  if (!receipt) return null

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const items = Array.isArray(receipt.items) ? receipt.items : []

  return (
    <div className="receipt-overlay">
      <div className="receipt-container">
        <div className="order-placed-badge">ORDER PLACED</div>
        <button className="close-receipt" onClick={onClose}>×</button>
        <h2 className="receipt-title">Order Receipt</h2>
        <div className="receipt-header">
          <div className="receipt-order-details">
            <p className="receipt-order-id">Order ID: {receipt.orderId || 'N/A'}</p>
            <p className="receipt-date">Date: {formatDate(receipt.timestamp || new Date().toISOString())}</p>
          </div>
        </div>
        
        <div className="receipt-items">
          <h3>Items:</h3>
          <div className="receipt-table-wrapper">
            <table className="receipt-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const title = item.title || 'Unknown Item'
                  const price = item.price || 0
                  const qty = item.quantity || 0
                  return (
                    <tr key={index}>
                      <td>{title}</td>
                      <td>{qty}</td>
                      <td>₹{price}/-</td>
                      <td>₹{price * qty}/-</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="receipt-total">
          <h3>Total Amount: ₹{receipt.total || 0}/-</h3>
        </div>
      </div>
    </div>
  )
}

const CartSummary = () => {
  const [loading, setLoading] = useState(false)
  const [receipt, setReceipt] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const jwtToken = Cookies.get('jwt_token')

  const handleCheckoutClick = () => {
    setShowConfirmation(true)
  }

  const handleConfirmCheckout = async () => {
    setShowConfirmation(false)
    setLoading(true)
    try {
      const jwtToken = Cookies.get('jwt_token')
      const response = await checkoutCart(jwtToken)

      if (response && response.orderId && Array.isArray(response.items)) {
        setReceipt(response)
      } else {
        setReceipt({
          orderId: response && response.orderId ? response.orderId : 'N/A',
          items: Array.isArray(response && response.items) ? response.items : [],
          total: response && response.total ? response.total : 0,
          timestamp: response && response.timestamp ? response.timestamp : new Date().toISOString(),
        })
      }
      } catch (error) {
      // Silent error
    } finally {
      setLoading(false)
    }
  }

  const handleCancelCheckout = () => {
    setShowConfirmation(false)
  }

  const handleCloseReceipt = () => {
    setReceipt(null)
    window.location.reload()
  }

  return (
    <CartContext.Consumer>
      {value => {
        const {cartList} = value

        const totalAmount = cartList.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        )

        return (
          <>
            <div className="cart-summary-container">
              <h1 className="cart-summary-heading">
                Order Total:{' '}
                <span className="summary-amount">Rs {totalAmount}/-</span>
              </h1>
              <p className="summary-items">{cartList.length} Items in cart</p>
              {!jwtToken && (
                <p className="login-required">Please log in to checkout.</p>
              )}
              <button 
                type="button" 
                className="checkout-button"
                onClick={handleCheckoutClick}
                disabled={loading || cartList.length === 0 || !jwtToken}
              >
                {loading ? 'Processing...' : 'Checkout'}
              </button>
            </div>
            {showConfirmation && (
              <ConfirmationModal 
                onConfirm={handleConfirmCheckout}
                onCancel={handleCancelCheckout}
                totalAmount={totalAmount}
              />
            )}
            {receipt && <Receipt receipt={receipt} onClose={handleCloseReceipt} />}
          </>
        )
      }}
    </CartContext.Consumer>
  )
}

export default CartSummary
