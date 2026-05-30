const ProductCard = ({ product, onAdd, onRemove, cartItem }) => {
  return (
    <div className="product-card">
      {cartItem && <span className="badge">{cartItem.qty}</span>}
      <div className="product-image-container">
        <img src={product.image} alt={product.title} className="product-image" />
      </div>
      <div className="product-info">
        <h2 className="product-title">{product.title}</h2>
        <div className="product-price">${product.price}</div>
      </div>

      {cartItem ? (
        <div className="cart-controls">
          <button className="add-btn remove-btn" onClick={() => onRemove(product)}>
            -
          </button>
          <span className="quantity">{cartItem.qty}</span>
          <button className="add-btn" onClick={() => onAdd(product)}>
            +
          </button>
        </div>
      ) : (
        <button className="add-btn" onClick={() => onAdd(product)}>
          Savatga qo'shish
        </button>
      )}
    </div>
  );
};

export default ProductCard;
