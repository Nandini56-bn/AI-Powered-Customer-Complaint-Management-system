import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, User, RefreshCw, MessageSquare } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleChat, sendChatMessage, addMessage, clearChat } from '../store/chatSlice';

export default function AIChatWidget() {
  const dispatch = useDispatch();
  const { messages, isOpen, loading } = useSelector((state) => state.chat);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userText = inputText;
    setInputText('');

    // Add user message to state
    dispatch(addMessage({ sender: 'user', text: userText }));
    // Send to backend LangGraph chat engine
    dispatch(sendChatMessage({ message: userText }));
  };

  const handleQuickAction = (text) => {
    dispatch(addMessage({ sender: 'user', text }));
    dispatch(sendChatMessage({ message: text }));
  };

  return (
    <div style={styles.overlay}>
      <div className="glass-panel animate-fade-in" style={styles.drawer}>
        {/* Drawer Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={styles.aiIcon}>
              <Bot size={22} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>AIVOA Copilot Assistant</h3>
              <p style={{ fontSize: '0.75rem', color: '#34d399' }}>Powered by LangGraph & Groq API</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button 
              onClick={() => dispatch(clearChat())} 
              style={styles.headerBtn}
              title="Clear Chat"
            >
              <RefreshCw size={16} />
            </button>
            <button 
              onClick={() => dispatch(toggleChat(false))} 
              style={styles.headerBtn}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Quick Prompts */}
        <div style={styles.quickPrompts}>
          <button onClick={() => handleQuickAction("Summarize the latest complaint")} style={styles.promptChip}>
            Summarize latest complaint
          </button>
          <button onClick={() => handleQuickAction("What is the priority of the latest complaint?")} style={styles.promptChip}>
            What is the priority?
          </button>
          <button onClick={() => handleQuickAction("Suggest a resolution")} style={styles.promptChip}>
            Suggest a resolution
          </button>
        </div>

        {/* Messages List */}
        <div style={styles.messageList}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...styles.messageItem,
                ...(msg.sender === 'user' ? styles.userMessage : styles.assistantMessage),
              }}
            >
              <div style={styles.msgAvatar}>
                {msg.sender === 'user' ? (
                  <User size={14} color="#ffffff" />
                ) : (
                  <Bot size={14} color="#ffffff" />
                )}
              </div>
              <div style={styles.msgBubble}>
                <div style={styles.msgText}>{msg.text}</div>
                <span style={styles.msgTime}>{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ ...styles.messageItem, ...styles.assistantMessage }}>
              <div style={styles.msgAvatar}>
                <Bot size={14} color="#ffffff" />
              </div>
              <div style={{ ...styles.msgBubble, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                <span style={{ fontSize: '0.82rem', color: '#a5b4fc' }}>LangGraph AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} style={styles.inputForm}>
          <input
            type="text"
            placeholder="Ask AI anything about complaints, policies, drafting emails..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={styles.chatInput}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem' }} disabled={loading}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: 90,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  drawer: {
    width: '100%',
    maxWidth: '440px',
    height: '100%',
    borderRadius: '0',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
  },
  header: {
    padding: '1.25rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  aiIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 12px rgba(139, 92, 246, 0.4)',
  },
  headerBtn: {
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '0.35rem',
    borderRadius: '6px',
  },
  quickPrompts: {
    display: 'flex',
    gap: '0.4rem',
    padding: '0.75rem 1.25rem',
    overflowX: 'auto',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  },
  promptChip: {
    whiteSpace: 'nowrap',
    fontSize: '0.72rem',
    color: '#c084fc',
    background: 'rgba(192, 132, 252, 0.1)',
    border: '1px solid rgba(192, 132, 252, 0.25)',
    padding: '0.3rem 0.6rem',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  messageList: {
    flex: 1,
    padding: '1.25rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  messageItem: {
    display: 'flex',
    gap: '0.65rem',
    maxWidth: '90%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
  },
  msgAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'rgba(99, 102, 241, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '0.2rem',
  },
  msgBubble: {
    padding: '0.75rem 1rem',
    borderRadius: '14px',
    fontSize: '0.85rem',
    lineHeight: 1.45,
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  msgText: {
    whiteSpace: 'pre-wrap',
  },
  msgTime: {
    fontSize: '0.65rem',
    color: '#64748b',
    marginTop: '0.35rem',
    display: 'block',
  },
  inputForm: {
    padding: '1.25rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    gap: '0.5rem',
  },
  chatInput: {
    flex: 1,
    padding: '0.65rem 0.85rem',
    borderRadius: '10px',
    background: 'rgba(15, 23, 42, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontSize: '0.85rem',
    outline: 'none',
  },
};
