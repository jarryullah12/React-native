import React from 'react'; 
 import {  
  View,  
  Text,  
  StyleSheet,  
  Image,  
  TouchableOpacity,  
  Dimensions  
} from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context'; 
 import { MaterialIcons } from '@expo/vector-icons'; 
import { useSelector } from 'react-redux';
 
const { width, height } = Dimensions.get('window'); 
 
const OnboardingScreen = ({ onFinish }) => { 
  const { onboarding, loading } = useSelector(state => state.data);
  
  if (loading || onboarding.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const onboardingData = onboarding[0];

  return ( 
    <SafeAreaView style={styles.container}> 
      {/* 1. Illustration Section */} 
      <View style={styles.illustrationContainer}> 
        <Image 
          source={{ uri: onboardingData.image }} 
          style={styles.image} 
          resizeMode="contain" 
        /> 
      </View> 
 
      {/* 2. Content Section */} 
      <View style={styles.contentCard}> 
        {/* Text Content */} 
        <View style={styles.textWrapper}> 
          <Text style={styles.title}>{onboardingData.title}</Text> 
          <Text style={styles.description}>{onboardingData.description}</Text>
        </View> 
  
         {/* 3. Page Indicators (Dots) */} 
         <View style={styles.indicatorContainer}> 
           <View style={[styles.dot, styles.activeDot]} /> 
           <View style={styles.dot} /> 
           <View style={styles.dot} /> 
         </View> 
  
         {/* 4. Button Group */} 
         <View style={styles.buttonRow}> 
           {/* Skip Button */} 
           <TouchableOpacity style={styles.skipButton} onPress={onFinish}> 
             <Text style={styles.skipText}>Skip</Text> 
           </TouchableOpacity> 
  
           {/* Continue Button */} 
           <TouchableOpacity style={styles.continueButton} onPress={onFinish}> 
             <Text style={styles.continueText}>Continue</Text> 
             <MaterialIcons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} /> 
           </TouchableOpacity> 
         </View> 
          
         {/* Safe Area Spacer for iOS */} 
         <View style={{ height: 20 }} /> 
       </View> 
     </SafeAreaView> 
   ); 
 }; 
  
 const styles = StyleSheet.create({ 
   container: { 
     flex: 1, 
     backgroundColor: '#f6f6f8', // background-light 
   }, 
   illustrationContainer: { 
     flex: 1, 
     justifyContent: 'center', 
     alignItems: 'center', 
     paddingTop: 40, 
   }, 
   image: { 
     width: width * 0.85, 
     height: height * 0.4, 
   }, 
   contentCard: { 
     backgroundColor: '#f6f6f8', 
     borderTopLeftRadius: 30, 
     borderTopRightRadius: 30, 
     paddingHorizontal: 24, 
   }, 
   textWrapper: { 
     alignItems: 'center', 
     paddingVertical: 20, 
   }, 
   title: { 
     fontSize: 32, 
     fontWeight: '800', 
     color: '#111318', 
     textAlign: 'center', 
     lineHeight: 38, 
     marginBottom: 12, 
   }, 
   description: { 
     fontSize: 16, 
     color: '#637588', 
     textAlign: 'center', 
     lineHeight: 24, 
     paddingHorizontal: 20, 
   }, 
   indicatorContainer: { 
     flexDirection: 'row', 
     justifyContent: 'center', 
     alignItems: 'center', 
     marginVertical: 24, 
   }, 
   dot: { 
     height: 8, 
     width: 8, 
     borderRadius: 4, 
     backgroundColor: '#dbdfe6', 
     marginHorizontal: 4, 
   }, 
   activeDot: { 
     width: 24, // Wider dot for active state 
     backgroundColor: '#135bec', // Primary color 
   }, 
   buttonRow: { 
     flexDirection: 'row', 
     justifyContent: 'space-between', 
     alignItems: 'center', 
     paddingVertical: 20, 
   }, 
   skipButton: { 
     paddingVertical: 12, 
     paddingHorizontal: 16, 
   }, 
   skipText: { 
     color: '#637588', 
     fontSize: 14, 
     fontWeight: '700', 
   }, 
   continueButton: { 
     backgroundColor: '#135bec', 
     flexDirection: 'row', 
     alignItems: 'center', 
     paddingVertical: 14, 
     paddingHorizontal: 24, 
     borderRadius: 12, 
     shadowColor: '#135bec', 
     shadowOffset: { width: 0, height: 4 }, 
     shadowOpacity: 0.2, 
     shadowRadius: 8, 
     elevation: 5, 
   }, 
   continueText: { 
     color: 'white', 
     fontSize: 14, 
     fontWeight: '700', 
   }, 
 }); 
  
 export default OnboardingScreen; 
