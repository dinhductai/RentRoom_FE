import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { useUserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import '../style.css'

const Input = () => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const accessToken = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(accessToken);
  const userId = decodedToken.sub;
  const { selectedUser, setSelectedUser } = useUserContext();

  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    if (selectedUser && selectedUser.sender && selectedUser.receiver) {
      console.log("📌 Selected conversation:", selectedUser);
      if (userId == selectedUser.sender.id) {
        setCurrentId(selectedUser.receiver.id);
        console.log("💬 Chat with receiver ID:", selectedUser.receiver.id);
      } else {
        setCurrentId(selectedUser.sender.id);
        console.log("💬 Chat with sender ID:", selectedUser.sender.id);
      }
    }
  }, [selectedUser, userId]);


  const handleSend = async () => {
    if (!currentId || !text.trim()) {
      console.log("⚠️ Cannot send: No recipient selected or empty message");
      toast.warning("Vui lòng nhập tin nhắn");
      return;
    }

    if (sending) {
      console.log("⏳ Already sending...");
      return;
    }

    setSending(true);
    console.log("📤 Sending message to user ID:", currentId);
    console.log("💬 Message content:", text);

    try {
      // Gọi API POST /user/message-chat/{userId}
      const response = await fetch(`http://localhost:8080/user/message-chat/${currentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          content: text.trim()
        }),
      });

      console.log("📡 Send response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Message sent successfully:", data);
        toast.success(data.message || "Gửi tin nhắn thành công!");
        
        // Clear input
        setText("");

        // Refresh chat history
        await fetchMessageData(currentId);
      } else {
        const errorText = await response.text();
        console.error("❌ Send failed:", response.status, errorText);
        toast.error("Không thể gửi tin nhắn. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("💥 Error sending message:", error);
      toast.error("Lỗi kết nối. Vui lòng kiểm tra mạng!");
    } finally {
      setSending(false);
    }
  };

  const fetchMessageData = async (userId) => {
    try {
      console.log("🔄 Refreshing chat history with user ID:", userId);
      const response = await fetch(`http://localhost:8080/user/message-chat/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data);
        console.log("✅ Chat history refreshed");
      } else {
        console.error("❌ Error fetching message data:", response.status);
      }
    } catch (error) {
      console.error("💥 Error fetching message data:", error);
    }
  };


  return (
    <>
        <div className="flex-grow-0 py-3 px-4 border-top">
          <div className="input-group">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Nhập tin nhắn của bạn"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              value={text}
              disabled={!currentId || sending}
              style={{width : "300px"}}
            />
            <button 
              className="btn btn-primary" 
              onClick={handleSend}
              disabled={!currentId || sending || !text.trim()}
            >
              {sending ? "Đang gửi..." : "Send"}
            </button>
          </div>
        </div>
    </>
  );
}

export default Input;
