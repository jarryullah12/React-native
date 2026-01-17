import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
 
 const { width, height } = Dimensions.get('window'); 
 
 const SplashScreen = () => { 
   // Animations ke liye refs 
   const fadeAnim = useRef(new Animated.Value(0)).current; 
   const scaleAnim = useRef(new Animated.Value(0.8)).current; 
 
   useEffect(() => { 
     // Logo aur Text ka fade-in aur scale-up animation 
     Animated.parallel([ 
       Animated.timing(fadeAnim, { 
         toValue: 1, 
         duration: 1000, 
         useNativeDriver: true, 
       }), 
       Animated.spring(scaleAnim, { 
         toValue: 1, 
         friction: 4, 
         useNativeDriver: true, 
       }), 
     ]).start(); 
   }, [fadeAnim, scaleAnim]); 
 
   return ( 
     <View style={styles.container}> 
       {/* Abstract Background Blobs (Blur effect ke liye) */} 
       <View style={[styles.blob, styles.topBlob]} /> 
       <View style={[styles.blob, styles.bottomBlob]} /> 
 
       <Animated.View style={[styles.mainContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}> 
         {/* Logo Container */} 
         <View style={styles.logoWrapper}> 
           <View style={styles.logoGlow} /> 
           <LinearGradient 
             colors={['#135bec', '#4f8aff']} 
             style={styles.logoBox} 
           > 
             <MaterialIcons name="local-mall" size={48} color="white" /> 
           </LinearGradient> 
         </View> 
 
         {/* Typography */} 
         <View style={styles.textContainer}> 
           <Text style={styles.appName}>Shoply</Text> 
           <Text style={styles.tagline}>Shop Smart, Live Better</Text> 
         </View> 
 
         {/* Loading Indicator */} 
         <View style={styles.loaderContainer}> 
           <ActivityIndicator size="large" color="#135bec" /> 
         </View> 
       </Animated.View> 
 
       {/* Footer Version */} 
       <View style={styles.footer}> 
         <Text style={styles.versionText}>VERSION 1.0.0</Text> 
       </View> 
     </View> 
   ); 
 }; 
 
 const styles = StyleSheet.create({ 
   container: { 
     flex: 1, 
     backgroundColor: '#f6f6f8', // Light background 
     alignItems: 'center', 
     justifyContent: 'center', 
     overflow: 'hidden', 
   }, 
   // Background abstract designs 
   blob: { 
     position: 'absolute', 
     width: width * 1.5, 
     height: width * 1.5, 
     borderRadius: (width * 1.5) / 2, 
     opacity: 0.15, 
   }, 
   topBlob: { 
     backgroundColor: '#135bec', 
     top: -height * 0.3, 
     left: -width * 0.5, 
   }, 
   bottomBlob: { 
     backgroundColor: '#a855f7', 
     bottom: -height * 0.3, 
     right: -width * 0.5, 
   }, 
   mainContent: { 
     alignItems: 'center', 
     zIndex: 10, 
   }, 
   logoWrapper: { 
     position: 'relative', 
     marginBottom: 24, 
   }, 
   logoGlow: { 
     position: 'absolute', 
     top: -10, 
     left: -10, 
     right: -10, 
     bottom: -10, 
     backgroundColor: 'rgba(19, 91, 236, 0.2)', 
     borderRadius: 24, 
     blurRadius: 20, 
   }, 
   logoBox: { 
     width: 100, 
     height: 100, 
     borderRadius: 24, 
     justifyContent: 'center', 
     alignItems: 'center', 
     elevation: 10, // Shadow for Android 
     shadowColor: '#135bec', // Shadow for iOS 
     shadowOffset: { width: 0, height: 10 }, 
     shadowOpacity: 0.3, 
     shadowRadius: 15, 
   }, 
   textContainer: { 
     alignItems: 'center', 
     marginTop: 10, 
   }, 
   appName: { 
     fontSize: 40, 
     fontWeight: '800', 
     color: '#111318', 
     letterSpacing: -0.5, 
   }, 
   tagline: { 
     fontSize: 16, 
     color: '#64748b', 
     marginTop: 5, 
     fontWeight: '400', 
     letterSpacing: 0.5, 
   }, 
   loaderContainer: { 
     marginTop: 40, 
   }, 
   footer: { 
     position: 'absolute', 
     bottom: 40, 
   }, 
   versionText: { 
     fontSize: 12, 
     color: '#94a3b8', 
     letterSpacing: 2, 
     fontWeight: '600', 
   }, 
 }); 
 
 export default SplashScreen; 
