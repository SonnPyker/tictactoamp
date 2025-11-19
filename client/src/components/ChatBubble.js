import React, { useState } from "react";

function ChatBubble({
  messages,
  nickname,
  onSendMessage,
  messageInput,
  setMessageInput,
  messagesEndRef,
}) {
  const [isOpen, setIsOpen] = useState(true);

  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`chat-bubble ${isOpen ? "open" : "closed"}`}>
      <button
        className="chat-bubble-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6l-12 12M6 6l12 12" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="chat-bubble-header">
          <span className="chat-bubble-title">Chat</span>
        </div>
      )}

      {isOpen && (
        <>
          <div className="chat-bubble-messages">
            {messages.length === 0 ? (
              <div className="chat-bubble-empty">No messages yet</div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="chat-bubble-message">
                  <div className="chat-bubble-sender">{msg.nickname}</div>
                  <div className="chat-bubble-text">{msg.text}</div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-bubble-input-group">
            <input
              type="text"
              className="chat-bubble-input"
              placeholder="Type..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength="100"
            />
            <button className="chat-bubble-send-btn" onClick={handleSend}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatBubble;
