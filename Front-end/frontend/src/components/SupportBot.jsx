import { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Maximize2, MessageCircle } from 'lucide-react';

export default function SupportBot({ isProducts = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: isProducts 
        ? "👋 Hi! I'm your Product Assistant. I'd love to help you find the perfect accessory for your needs. What are you looking for today?" 
        : "👋 Hello! I'm NV-SHOP Support Bot. How can I assist you today?",
      timestamp: new Date(),
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
  }, [messages]);

  const productResponses = {
    charger: {
      suggestions: [
        { name: 'Anker 100W Super Fast Charger', price: '$34.99', warranty: '2 Years' },
        { name: 'UGREEN 65W USB-C Charger', price: '$45.99', warranty: '2 Years' },
        { name: 'Baseus 65W GaN Charger', price: '$39.99', warranty: '1.5 Years' }
      ],
      response: "Great choice! Here are our top recommended chargers based on quality and warranty:"
    },
    cable: {
      suggestions: [
        { name: 'Anker 511 USB-C Cable 2m', price: '$12.99', warranty: '1 Year' },
        { name: 'UGREEN Braided USB-C Cable', price: '$16.99', warranty: '2 Years' },
        { name: 'Baseus Nylon USB-C Cable 3m', price: '$14.99', warranty: '1.5 Years' }
      ],
      response: "Perfect! Here are our best-selling cables with excellent durability:"
    },
    powerbank: {
      suggestions: [
        { name: 'Anker PowerCore 30000mAh', price: '$45.99', warranty: '2 Years' },
        { name: 'UGREEN 25000mAh Power Bank', price: '$38.99', warranty: '2 Years' },
        { name: 'Baseus 20000mAh Fast Charge', price: '$32.99', warranty: '1.5 Years' }
      ],
      response: "Excellent! Here are our most popular power banks:"
    },
    screen_protector: {
      suggestions: [
        { name: 'UGREEN Tempered Glass 3-Pack', price: '$19.99', warranty: '1 Year' },
        { name: 'Baseus Full Coverage Screen Film', price: '$24.99', warranty: '1 Year' },
        { name: 'Anker Premium Glass Protector', price: '$22.99', warranty: '2 Years' }
      ],
      response: "Here are our top screen protectors with best protection:"
    }
  };

  const supportResponses = {
    order: "You can track your order in the 'My Orders' section of your account. It updates in real-time! 📦",
    warranty: "All our products come with original manufacturer warranties. You can check warranty details in 'My Orders' section. 🛡️",
    return: "We offer hassle-free returns within 30 days of purchase. Items must be unused and in original packaging. We'll cover return shipping! 🔄",
    payment: "We accept: Bank Transfer, Credit/Debit Cards, and Koko installments. All payments are secure and encrypted. 💳",
    delivery: "We offer island-wide delivery within 2-3 business days. Free shipping on orders over $50! 🚚",
    contact: "You can reach our support team:\n📧 Email: support@nvshop.com\n📱 WhatsApp: +94 71 123 4567\n🕐 Available 24/7",
  };

  const getProductSuggestions = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('charger')) return 'charger';
    if (lower.includes('cable')) return 'cable';
    if (lower.includes('powerbank') || lower.includes('power bank')) return 'powerbank';
    if (lower.includes('screen') || lower.includes('protector')) return 'screen_protector';
    return null;
  };

  const getSupportResponse = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('order') || lower.includes('track')) return 'order';
    if (lower.includes('warranty') || lower.includes('protection')) return 'warranty';
    if (lower.includes('return') || lower.includes('refund')) return 'return';
    if (lower.includes('payment') || lower.includes('pay')) return 'payment';
    if (lower.includes('deliver') || lower.includes('shipping')) return 'delivery';
    if (lower.includes('contact') || lower.includes('phone') || lower.includes('email')) return 'contact';
    return null;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      let botResponseText = '';
      let suggestions = [];

      if (isProducts) {
        const productType = getProductSuggestions(inputValue);
        if (productType && productResponses[productType]) {
          botResponseText = productResponses[productType].response;
          suggestions = productResponses[productType].suggestions;
        } else if (getSupportResponse(inputValue)) {
          botResponseText = supportResponses[getSupportResponse(inputValue)];
        } else {
          botResponseText = "I can help you find the best products! Try asking about chargers, cables, power banks, or screen protectors. Or I can answer general questions! 😊";
        }
      } else {
        const supportType = getSupportResponse(inputValue);
        if (supportType) {
          botResponseText = supportResponses[supportType];
        } else if (getProductSuggestions(inputValue)) {
          botResponseText = "That sounds great! Visit our Products section to check out our amazing selection. Would you like recommendations? 🛍️";
        } else {
          botResponseText = "I'm here to help! You can ask me about:\n• Order tracking\n• Warranty information\n• Returns & refunds\n• Payment options\n• Delivery info\n\nOr feel free to ask anything else! 😊";
        }
      }

      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: botResponseText,
        suggestions: suggestions,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-primary to-primary/80 text-white rounded-full shadow-2xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 group"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse group-hover:animate-none" />
          <MessageCircle className="w-7 h-7 relative z-10" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 w-96 max-h-[32rem] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">
                {isProducts ? '🤖 Product Assistant' : '💬 Support Bot'}
              </h3>
              <p className="text-xs text-primary-light/80">Always here to help</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-primary/80 rounded transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-primary/80 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                        msg.type === 'user'
                          ? 'bg-primary text-white rounded-br-none'
                          : 'bg-white text-slate-900 rounded-bl-none border border-slate-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      
                      {/* Product Suggestions */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.suggestions.map((product, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-100 rounded-lg p-2 cursor-pointer hover:bg-primary hover:text-white transition-colors text-xs"
                            >
                              <p className="font-semibold">{product.name}</p>
                              <div className="flex justify-between text-[10px] mt-1 gap-2">
                                <span>{product.price}</span>
                                <span>⭐ Warranty: {product.warranty}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-xs opacity-70 mt-2">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white text-slate-900 rounded-2xl rounded-bl-none border border-slate-200 px-4 py-2.5">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-slate-100 p-4 bg-white">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isProducts ? "Ask about products..." : "Type your message..."}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="bg-primary hover:bg-primary/90 disabled:bg-slate-300 text-white rounded-lg p-2 transition-colors"
                  >
                    <Send className="w-5 h-5" />
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
