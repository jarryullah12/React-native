import React from 'react';
import { Provider } from 'react-redux'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store/store'; 
import MainNavigation from './src/navigation/MainNavigation'; 

export default function App() { 
  return ( 
    <Provider store={store}> 
      <SafeAreaProvider>
        <MainNavigation /> 
      </SafeAreaProvider>
    </Provider> 
  ); 
}
