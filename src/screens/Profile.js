import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
    Alert,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import BottomNav from '../components/BottomNav';
import { login } from '../store/authSlice';

const ProfileScreen = ({ 
  onBack, 
  onLogout, 
  onHomePress, 
  onCartPress, 
  onShopPress, 
  onProfilePress,
  onEditProfile,
  onShippingAddresses,
  onPaymentMethods,
  onMyOrders
}) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      dispatch(login({ ...user, avatar: selectedImage }));
      Alert.alert("Success", "Profile picture updated!");
    }
  };

  const handleChangeAvatar = () => {
    pickImage();
  };

  // Menu Item Component
  const MenuItem = ({ icon, title, isLast, color = "#135bec", textColor = "#111318", onPress }) => (
    <TouchableOpacity 
      style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <MaterialIcons name={icon} size={22} color={color} />
      </View>
      <Text style={[styles.menuText, { color: textColor }]}>{title}</Text>
      <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 1. Top App Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#111318" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 2. Profile Header Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={handleChangeAvatar}>
            <Image
              source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' }}
              style={styles.avatar}
            />
            <View style={styles.cameraIcon}>
              <MaterialIcons name="camera-alt" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{user?.name || 'Jarry Ullah'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'jarryullah46@gmail.com'}</Text>
          
          <TouchableOpacity style={styles.editProfileTag} onPress={onEditProfile}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Menu Group 1: Account Settings */}
        <View style={styles.menuGroup}>
          <MenuItem icon="person" title="Edit Profile" onPress={onEditProfile} />
          <MenuItem icon="location-on" title="Shipping Addresses" onPress={onShippingAddresses} />
          <MenuItem icon="credit-card" title="Payment Methods" onPress={onPaymentMethods} />
          <MenuItem icon="inventory-2" title="My Orders" isLast={true} onPress={onMyOrders} />
        </View>

        {/* 4. Menu Group 2: Actions */}
        <View style={styles.menuGroup}>
          <MenuItem 
            icon="logout" 
            title="Log out" 
            color="#ef4444" 
            textColor="#ef4444" 
            isLast={true} 
            onPress={onLogout}
          />
        </View>

      </ScrollView>

      {/* 5. Bottom Navigation Bar */}
      <BottomNav 
        activeTab="profile"
        onHomePress={onHomePress}
        onShopPress={onShopPress}
        onCartPress={onCartPress}
        onProfilePress={onProfilePress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111318',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#135bec',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111318',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  editProfileTag: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#e0e7ff',
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#135bec',
  },
  menuGroup: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12,
  },

});

export default ProfileScreen;