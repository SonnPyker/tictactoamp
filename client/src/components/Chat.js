import React from "react";

function Chat({
  messages,
  nickname,
  onSendMessage,
  messageInput,
  setMessageInput,
  messagesEndRef,
}) {
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
    <div className="chat-section">
      <div className="chat-title">Chat</div>
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#999", padding: "20px 0" }}>
            No messages yet
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="chat-message">
              <div className="chat-message-sender">{msg.nickname}</div>
              <div className="chat-message-text">{msg.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-group">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          maxLength="100"
        />
        <button className="chat-send-btn" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
