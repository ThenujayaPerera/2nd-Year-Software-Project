import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, X, Minimize2, Maximize2, MessageCircle, Sparkles, ExternalLink, Bot, User, ArrowRight, ShieldCheck, MapPin, Phone, Clock } from 'lucide-react';

export default function SupportBot({ isProducts = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: isProducts 
        ? "👋 Ayubowan & Welcome to NVSHOP.LK! I am your AI Tech Assistant. Looking for genuine Smart Watches, GaN Fast Chargers, Power Banks, Soundcore Earbuds, or Apple accessories? Ask me anything!" 
        : "👋 Ayubowan & Welcome to NVSHOP.LK! I'm your dedicated 24/7 AI Assistant. How can I assist you with products, island-wide delivery, warranty, or store information today?",
      timestamp: new Date(),
      suggestions: [],
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const handleOpenBot = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener('open-support-bot', handleOpenBot);
    return () => window.removeEventListener('open-support-bot', handleOpenBot);
  }, []);

  // --- Official NVSHOP.LK Knowledge Base & Product Inventory ---
  const KNOWLEDGE_BASE = {
    // 1. SMART WATCHES
    smartwatch: {
      keywords: ['watch', 'smart watch', 'smartwatch', 'watches', 'black shark', 'green lion watch', 'haylou', 'wiwu', 'amoled', 'calling watch', 'fitness watch', 'clock'],
      response: "⌚ Here are our top genuine Smart Watches with crystal-clear AMOLED displays, Bluetooth calling, and full company warranty:",
      suggestions: [
        { name: 'Green Lion Gravix Smart Watch', price: 'Rs. 14,500', warranty: '6 Months', brand: 'Green Lion', link: '/products?q=smart%20watches' },
        { name: 'Black Shark S3 Smart Watch', price: 'Rs. 16,900', warranty: '6 Months', brand: 'Black Shark', link: '/products?q=black%20shark' },
        { name: 'Green Lion Hilux Smart Watch', price: 'Rs. 13,900', warranty: '6 Months', brand: 'Green Lion', link: '/products?q=smart%20watches' },
        { name: 'Haylou RS5 Smart Watch', price: 'Rs. 13,500', warranty: '6 Months', brand: 'Haylou', link: '/products?q=haylou' }
      ]
    },

    // 2. POWER BANKS
    powerbank: {
      keywords: ['powerbank', 'power bank', 'power banks', 'battery', 'portable charger', 'mah', 'ugreen powerbank', 'anker power bank', '300w', '165w', '20000mah', '48000mah'],
      response: "🔋 We have high-capacity fast charging Power Banks with digital displays & laptop power delivery:",
      suggestions: [
        { name: 'UGREEN 300W 48000mAh Smart Power Bank', price: 'Rs. 58,000', warranty: '1 Year', brand: 'UGREEN', link: '/products?q=power%20banks' },
        { name: 'Anker 737 Power Bank (140W 24K)', price: 'Rs. 39,500', warranty: '18 Months', brand: 'Anker', link: '/products?q=power%20banks' },
        { name: 'UGREEN 20000mAh 165W Fast Charge', price: 'Rs. 28,500', warranty: '1 Year', brand: 'UGREEN', link: '/products?q=power%20banks' },
        { name: 'UGREEN 20000mAh 30W Fast Charging', price: 'Rs. 12,800', warranty: '1 Year', brand: 'UGREEN', link: '/products?q=power%20banks' }
      ]
    },

    // 3. CHARGERS & ADAPTERS
    charger: {
      keywords: ['charger', 'chargers', 'adapter', 'wall charger', 'gan', 'ganprime', 'nexode', '100w', '65w', '20w', 'fast charger', 'fast charging', 'type c charger', 'apple charger'],
      response: "⚡ Explore our high-speed GaN (Gallium Nitride) multi-port fast chargers for laptops, iPhones & Android devices:",
      suggestions: [
        { name: 'UGREEN Nexode 100W 4-Port GaN Charger', price: 'Rs. 16,500', warranty: '1 Year', brand: 'UGREEN', link: '/products?q=chargers' },
        { name: 'Anker 735 GaNPrime 65W Charger', price: 'Rs. 15,500', warranty: '18 Months', brand: 'Anker', link: '/products?q=chargers' },
        { name: 'UGREEN Nexode 65W 3-Port GaN Charger', price: 'Rs. 12,500', warranty: '1 Year', brand: 'UGREEN', link: '/products?q=chargers' },
        { name: 'Apple Original 20W USB-C Adapter', price: 'Rs. 6,500', warranty: '1 Year', brand: 'Apple', link: '/products?q=apple' }
      ]
    },

    // 4. CABLES
    cable: {
      keywords: ['cable', 'cables', 'type-c cable', 'usbc cable', 'lightning cable', 'fast charging cable', 'braided cable', '100w cable', '140w cable'],
      response: "🔌 Genuine reinforced ultra-durable fast charging cables tested for 20,000+ bends:",
      suggestions: [
        { name: 'UGREEN 100W 5A USB-C Cable (2M)', price: 'Rs. 3,200', warranty: '1 Year', brand: 'UGREEN', link: '/products?q=chargers' },
        { name: 'Anker 543 USB-C Bio-Based 140W (1.8M)', price: 'Rs. 4,500', warranty: '18 Months', brand: 'Anker', link: '/products?q=chargers' }
      ]
    },

    // 5. EARPHONES, HEADSETS & AUDIO
    earphones: {
      keywords: ['earphone', 'earphones', 'earbuds', 'headphone', 'headphones', 'headset', 'soundcore', 'liberty 4', 'space q45', 'anc', 'wireless earbuds', 'bluetooth earphone', 'airpods', 'audio', 'ear pod'],
      response: "🎧 Experience studio-grade Hi-Res audio and active noise cancellation (ANC):",
      suggestions: [
        { name: 'Anker Soundcore Liberty 4 NC Earbuds', price: 'Rs. 28,500', warranty: '18 Months', brand: 'Soundcore', link: '/products?q=earphones' },
        { name: 'Anker Soundcore Space Q45 Over-Ear Headphones', price: 'Rs. 38,500', warranty: '18 Months', brand: 'Soundcore', link: '/products?q=earphones' },
        { name: 'Anker Soundcore Liberty 5 ANC Earbuds', price: 'Rs. 26,500', warranty: '18 Months', brand: 'Soundcore', link: '/products?q=earphones' },
        { name: 'UGREEN HiTune Max5 Hybrid ANC Headphones', price: 'Rs. 21,500', warranty: '1 Year', brand: 'UGREEN', link: '/products?q=earphones' }
      ]
    },

    // 6. SPEAKERS
    speakers: {
      keywords: ['speaker', 'speakers', 'jbl', 'bluetooth speaker', 'flip 6', 'charge 5', 'boombox', 'motion boom', 'sound bar', 'soundbox'],
      response: "🔊 Powerful portable wireless Bluetooth speakers with waterproof durability & heavy bass:",
      suggestions: [
        { name: 'JBL Flip 6 Waterproof Bluetooth Speaker', price: 'Rs. 36,500', warranty: '1 Year', brand: 'JBL', link: '/products?q=speakers' },
        { name: 'JBL Charge 5 Wi-Fi & Bluetooth Speaker', price: 'Rs. 52,000', warranty: '1 Year', brand: 'JBL', link: '/products?q=speakers' },
        { name: 'Anker Soundcore Motion Boom Plus 80W', price: 'Rs. 44,500', warranty: '18 Months', brand: 'Soundcore', link: '/products?q=speakers' }
      ]
    },

    // 7. APPLE & IPHONE
    apple: {
      keywords: ['iphone', 'apple', '17 pro max', '16 pro max', '15 pro', 'apple care', 'iphone price', 'apple sri lanka'],
      response: "🍎 100% Genuine Apple devices and authentic accessories with international & local Apple Care warranty:",
      suggestions: [
        { name: 'Apple iPhone 17 Pro Max 256GB (X/A)', price: 'Rs. 445,000', warranty: '1 Year Apple Care', brand: 'Apple', link: '/products?q=apple' },
        { name: 'Apple Original 20W USB-C Adapter', price: 'Rs. 6,500', warranty: '1 Year', brand: 'Apple', link: '/products?q=apple' }
      ]
    },

    // 8. CASES & SCREEN PROTECTORS
    cases: {
      keywords: ['case', 'cases', 'back cover', 'phone cover', 'screen protector', 'tempered glass', 'guard', 'spigen', 'ez fit', 'hybrid case'],
      response: "🛡️ Military-grade protection for your smartphone:",
      suggestions: [
        { name: 'Spigen Ultra Hybrid iPhone Case', price: 'Rs. 6,800', warranty: '12 Months', brand: 'Spigen', link: '/products?q=cases' },
        { name: 'Spigen EZ Fit Tempered Glass (2-Pack)', price: 'Rs. 4,500', warranty: '12 Months', brand: 'Spigen', link: '/products?q=screen%20protectors' }
      ]
    },

    // 9. MOUSE, KEYBOARDS & ACCESSORIES
    mouse_keyboard: {
      keywords: ['mouse', 'keyboard', 'logitech', 'mx master', 'stand', 'phone stand', 'desk holder', 'sd card', 'sandisk', 'memory card', 'pendrive'],
      response: "💻 High-performance workspace gear & ultra-fast storage devices:",
      suggestions: [
        { name: 'Logitech MX Master 3S Wireless Mouse', price: 'Rs. 34,500', warranty: '2 Years', brand: 'Logitech', link: '/products?q=mouse' },
        { name: 'SanDisk Extreme Pro 128GB MicroSDXC 200MB/s', price: 'Rs. 7,800', warranty: 'Lifetime', brand: 'SanDisk', link: '/products?q=pendrives' },
        { name: 'UGREEN Aluminum Foldable Desk Stand', price: 'Rs. 2,900', warranty: '12 Months', brand: 'UGREEN', link: '/products?q=others' }
      ]
    },

    // 10. DELIVERY & SHIPPING
    delivery: {
      keywords: ['delivery', 'shipping', 'courier', 'islandwide', 'how long', 'dawas keeyak', 'deliver', 'charge', 'post', 'domex', 'pronto', 'free delivery', 'ship'],
      response: "🚚 **Island-wide Fast Delivery in Sri Lanka:**\n\n• **Delivery Time:** 1 to 3 business days to your doorstep.\n• **Same-Day / Next-Day:** Available for Southern & Western provinces.\n• **Tracking:** Real-time live order tracking via your NVSHOP account.\n• **Delivery Partners:** Prompt Xpress, Domex & trusted courier networks.\n• **Cash on Delivery (COD):** Available island-wide! 📦"
    },

    // 11. PAYMENT METHODS & KOKO INSTALLMENTS
    payment: {
      keywords: ['payment', 'pay', 'cod', 'cash on delivery', 'installment', 'koko', 'card', 'visa', 'mastercard', 'bank transfer', 'geveem', 'gewanna'],
      response: "💳 **Flexible & 100% Secure Payment Options:**\n\n1. **Cash on Delivery (COD):** Pay cash when your parcel arrives at your doorstep.\n2. **Credit / Debit Cards:** Visa, MasterCard, UnionPay (3D Secure 256-bit SSL encrypted).\n3. **Koko 3-Month Installments:** Split your payment into 3 easy interest-free installments.\n4. **Direct Bank Transfer:** Instant receipt verification."
    },

    // 12. WARRANTY & RETURN POLICY
    warranty: {
      keywords: ['warranty', 'guarantee', 'guaranty', 'warranty claim', 'return', 'refund', 'replacement', 'warranty check', 'apple warranty', 'company warranty'],
      response: "🛡️ **NVSHOP.LK Official Warranty & Guarantee:**\n\n• **100% Genuine:** Every item is brand new, sealed, and authentic.\n• **Warranty Period:** 6 Months to 2 Years official manufacturer/company warranty depending on the product.\n• **7-Day Replacement:** If there is any manufacturer defect, get an instant replacement.\n• **Warranty Claim:** Visit our Ambalangoda showroom or send via courier with your invoice."
    },

    // 13. STORE LOCATION & SHOWROOM ADDRESS
    location: {
      keywords: ['location', 'address', 'shop', 'showroom', 'store', 'where', 'place', 'koheda', 'ambalangoda', 'branch', 'map', 'directions'],
      response: "📍 **NVSHOP.LK Official Showroom:**\n\n🏠 **Address:** 185/1/2B New Road, Ambalangoda 80300, Sri Lanka\n🚗 **Landmark:** Located on New Road with convenient customer parking.\n🗺️ **Google Maps:** Search 'NVSHOP Ambalangoda' on Google Maps for direct turn-by-turn navigation!"
    },

    // 14. CONTACT & HOTLINES
    contact: {
      keywords: ['contact', 'phone', 'telephone', 'hotline', 'mobile', 'call', 'whatsapp', 'email', 'number', 'kata karanna', 'katha karanna'],
      response: "📞 **Contact NVSHOP Customer Care:**\n\n• 📱 **Hotline 1:** +94 76 989 0079\n• 📱 **Hotline 2:** +94 77 747 0186\n• 💬 **WhatsApp:** +94 76 989 0079\n• 📧 **Email:** nvshopamba@gmail.com\n\nOur team is available 7 days a week to help you!"
    },

    // 15. OPERATING HOURS
    hours: {
      keywords: ['hours', 'time', 'opening hours', 'open', 'closed', 'velewa', 'aralada', 'keeyatada'],
      response: "⏰ **Showroom & Hotline Operating Hours:**\n\n• **Monday – Sunday:** 10:00 AM – 8:00 PM\n• **Open 7 Days a Week** (Including weekends & most public holidays).\n• **Online Web Store (nvshop.lk):** Open 24/7 for instant online orders!"
    },

    // 16. ORDER TRACKING & ACCOUNT
    order_tracking: {
      keywords: ['order', 'track', 'tracking', 'order status', 'my order', 'order history', 'receipt', 'invoice', 'mage order'],
      response: "📦 **Order Tracking & Management:**\n\nYou can track your live order progression (Confirmed ➔ Packed ➔ In Transit ➔ Delivered) and download electronic invoices directly from your **[Profile ➔ Order History](/profile)** page!"
    },

    // 17. DISCOUNTS & SPECIAL OFFERS
    offers: {
      keywords: ['offer', 'offers', 'discount', 'discounts', 'deal', 'deals', 'sale', 'promo', 'coupon', 'aduma', 'labama', 'vasi'],
      response: "🔥 **Current Exclusive Offers & Deals at NVSHOP.LK:**\n\n• Up to **25% OFF** on selected Fast Chargers and Power Banks!\n• Special combo discounts on iPhone Protection Packs (Case + EZ Fit Tempered Glass).\n• Member rewards on all orders when logged in!\n\nVisit our **[Home Page](/)** or **[Products](/products)** page to see all active discounts!"
    },

    // 18. GREETINGS & INTRO
    greeting: {
      keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'ayubowan', 'kohomada', 'sup', 'vanakkam', 'halo', 'help'],
      response: "👋 Ayubowan! Welcome to NVSHOP.LK — Sri Lanka's trusted tech accessories store.\n\nI can help you with:\n• ⌚ Smart Watches & Wearables\n• 🔋 High-Capacity Power Banks\n• ⚡ GaN Multi-Port Fast Chargers & Cables\n• 🎧 Soundcore Earbuds & Audio\n• 🚚 Delivery, Warranty & Showroom info\n\nWhat are you looking for today? 😊"
    },

    // 19. APPRECIATION / THANKS
    thanks: {
      keywords: ['thank you', 'thanks', 'thx', 'sthuthi', 'bohoma sthuthi', 'great', 'awesome', 'good', 'super', 'bye', 'goodbye'],
      response: "You're most welcome! 😊 If you need anything else, feel free to ask anytime. Have a wonderful tech shopping experience at NVSHOP.LK! 💙"
    }
  };

  // --- NLP Intent Classifier & Keyword Matcher ---
  const findBestResponse = (text) => {
    const cleanText = text.toLowerCase().trim();
    if (!cleanText) return null;

    let bestCategory = null;
    let highestScore = 0;

    Object.entries(KNOWLEDGE_BASE).forEach(([categoryKey, data]) => {
      let score = 0;
      data.keywords.forEach((kw) => {
        if (cleanText === kw) {
          score += 15; // Exact match
        } else if (cleanText.includes(kw)) {
          score += kw.length >= 6 ? 8 : 4; // Substring match
        }
      });

      if (score > highestScore) {
        highestScore = score;
        bestCategory = categoryKey;
      }
    });

    if (highestScore > 0 && bestCategory) {
      return KNOWLEDGE_BASE[bestCategory];
    }

    return null;
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const query = inputValue.trim();
    if (!query) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const match = findBestResponse(query);

      let botResponseText = '';
      let suggestions = [];

      if (match) {
        botResponseText = match.response;
        suggestions = match.suggestions || [];
      } else {
        botResponseText = "I'd love to help you with that! 😊 You can ask me about:\n\n• ⌚ **Smart Watches** (Green Lion, Black Shark, Haylou)\n• 🔋 **Power Banks** (UGREEN, Anker 140W/300W)\n• ⚡ **GaN Fast Chargers & Cables** (100W, 65W, 20W)\n• 🎧 **Soundcore Earbuds & Audio** (Liberty 4 NC, Space Q45)\n• 🚚 **Islandwide Delivery & COD**\n• 📍 **Ambalangoda Showroom Location**\n• 🛡️ **Warranty & Guarantee**\n\nOr contact our hotline directly at **+94 76 989 0079**! 📞";
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: botResponseText,
        suggestions: suggestions,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 600);
  };

  const handleQuickChipClick = (chipText) => {
    setInputValue(chipText);
    setTimeout(() => {
      const form = document.getElementById('support-bot-form');
      if (form) form.requestSubmit();
    }, 50);
  };

  const handleSuggestionClick = (link) => {
    setIsOpen(false);
    navigate(link);
  };

  const QUICK_CHIPS = [
    { label: '⌚ Smart Watches', query: 'smart watch' },
    { label: '🔋 Power Banks', query: 'power bank' },
    { label: '⚡ Fast Chargers', query: 'fast charger' },
    { label: '🎧 Audio & Earbuds', query: 'earphones' },
    { label: '🚚 Delivery & COD', query: 'delivery info' },
    { label: '📍 Store Location', query: 'where is your shop' },
    { label: '🛡️ Warranty Policy', query: 'warranty' },
    { label: '📞 Contact Care', query: 'contact number' },
  ];

  return (
    <>
      {/* Floating Chat Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center z-50 group border-2 border-white/20"
          aria-label="Open Support Assistant"
        >
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-25 group-hover:opacity-0" />
          <MessageCircle className="w-7 h-7 relative z-10 transition-transform group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
          </span>
        </button>
      )}

      {/* Modern Chatbot Window */}
      {isOpen && (
        <div 
          className={`fixed bottom-6 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[410px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-slate-200/80 transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-4 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base leading-tight">NVSHOP AI Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-blue-100 font-medium">Authentic Tech Accessories • 24/7 Live</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/10 rounded-xl transition-colors text-white/90 hover:text-white"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-xl transition-colors text-white/90 hover:text-white"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Prompt Topic Chips */}
              <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
                {QUICK_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickChipClick(chip.query)}
                    className="shrink-0 px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-full text-xs font-semibold transition-all shadow-2xs whitespace-nowrap active:scale-95"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 text-slate-800">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                      msg.type === 'user' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs'
                    }`}>
                      {msg.type === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                    </div>

                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                          : 'bg-white text-slate-900 rounded-tl-none border border-slate-200/80 shadow-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Interactive Product Suggestion Cards */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recommended Genuine Models:</p>
                          {msg.suggestions.map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleSuggestionClick(item.link)}
                              className="group/item bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-xl p-2.5 cursor-pointer transition-all flex items-center justify-between gap-2 shadow-2xs"
                            >
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 group-hover/item:text-blue-600 transition-colors text-xs truncate">
                                  {item.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-blue-600 font-extrabold text-xs">{item.price}</span>
                                  <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                    🛡️ {item.warranty}
                                  </span>
                                </div>
                              </div>
                              <div className="w-7 h-7 rounded-lg bg-white group-hover/item:bg-blue-600 group-hover/item:text-white text-slate-400 flex items-center justify-center shrink-0 border border-slate-200 group-hover/item:border-blue-600 transition-all">
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <span className={`block text-[10px] mt-1.5 ${msg.type === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-none border border-slate-200 px-4 py-3 shadow-xs">
                      <div className="flex gap-1.5 items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Quick Contact Bar */}
              <div className="px-4 py-1.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <span className="font-semibold truncate">Ambalangoda Showroom</span>
                </div>
                <a href="tel:+94769890079" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" /> +94 76 989 0079
                </a>
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                <form id="support-bot-form" onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about smart watches, chargers, delivery..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white text-xs sm:text-sm text-slate-900 transition-all placeholder:text-slate-400 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-blue-500/20 active:scale-95 shrink-0"
                    title="Send Message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
