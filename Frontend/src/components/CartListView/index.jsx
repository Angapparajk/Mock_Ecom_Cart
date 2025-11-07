import CartItem from '../CartItem'
import CartContext from "../../context";

import './index.css'

const CartListView = ({ setLoading, setSuccess }) => (
  <CartContext.Consumer>
    {value => {
      const {cartList} = value

      return (
        <ul className="cart-list">
          {cartList.map(eachCartItem => (
            <CartItem 
              key={eachCartItem.id} 
              cartItemDetails={eachCartItem}
              setLoading={setLoading}
              setSuccess={setSuccess}
            />
          ))}
        </ul>
      )
    }}
  </CartContext.Consumer>
)

export default CartListView
