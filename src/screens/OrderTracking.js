import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const OrderTrackingScreen = ({ onBack, orderId = "#ORD-2026-9921", orderData }) => {
  const [partnerLocation, setPartnerLocation] = useState({ lon: 73.0551, lat: 33.6744 });
  const [startLocation] = useState({ lon: 73.0551, lat: 33.6744 });
  const [userLocation] = useState({ lon: 73.0751, lat: 33.6944 });
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [useFallbackMap, setUseFallbackMap] = useState(false);

  const getMapUrl = useCallback((pLoc, uLoc, fallback = false) => {
    if (fallback) {
      return `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${(pLoc.lon + uLoc.lon) / 2},${(pLoc.lat + uLoc.lat) / 2}&z=13&l=map&size=600,400&pt=${pLoc.lon},${pLoc.lat},pm2rdm~${uLoc.lon},${uLoc.lat},pm2wtm`;
    }
    const accessToken = 'pk.eyJ1Ijoic2hvcGx5LWRlbW8iLCJhIjoiY2xoZzFwZzE0MG1icDNkbXF6ZzN3Z3N4YyJ9';
    // Mapbox markers: pin-s-home+135bec(user), pin-s-car+ef4444(partner)
    // Path: path-5+135bec-0.5(start_lon,start_lat,user_lon,user_lat)
    const markers = `pin-s-home+135bec(${uLoc.lon},${uLoc.lat}),pin-s-car+ef4444(${pLoc.lon},${pLoc.lat})`;
    const path = `path-5+135bec-0.4(${startLocation.lon},${startLocation.lat},${uLoc.lon},${uLoc.lat})`;
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${path},${markers}/auto/600x400?access_token=${accessToken}`;
  }, [startLocation.lon, startLocation.lat]);

  const mapUrl = useMemo(() => {
    return getMapUrl(partnerLocation, userLocation, useFallbackMap);
  }, [getMapUrl, partnerLocation, userLocation, useFallbackMap]);

  // Fallback to another map if first one fails
  const handleMapError = useCallback(() => {
    if (!useFallbackMap) {
      setUseFallbackMap(true);
    } else {
      setMapError(true);
      setIsMapLoading(false);
    }
  }, [useFallbackMap]);

  const [message, setMessage] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for LIVE badge
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Simulation effect to move the partner
  useEffect(() => {
    const interval = setInterval(() => {
      setPartnerLocation(prev => {
        const dLon = (userLocation.lon - prev.lon) * 0.05;
        const dLat = (userLocation.lat - prev.lat) * 0.05;
        
        // Agar movement bohot thodi hai toh update na karein (prevents flickering)
        const threshold = 0.0005;
        if (Math.abs(dLon) < threshold && Math.abs(dLat) < threshold) {
          // Stop moving if close enough
          if (Math.abs(dLon) < 0.0001 && Math.abs(dLat) < 0.0001) {
            clearInterval(interval);
          }
          return prev;
        }

        return {
          lon: prev.lon + dLon,
          lat: prev.lat + dLat
        };
      });
    }, 10000); // Update every 10 seconds to reduce reloads

    return () => clearInterval(interval);
  }, [userLocation.lon, userLocation.lat]);

  useEffect(() => {
    let timer;
    if (isMapLoading) {
      timer = setTimeout(() => {
        handleMapError();
      }, 15000); // 15 second timeout to give more time for static image to load
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isMapLoading, mapUrl, handleMapError]);

  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Assalam-o-Alaikum! Main aapka order pick kar chuka hoon.', sender: 'partner', time: '11:05 AM' },
    { id: 2, text: 'Walaikum Assalam, theek hai. Kitni dair tak pohnchenge?', sender: 'user', time: '11:06 AM' },
    { id: 3, text: 'Bas 10-15 minutes mein aapki location par hunga.', sender: 'partner', time: '11:10 AM' },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const userMsg = message.trim();
      const newMessage = {
        id: Date.now(),
        text: userMsg,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const replies = [
            "Theek hai sir, main bas raste mein hoon.",
            "Ji, main location check kar raha hoon.",
            "Bas 5 minute mazeed, traffic thoda kam ho raha hai.",
            "Main aapke ghar ke bahar pohnchne wala hoon."
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          const partnerReply = {
            id: Date.now() + 1,
            text: randomReply,
            sender: 'partner',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, partnerReply]);
        }, 1500);
      }, 800);
    }
  };

  const order = orderData || {
    id: orderId,
    status: 'Raste Mein Hai',
    date: '16 Jan 2026',
    eta: '12 - 15 min',
    timeline: [
      { title: 'Order Picked Up', time: '11:05 AM', status: 'completed', desc: 'Hamza ne aapka order pick kar liya hai.' },
      { title: 'Out for Delivery', time: '11:10 AM', status: 'current', desc: 'Delivery partner aapki location ki taraf aa raha hai.' },
      { title: 'Arriving Soon', time: 'Expected 11:25 AM', status: 'pending', desc: 'Taiyaar rahein, order jald hi pahunch jayega.' },
    ],
    partner: {
      name: 'Hamza Ahmad',
      role: 'Shoply Delivery Hero',
      phone: '+923356471303',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop'
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 1. Map Area */}
      <View style={styles.mapContainer}>
        {mapError ? (
          <View style={[styles.mapImage, styles.mapFallback]}>
            <MaterialIcons name="map" size={80} color="#cbd5e1" />
            <Text style={styles.mapFallbackText}>Live map loading...</Text>
            <Text style={styles.mapSubText}>Tracking Hamza...</Text>
          </View>
        ) : (
          <>
            <Image 
              source={{ uri: mapUrl }} 
              style={styles.mapImage}
              resizeMode="cover"
              onLoadStart={() => setIsMapLoading(true)}
              onLoadEnd={() => setIsMapLoading(false)}
              onError={handleMapError}
            />
            {isMapLoading && (
              <View style={[styles.mapImage, styles.mapLoadingOverlay]}>
                <ActivityIndicator size="large" color="#135bec" />
                <Text style={styles.loadingText}>Map load ho raha hai...</Text>
              </View>
            )}
          </>
        )}
        
        <Animated.View style={[styles.liveBadge, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE TRACKING</Text>
        </Animated.View>

        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#111318" />
        </TouchableOpacity>
      </View>

      {/* 2. Info Sheet & Chat */}
      <View style={styles.trackingSheet}>
        <View style={styles.sheetHeader}>
          <View style={styles.dragHandle} />
          <View style={styles.headerInfo}>
            <View>
              <Text style={styles.orderLabel}>Order ID</Text>
              <Text style={styles.orderIdText}>{order.id}</Text>
            </View>
            <View style={styles.etaContainer}>
              <Text style={styles.etaLabel}>Pohnchne ka waqt</Text>
              <Text style={styles.etaText}>{order.eta}</Text>
            </View>
          </View>
        </View>

        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Status Timeline */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Status</Text>
              {order.timeline.map((step, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    {step.status === 'completed' ? (
                      <View style={[styles.dot, styles.activeDot]} />
                    ) : step.status === 'current' ? (
                      <View style={[styles.dot, styles.currentDot]}>
                        <View style={styles.innerDot} />
                      </View>
                    ) : (
                      <View style={styles.dot} />
                    )}
                    {index < order.timeline.length - 1 && (
                      <View style={[styles.line, step.status === 'completed' && styles.activeLine]} />
                    )}
                  </View>
                  <View style={styles.timelineRight}>
                    <View style={styles.timelineHeader}>
                      <Text style={[styles.timelineTitle, step.status === 'current' && styles.currentText]}>
                        {step.title}
                      </Text>
                      <Text style={styles.timelineTime}>{step.time}</Text>
                    </View>
                    {step.desc && <Text style={styles.timelineDesc}>{step.desc}</Text>}
                  </View>
                </View>
              ))}
            </View>

            {/* Delivery Partner */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Partner</Text>
              <View style={styles.deliveryPartnerCard}>
                <Image source={{ uri: order.partner?.image }} style={styles.partnerAvatar} />
                <View style={styles.partnerInfo}>
                  <Text style={styles.partnerName}>{order.partner?.name}</Text>
                  <Text style={styles.partnerRole}>{order.partner?.role}</Text>
                  <View style={styles.ratingRow}>
                    <MaterialIcons name="star" size={14} color="#f59e0b" />
                    <Text style={styles.ratingText}>{order.partner?.rating}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.callBtn} 
                  onPress={() => {
                    Linking.openURL(`tel:${order.partner?.phone}`).catch(() => 
                      Alert.alert("Error", "Could not open dialer.")
                    );
                  }}
                >
                  <MaterialIcons name="call" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Chat Messages */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chat with Hamza</Text>
              <View style={styles.messagesContainer}>
                {messages.map((msg) => (
                  <View 
                    key={msg.id} 
                    style={[
                      styles.messageWrapper, 
                      msg.sender === 'user' ? styles.userMessageWrapper : styles.partnerMessageWrapper
                    ]}
                  >
                    <View style={[
                      styles.messageBubble, 
                      msg.sender === 'user' ? styles.userBubble : styles.partnerBubble
                    ]}>
                      <Text style={[
                        styles.messageText,
                        msg.sender === 'user' ? styles.userMessageText : styles.partnerMessageText
                      ]}>
                        {msg.text}
                      </Text>
                      <Text style={styles.messageTime}>{msg.time}</Text>
                    </View>
                  </View>
                ))}
                {isTyping && (
                  <View style={styles.partnerMessageWrapper}>
                    <View style={[styles.messageBubble, styles.partnerBubble, styles.typingBubble]}>
                      <Text style={styles.typingText}>Hamza type kar raha hai...</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Message Input Box */}
          <View style={styles.inputBarContainer}>
            <View style={styles.inputBar}>
              <TextInput
                style={styles.input}
                placeholder="Hamza ko message karein..."
                value={message}
                onChangeText={setMessage}
                placeholderTextColor="#94a3b8"
              />
              <TouchableOpacity 
                style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]} 
                onPress={handleSendMessage}
                disabled={!message.trim()}
              >
                <MaterialCommunityIcons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mapContainer: {
    height: height * 0.4,
    width: width,
    position: 'relative',
  },
  mapImage: {
    ...StyleSheet.absoluteFillObject,
  },
  mapFallback: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapLoadingOverlay: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  mapFallbackText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '600',
  },
  mapSubText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  liveBadge: {
    position: 'absolute',
    top: 55,
    right: 20,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#111318',
    letterSpacing: 0.5,
  },
  trackingSheet: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10,
  },
  sheetHeader: {
    paddingHorizontal: 24,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  orderLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  orderIdText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111318',
    marginTop: 2,
  },
  etaContainer: {
    alignItems: 'flex-end',
  },
  etaLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  etaText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#135bec',
    marginTop: 2,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111318',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
    width: 24,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#e2e8f0',
    zIndex: 2,
  },
  activeDot: {
    backgroundColor: '#135bec',
  },
  currentDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(19, 91, 236, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  innerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#135bec',
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 4,
  },
  activeLine: {
    backgroundColor: '#135bec',
  },
  timelineRight: {
    flex: 1,
    paddingBottom: 32,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  currentText: {
    color: '#111318',
    fontWeight: '700',
  },
  timelineTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  timelineDesc: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    lineHeight: 18,
  },
  deliveryPartnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  partnerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  partnerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  partnerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111318',
  },
  partnerRole: {
    fontSize: 11,
    color: '#135bec',
    fontWeight: '600',
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 11,
    color: '#64748b',
    marginLeft: 4,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#135bec',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    minHeight: 150,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  partnerMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#135bec',
    borderBottomRightRadius: 4,
  },
  partnerBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  typingBubble: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#f1f5f9',
    opacity: 0.8,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  userMessageText: {
    color: 'white',
  },
  partnerMessageText: {
    color: '#111318',
  },
  typingText: {
    fontSize: 11,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  messageTime: {
    fontSize: 9,
    color: '#94a3b8',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputBarContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 35 : 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 25,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    height: 46,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#111318',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#135bec',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendBtnDisabled: {
    backgroundColor: '#cbd5e1',
  },
});

export default OrderTrackingScreen;
