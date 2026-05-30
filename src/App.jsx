import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import { useTelegram } from './hooks/useTelegram';
import './index.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('products'); // 'products' or 'cart'
  const { tele, onToggleButton } = useTelegram();

  // Derived state to avoid ESLint warning for setting state in effect
  // If cart is empty, we force the view to 'products' without a separate effect
  const activeView = cartItems.length === 0 ? 'products' : view;

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        if (isMounted) {
          setProducts(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, []);

  const onAdd = (product) => {
    setCartItems((prevItems) => {
      const exist = prevItems.find((x) => x.id === product.id);
      if (exist) {
        return prevItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x
        );
      }
      return [...prevItems, { ...product, qty: 1 }];
    });
  };

  const onRemove = (product) => {
    setCartItems((prevItems) => {
      const exist = prevItems.find((x) => x.id === product.id);
      if (exist.qty === 1) {
        return prevItems.filter((x) => x.id !== product.id);
      }
      return prevItems.map((x) =>
        x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x
      );
    });
  };

  const onSendData = useCallback(() => {
    if (activeView === 'products') {
      setView('cart');
    } else {
      const data = {
        items: cartItems.map((item) => ({
          name: item.title,
          price: item.price,
          quantity: item.qty,
        })),
        totalPrice: cartItems.reduce((a, c) => a + c.price * c.qty, 0).toFixed(2),
      };
      tele.sendData(JSON.stringify(data));
    }
  }, [cartItems, activeView, tele]);

  // Handle MainButton visibility and text based on activeView
  useEffect(() => {
    if (cartItems.length === 0) {
      onToggleButton(false);
    } else {
      const totalPrice = cartItems.reduce((a, c) => a + c.price * c.qty, 0);
      const btnText = activeView === 'products' 
        ? "Savatchani ko'rish" 
        : `Buyurtma berish $${totalPrice.toFixed(2)}`;
      onToggleButton(true, btnText);
    }
  }, [cartItems, activeView, onToggleButton]);

  useEffect(() => {
    tele.onEvent('mainButtonClicked', onSendData);
    return () => {
      tele.offEvent('mainButtonClicked', onSendData);
    };
  }, [onSendData, tele]);

  useEffect(() => {
    const handleBack = () => setView('products');
    if (activeView === 'cart') {
      tele.BackButton.show();
      tele.BackButton.onClick(handleBack);
    } else {
      tele.BackButton.hide();
      tele.BackButton.offClick(handleBack);
    }
    return () => {
      tele.BackButton.offClick(handleBack);
    };
  }, [activeView, tele]);

  if (loading) {
    return <div className="loading">Yuklanmoqda...</div>;
  }

  return (
    <div className="container">
      <Header />
      
      {activeView === 'products' ? (
        <>
          {cartItems.length > 0 && (
            <div className="cart-summary" onClick={() => setView('cart')}>
              <span>🛒 {cartItems.reduce((a, c) => a + c.qty, 0)} mahsulot</span>
              <span>Jami: ${cartItems.reduce((a, c) => a + c.price * c.qty, 0).toFixed(2)}</span>
            </div>
          )}
          <ProductList
            products={products}
            onAdd={onAdd}
            onRemove={onRemove}
            cartItems={cartItems}
          />
        </>
      ) : (
        <Cart 
          cartItems={cartItems} 
          onAdd={onAdd} 
          onRemove={onRemove} 
        />
      )}
    </div>
  );
}

export default App;
