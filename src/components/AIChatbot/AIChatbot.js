import React, { useState, useEffect, useRef } from 'react';
import './AIChatbot.css';
import { API_BASE_URL, ACCESS_TOKEN } from '../../constants/Connect';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Xin chào! Tôi là trợ lý AI của The Rental Zone. Tôi có thể giúp gì cho bạn?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        // Thêm tin nhắn của user
        const userMessage = {
            id: messages.length + 1,
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const headers = {
                'Content-Type': 'application/json'
            };

            // Thêm token nếu user đã đăng nhập
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ message: inputMessage })
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();

            // Thêm phản hồi từ AI
            const botMessage = {
                id: messages.length + 2,
                text: data.message || data.response || 'Xin lỗi, tôi không thể trả lời câu hỏi này.',
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error calling AI API:', error);
            const errorMessage = {
                id: messages.length + 2,
                text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            {/* Chat Button */}
            <div className={`ai-chatbot-button ${isOpen ? 'hidden' : ''}`} onClick={toggleChat}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="ai-chatbot-window">
                    {/* Header */}
                    <div className="ai-chatbot-header">
                        <div className="ai-chatbot-header-content">
                            <div className="ai-chatbot-avatar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </div>
                            <div className="ai-chatbot-title">
                                <h4>AI Assistant</h4>
                                <span className="ai-chatbot-status">Online</span>
                            </div>
                        </div>
                        <button className="ai-chatbot-close" onClick={toggleChat}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="ai-chatbot-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`ai-chatbot-message ${msg.sender}`}>
                                <div className="ai-chatbot-message-content">
                                    <div className="ai-chatbot-message-text">{msg.text}</div>
                                    <div className="ai-chatbot-message-time">{formatTime(msg.timestamp)}</div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="ai-chatbot-message bot">
                                <div className="ai-chatbot-message-content">
                                    <div className="ai-chatbot-typing">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="ai-chatbot-input">
                        <textarea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập câu hỏi của bạn..."
                            rows="1"
                            disabled={isLoading}
                        />
                        <button 
                            onClick={handleSendMessage} 
                            disabled={isLoading || !inputMessage.trim()}
                            className="ai-chatbot-send"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatbot;
