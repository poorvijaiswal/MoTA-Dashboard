import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "../components/Navigation";
import { FiMessageCircle, FiSend, FiPhone } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

interface Message {
  id: number;
  sender: 'bot' | 'user';
  message: string;
  timestamp: string;
  options?: string[];
}

const Bot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load conversation data
    fetch('/dataTribal/bot.json')
      .then(res => res.json())
      .then(data => {
        setMessages(data.conversation);
      });
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateBotResponse = (userMessage: string) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('शिकायत') || msg.includes('complaint')) {
      return {
        message: 'शिकायत दर्ज करने के लिए:\n\n1. शिकायत का प्रकार चुनें\n2. विस्तार से समस्या बताएं\n3. जरूरी दस्तावेज अपलोड करें\n\nक्या आप अभी शिकायत दर्ज करना चाहते हैं?',
        options: ['शिकायत दर्ज करें', 'शिकायत की जांच करें', 'मुख्य मेन्यू']
      };
    } else if (msg.includes('योजना') || msg.includes('scheme')) {
      return {
        message: 'उपलब्ध योजनाएं:\n\n• PM-KISAN योजना\n• वन भूमि पट्टा\n• आदिवासी कल्याण योजना\n\nकिस योजना के बारे में जानना चाहते हैं?',
        options: ['PM-KISAN', 'वन भूमि पट्टा', 'सभी योजनाएं देखें']
      };
    } else if (msg.includes('दावा') || msg.includes('claim') || msg.includes('भूमि') || msg.includes('land')) {
      return {
        message: 'भूमि दावे की जानकारी:\n\n• IFR - व्यक्तिगत वन अधिकार\n• CFR - सामुदायिक वन संसाधन\n• CR - सामुदायिक अधिकार\n\nआपका दावा कौन सा है?',
        options: ['दावे की स्थिति जांचें', 'नया दावा करें', 'दस्तावेज अपलोड करें']
      };
    } else if (msg.includes('मदद') || msg.includes('help')) {
      return {
        message: 'मैं आपकी निम्न चीजों में मदद कर सकता हूं:\n\n• शिकायत दर्ज करना\n• योजनाओं की जानकारी\n• दावों की स्थिति\n• अधिकारियों से संपर्क',
        options: ['शिकायत', 'योजनाएं', 'दावे', 'संपर्क']
      };
    } else {
      return {
        message: 'धन्यवाद! आपका संदेश प्राप्त हो गया है।\n\nमैं निम्नलिखित विषयों में आपकी सहायता कर सकता हूं:',
        options: ['शिकायत दर्ज करें', 'योजना जानकारी', 'दावे की स्थिति', 'मदद']
      };
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    const userMsg = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Generate contextual bot response
    setTimeout(() => {
      const response = generateBotResponse(userMsg);
      const botResponse: Message = {
        id: messages.length + 2,
        sender: 'bot',
        message: response.message,
        timestamp: new Date().toISOString(),
        options: response.options
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleOptionClick = (option: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      message: option,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    
    setIsTyping(true);
    setTimeout(() => {
      let botResponse: Message;
      
      if (option === 'मुख्य मेन्यू') {
        botResponse = {
          id: messages.length + 2,
          sender: 'bot',
          message: 'मुख्य मेन्यू:\n\n1️⃣ शिकायत दर्ज करें\n2️⃣ योजना के लिए आवेदन\n3️⃣ दावे की स्थिति जांचें\n4️⃣ अधिकारी से संपर्क',
          timestamp: new Date().toISOString(),
          options: ['1', '2', '3', '4']
        };
      } else {
        botResponse = {
          id: messages.length + 2,
          sender: 'bot',
          message: 'धन्यवाद! आपकी सहायता के लिए हमेशा उपलब्ध हैं। 🙏',
          timestamp: new Date().toISOString()
        };
      }
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-success/10 p-2 rounded-full">
              <FiMessageCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">WhatsApp Bot</h1>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-success border-success">
                  <RiRobot2Line className="w-3 h-3 mr-1" />
                  Demo Mode
                </Badge>
                <Badge variant="secondary">
                  <FiPhone className="w-3 h-3 mr-1" />
                  +91 98765-43210
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">
            Experience our AI-powered WhatsApp assistant for FRA services
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="bg-success/5 border-b">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-success rounded-full flex items-center justify-center">
                <RiRobot2Line className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm">FRA सहायक</span>
                <p className="text-xs text-muted-foreground font-normal">
                  Always available • Powered by AI
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Messages Area */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-foreground'
                  } rounded-lg p-3`}>
                    <div className="text-sm">
                      {formatMessage(msg.message)}
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    
                    {/* Options */}
                    {msg.options && (
                      <div className="mt-3 space-y-1">
                        {msg.options.map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-xs h-8"
                            onClick={() => handleOptionClick(option)}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground rounded-lg p-3">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">typing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message in Hindi or English..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-success hover:bg-success/90 text-white"
                >
                  <FiSend className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleOptionClick('शिकायत दर्ज करें')}
                >
                  शिकायत दर्ज करें
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleOptionClick('योजना के लिए आवेदन')}
                >
                  योजना आवेदन
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleOptionClick('दावे की स्थिति जांचें')}
                >
                  दावा स्थिति
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="max-w-2xl mx-auto mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            This is a demo of WhatsApp Bot functionality. In production, this would integrate with 
            actual WhatsApp Business API for real-time messaging.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Bot;