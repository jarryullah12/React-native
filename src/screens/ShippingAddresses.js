import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';

const ShippingAddressesScreen = ({ onBack }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      name: user?.name || 'Jarry Ullah',
      address: user?.address || '123 Innovation Dr, Tech City, CA 94043',
      phone: user?.phone || '+91 9876543210',
      isDefault: true
    },
    {
      id: 2,
      type: 'Office',
      name: user?.name || 'Jarry Ullah',
      address: '456 Business Park, Silicon Valley, CA 95051',
      phone: user?.phone || '+91 1234567890',
      isDefault: false
    }
  ]);

  // Sync default address to Redux user object
  const syncWithRedux = (updatedAddresses) => {
    const defaultAddr = updatedAddresses.find(a => a.isDefault);
    if (defaultAddr && user) {
      dispatch(login({
        ...user,
        address: defaultAddr.address,
        phone: defaultAddr.phone
      }));
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Home',
    name: '',
    address: '',
    phone: ''
  });

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      type: 'Home',
      name: user?.name || '',
      address: '',
      phone: user?.phone || ''
    });
    setIsModalVisible(true);
  };

  const handleEdit = (item) => {
    setEditingAddress(item);
    setFormData({
      type: item.type,
      name: item.name,
      address: item.address,
      phone: item.phone
    });
    setIsModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.address || !formData.phone) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    let updated;
    if (editingAddress) {
      updated = addresses.map(addr => 
        addr.id === editingAddress.id ? { ...addr, ...formData } : addr
      );
    } else {
      const newAddress = {
        id: Date.now(),
        ...formData,
        isDefault: addresses.length === 0
      };
      updated = [...addresses, newAddress];
    }
    
    setAddresses(updated);
    syncWithRedux(updated);
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            const updated = addresses.filter(addr => addr.id !== id);
            if (addresses.find(a => a.id === id)?.isDefault && updated.length > 0) {
              updated[0].isDefault = true;
            }
            setAddresses(updated);
            syncWithRedux(updated);
          } 
        }
      ]
    );
  };

  const handleSetDefault = (id) => {
    const updated = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setAddresses(updated);
    syncWithRedux(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#111318" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shipping Addresses</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {addresses.length > 0 ? (
          addresses.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.addressCard, item.isDefault && styles.defaultCard]}
              onPress={() => handleSetDefault(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.typeContainer}>
                  <MaterialIcons 
                    name={item.type === 'Home' ? 'home' : 'work'} 
                    size={18} 
                    color={item.isDefault ? '#135bec' : '#64748b'} 
                  />
                  <Text style={[styles.typeText, item.isDefault && styles.activeTypeText]}>{item.type}</Text>
                </View>
                {item.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
              </View>

              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.addressText}>{item.address}</Text>
              <Text style={styles.phoneText}>{item.phone}</Text>

              <View style={styles.cardFooter}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(item)}>
                  <Text style={styles.actionBtnText}>Edit</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
                  <Text style={[styles.actionBtnText, { color: '#ef4444' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="location-off" size={80} color="#e2e8f0" />
            <Text style={styles.emptyText}>No addresses saved yet</Text>
          </View>
        )}

        <TouchableOpacity style={styles.addBtn} onPress={handleAddNew}>
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.addBtnText}>Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit/Add Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#111318" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Address Type</Text>
                <View style={styles.typeRow}>
                  {['Home', 'Office', 'Other'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption,
                        formData.type === type && styles.activeTypeOption
                      ]}
                      onPress={() => setFormData({ ...formData, type })}
                    >
                      <Text style={[
                        styles.typeOptionText,
                        formData.type === type && styles.activeTypeOptionText
                      ]}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Enter full name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Address</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  placeholder="Enter complete address"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save Address</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  },
  addressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  defaultCard: {
    borderColor: '#135bec',
    backgroundColor: '#f8faff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 6,
  },
  activeTypeText: {
    color: '#135bec',
  },
  defaultBadge: {
    backgroundColor: '#135bec',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  defaultBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111318',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 14,
    color: '#111318',
    fontWeight: '500',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#135bec',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#e2e8f0',
  },
  addBtn: {
    backgroundColor: '#111318',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111318',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeTypeOption: {
    backgroundColor: '#eff6ff',
    borderColor: '#135bec',
  },
  typeOptionText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  activeTypeOptionText: {
    color: '#135bec',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#111318',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: '#135bec',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  saveBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ShippingAddressesScreen;
