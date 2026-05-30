import ProductCard from './ProductCard';

const ProductList = ({ products, onAdd, onRemove, cartItems }) => {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={onAdd}
          onRemove={onRemove}
          cartItem={cartItems.find((x) => x.id === product.id)}
        />
      ))}
    </div>
  );
};

export default ProductList;
