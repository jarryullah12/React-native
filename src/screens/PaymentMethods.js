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

const PaymentMethodsScreen = ({ onBack }) => {
  const [cards, setCards] = useState([
    {
      id: 1,
      type: 'Mastercard',
      number: '1264 5467 6794 6494',
      expiry: '08/28',
      holder: 'Jarry Ullah',
      isDefault: true,
      color: '#4338ca'
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    holderName: ''
  });
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    holder: '',
    type: 'Visa'
  });

  const handleAddNew = () => {
    setModalVisible(true);
  };

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setBankModalVisible(true);
  };

  const handleSaveBankDetails = () => {
    if (!bankDetails.accountNumber || !bankDetails.holderName) {
      Alert.alert("Error", "Please fill all bank details");
      return;
    }
    
    Alert.alert(
      "Success", 
      `${selectedBank.name} account added successfully!`,
      [{ text: "OK", onPress: () => {
        setBankModalVisible(false);
        setBankDetails({ accountNumber: '', holderName: '' });
      }}]
    );
  };

  const handleSaveCard = () => {
    if (!newCard.number || !newCard.expiry || !newCard.holder) {
      Alert.alert("Error", "Please fill all card details");
      return;
    }

    const card = {
      id: Date.now(),
      type: newCard.type,
      number: `**** **** **** ${newCard.number.slice(-4)}`,
      expiry: newCard.expiry,
      holder: newCard.holder,
      isDefault: cards.length === 0,
      color: newCard.type === 'Visa' ? '#1e293b' : '#4338ca'
    };

    setCards([...cards, card]);
    setModalVisible(false);
    setNewCard({ number: '', expiry: '', holder: '', type: 'Visa' });
    Alert.alert("Success", "New card added successfully!");
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Remove Card",
      "Are you sure you want to remove this payment method?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive", 
          onPress: () => {
            setCards(cards.filter(card => card.id !== id));
          } 
        }
      ]
    );
  };

  const handleSetDefault = (id) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === id
    })));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Add Card Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Card</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.typeSelector}>
                <TouchableOpacity 
                  style={[styles.typeOption, newCard.type === 'Visa' && styles.typeSelected]}
                  onPress={() => setNewCard({...newCard, type: 'Visa'})}
                >
                  <Text style={[styles.typeText, newCard.type === 'Visa' && styles.typeTextSelected]}>Visa</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.typeOption, newCard.type === 'Mastercard' && styles.typeSelected]}
                  onPress={() => setNewCard({...newCard, type: 'Mastercard'})}
                >
                  <Text style={[styles.typeText, newCard.type === 'Mastercard' && styles.typeTextSelected]}>Mastercard</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Card Holder Name</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="e.g. Jarry Ullah"
                  value={newCard.holder}
                  onChangeText={(val) => setNewCard({...newCard, holder: val})}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Card Number</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="numeric"
                  maxLength={16}
                  value={newCard.number}
                  onChangeText={(val) => setNewCard({...newCard, number: val})}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 12 }]}>
                  <Text style={styles.label}>Expiry Date</Text>
                  <TextInput 
                    style={styles.input}
                    placeholder="MM/YY"
                    maxLength={5}
                    value={newCard.expiry}
                    onChangeText={(val) => setNewCard({...newCard, expiry: val})}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput 
                    style={styles.input}
                    placeholder="123"
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveCard}>
                <Text style={styles.saveBtnText}>Save Card</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bank Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={bankModalVisible}
        onRequestClose={() => setBankModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {selectedBank && (
                  <View style={[styles.bankIconSmall, { backgroundColor: selectedBank.color, marginRight: 12 }]}>
                    <Text style={styles.bankInitialSmall}>{selectedBank.name[0]}</Text>
                  </View>
                )}
                <Text style={styles.modalTitle}>{selectedBank?.name} Details</Text>
              </View>
              <TouchableOpacity onPress={() => setBankModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Account Holder Name</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="e.g. Jarry Ullah"
                  value={bankDetails.holderName}
                  onChangeText={(val) => setBankDetails({...bankDetails, holderName: val})}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Account Number / IBAN</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="PK00 XXXX XXXX XXXX XXXX"
                  value={bankDetails.accountNumber}
                  onChangeText={(val) => setBankDetails({...bankDetails, accountNumber: val})}
                />
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveBankDetails}>
                <Text style={styles.saveBtnText}>Connect Bank Account</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#111318" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Your Saved Cards</Text>
        
        {cards.length > 0 ? (
          cards.map((card) => (
            <TouchableOpacity 
              key={card.id} 
              style={[styles.card, { backgroundColor: card.color }]}
              onPress={() => handleSetDefault(card.id)}
              onLongPress={() => handleDelete(card.id)}
              activeOpacity={0.9}
            >
              <View style={styles.cardTop}>
                <View style={styles.cardBrand}>
                  <Text style={styles.cardTypeName}>{card.type}</Text>
                </View>
              </View>
              
              <Text style={styles.cardNumber}>{card.number}</Text>
              
              <View style={styles.cardBottom}>
                <View>
                  <Text style={styles.cardLabel}>CARD HOLDER</Text>
                  <Text style={styles.cardValue}>{card.holder}</Text>
                </View>
                <View>
                  <Text style={styles.cardLabel}>EXPIRES</Text>
                  <Text style={styles.cardValue}>{card.expiry}</Text>
                </View>
              </View>
              
              {card.isDefault && (
                <View style={styles.defaultIndicator}>
                  <MaterialIcons name="check-circle" size={20} color="white" />
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="credit-card-off" size={80} color="#e2e8f0" />
            <Text style={styles.emptyText}>No cards saved yet</Text>
          </View>
        )}

        <TouchableOpacity style={styles.addBtn} onPress={handleAddNew}>
          <View style={styles.addBtnIcon}>
            <MaterialIcons name="add" size={24} color="#135bec" />
          </View>
          <Text style={styles.addBtnText}>Add New Payment Method</Text>
        </TouchableOpacity>

        <View style={styles.otherMethods}>
          <Text style={styles.sectionTitle}>Net Banking</Text>
          <View style={styles.bankGrid}>
            {[
              { id: 'hbl', name: 'HBL', color: '#008269' },
              { id: 'ubl', name: 'UBL', color: '#005da4' },
              { id: 'meezan', name: 'Meezan', color: '#822025' },
              { id: 'alfalah', name: 'Alfalah', color: '#be202e' },
              { id: 'allied', name: 'Allied', color: '#1d4ed8' },
              { id: 'bop', name: 'BOP', color: '#15803d' },
              { id: 'sc', name: 'StanChart', color: '#059669' },
              { id: 'askari', name: 'Askari', color: '#0369a1' },
              { id: 'habib', name: 'Habib', color: '#1e3a8a' },
              { id: 'mcb', name: 'MCB', color: '#065f46' },
              { id: 'nbp', name: 'NBP', color: '#047857' },
              { id: 'js', name: 'JS Bank', color: '#b91c1c' }
            ].map((bank) => (
              <TouchableOpacity 
                  key={bank.id} 
                  style={styles.bankItem}
                  onPress={() => handleBankSelect(bank)}
                >
                <View style={[styles.bankIcon, { backgroundColor: bank.color }]}>
                  <Text style={styles.bankInitial}>{bank.name[0]}</Text>
                </View>
                <Text style={styles.bankName} numberOfLines={1}>{bank.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111318',
    marginBottom: 16,
    marginTop: 8,
  },
  card: {
    height: 200,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  cardBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTypeName: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  cardType: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  cardNumber: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 30,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bankGrid: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 10,
  },
  bankItem: {
    width: '22.5%',
    alignItems: 'center',
    marginBottom: 16,
  },
  bankIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bankInitial: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  bankIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankInitialSmall: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  bankName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  defaultIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#135bec',
    borderRadius: 15,
    padding: 4,
    borderWidth: 3,
    borderColor: '#f6f6f8',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    marginBottom: 30,
  },
  addBtnIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#135bec',
  },
  otherMethods: {
    marginTop: 10,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111318',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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
    maxHeight: '90%',
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
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  typeOption: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  typeSelected: {
    borderColor: '#135bec',
    backgroundColor: '#eff6ff',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
  },
  typeTextSelected: {
    color: '#135bec',
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
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    height: 52,
    fontSize: 16,
    color: '#111318',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: '#135bec',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PaymentMethodsScreen;
