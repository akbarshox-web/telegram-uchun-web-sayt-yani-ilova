const Cart = ({ cartItems, onAdd, onRemove }) => {
  const totalPrice = cartItems.reduce((a, c) => a + c.price * c.qty, 0).toFixed(2);

  return (
    <div className="cart-view">
      <h2 className="view-title">Savatdagi mahsulotlar</h2>
      {cartItems.length === 0 ? (
        <p className="empty-msg">Savatingiz bo'sh</p>
      ) : (
        <>
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-item-img" />
                <div className="cart-item-info">
                  <h3 className="cart-item-title">{item.title}</h3>
                  <p className="cart-item-price">${item.price} x {item.qty}</p>
                </div>
                <div className="cart-item-actions">
                  <button className="small-btn" onClick={() => onRemove(item)}>-</button>
                  <span className="qty-text">{item.qty}</span>
                  <button className="small-btn" onClick={() => onAdd(item)}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <span>Umumiy summa:</span>
            <span className="total-amount">${totalPrice}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
