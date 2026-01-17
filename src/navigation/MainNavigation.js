import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppData } from '../data/mockData';
import CartScreen from '../screens/Cart';
import CheckoutScreen from '../screens/Checkout';
import ProductDetailsScreen from '../screens/Details';
import EditProfileScreen from '../screens/EditProfile';
import HomeScreen from '../screens/Home';
import ProductListingScreen from '../screens/Listing';
import LoginScreen from '../screens/Login';
import MyOrdersScreen from '../screens/MyOrders';
import OnboardingScreen from '../screens/Onboarding';
import OrderTrackingScreen from '../screens/OrderTracking';
import PaymentMethodsScreen from '../screens/PaymentMethods';
import ProfileScreen from '../screens/Profile';
import ShippingAddressesScreen from '../screens/ShippingAddresses';
import SignupScreen from '../screens/Signup';
import SplashScreen from '../screens/Splash';
import OrderSuccessScreen from '../screens/Success';
import { loadUserSession, login, logout } from '../store/authSlice';
import { setData, setLoading } from '../store/dataSlice';

export default function MainNavigation() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderData, setSelectedOrderData] = useState(null);
  const { isAuthenticated, loading: authLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Load app data
    const loadData = async () => {
      dispatch(setLoading(true));
      const data = await fetchAppData();
      dispatch(setData(data));
    };
    loadData();

    // Load user session
    dispatch(loadUserSession());
  }, [dispatch]);

  useEffect(() => {
    if (currentScreen === 'splash' && !authLoading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          setCurrentScreen('home');
        } else {
          setCurrentScreen('onboarding');
        }
      }, 2000); // Reduced splash time a bit for better UX
      return () => clearTimeout(timer);
    }
  }, [currentScreen, isAuthenticated, authLoading]);

  const handleOnboardingFinish = () => {
    setCurrentScreen('login');
  };

  const handleGoToSignup = () => {
    setCurrentScreen('signup');
  };

  const handleBackToLogin = () => {
    setCurrentScreen('login');
  };

  const handleLogin = (userData) => {
    dispatch(login(userData));
    setCurrentScreen('home');
  };

  const handleSeeAll = () => {
    setCurrentScreen('productListing');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setCurrentScreen('productDetails');
  };

  const handleBackToListing = () => {
    setCurrentScreen('productListing');
  };

  const handleGoToCart = () => {
    setCurrentScreen('cart');
  };

  const handleBackFromCart = () => {
    setCurrentScreen('home');
  };

  const handleGoToProfile = () => {
    setCurrentScreen('profile');
  };

  const handleLogout = () => {
    dispatch(logout());
    setCurrentScreen('login');
  };

  const handleGoToCheckout = () => {
    setCurrentScreen('checkout');
  };

  const handleBackFromCheckout = () => {
    setCurrentScreen('cart');
  };

  const handlePaymentSuccess = () => {
    setCurrentScreen('orderSuccess');
  };

  const handleEditProfile = () => {
    setCurrentScreen('editProfile');
  };

  const handleShippingAddresses = () => {
    setCurrentScreen('shippingAddresses');
  };

  const handlePaymentMethods = () => {
    setCurrentScreen('paymentMethods');
  };

  const handleMyOrders = () => {
    setCurrentScreen('myOrders');
  };

  const handleTrackOrder = (orderId, orderData) => {
    setSelectedOrderId(orderId || "#SHP12345");
    setSelectedOrderData(orderData || null);
    setCurrentScreen('orderTracking');
  };

  const handleBackToProfile = () => {
    setCurrentScreen('profile');
  };

  if (currentScreen === 'splash') {
    return <SplashScreen />;
  }

  if (currentScreen === 'onboarding') {
    return <OnboardingScreen onFinish={handleOnboardingFinish} />;
  }

  if (currentScreen === 'login') {
    return <LoginScreen onLogin={handleLogin} onSignupPress={handleGoToSignup} />;
  }

  if (currentScreen === 'signup') {
    return <SignupScreen onSignup={handleLogin} onBackToLogin={handleBackToLogin} />;
  }

  if (currentScreen === 'home') {
    return (
      <HomeScreen
        onSeeAll={handleSeeAll}
        onProductSelect={handleProductSelect}
        onCartPress={handleGoToCart}
        onProfilePress={handleGoToProfile}
        onShopPress={handleSeeAll}
        onHomePress={handleBackToHome}
      />
    );
  }

  if (currentScreen === 'productListing') {
    return (
      <ProductListingScreen
        onBack={handleBackToHome}
        onProductSelect={handleProductSelect}
        onCartPress={handleGoToCart}
        onHomePress={handleBackToHome}
        onShopPress={handleSeeAll}
        onProfilePress={handleGoToProfile}
      />
    );
  }

  if (currentScreen === 'productDetails') {
    return (
      <ProductDetailsScreen
        onBack={handleBackToListing}
        onCartPress={handleGoToCart}
        product={selectedProduct}
      />
    );
  }

  if (currentScreen === 'cart') {
    return (
      <CartScreen
        onBack={handleBackFromCart}
        onCheckout={handleGoToCheckout}
        onHomePress={handleBackToHome}
        onShopPress={handleSeeAll}
        onProfilePress={handleGoToProfile}
        onCartPress={handleGoToCart}
      />
    );
  }

  if (currentScreen === 'profile') {
    return (
      <ProfileScreen
        onBack={handleBackToHome}
        onLogout={handleLogout}
        onHomePress={handleBackToHome}
        onShopPress={handleSeeAll}
        onCartPress={handleGoToCart}
        onProfilePress={handleGoToProfile}
        onEditProfile={handleEditProfile}
        onShippingAddresses={handleShippingAddresses}
        onPaymentMethods={handlePaymentMethods}
        onMyOrders={handleMyOrders}
      />
    );
  }

  if (currentScreen === 'editProfile') {
    return <EditProfileScreen onBack={handleBackToProfile} />;
  }

  if (currentScreen === 'shippingAddresses') {
    return <ShippingAddressesScreen onBack={handleBackToProfile} />;
  }

  if (currentScreen === 'paymentMethods') {
    return <PaymentMethodsScreen onBack={handleBackToProfile} />;
  }

  if (currentScreen === 'myOrders') {
    return <MyOrdersScreen onBack={handleBackToProfile} onTrackOrder={handleTrackOrder} />;
  }

  if (currentScreen === 'checkout') {
    return (
      <CheckoutScreen
        onBack={handleBackFromCheckout}
        onPayment={handlePaymentSuccess}
        onEditAddress={handleShippingAddresses}
      />
    );
  }

  if (currentScreen === 'orderSuccess') {
    return (
      <OrderSuccessScreen
        onContinue={handleBackToHome}
        onTrack={handleTrackOrder}
      />
    );
  }

  if (currentScreen === 'orderTracking') {
    return <OrderTrackingScreen onBack={handleMyOrders} orderId={selectedOrderId} orderData={selectedOrderData} />;
  }

  return null;
}
