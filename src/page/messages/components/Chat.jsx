import React, { useContext } from "react";
import jwtDecode from "jwt-decode";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { useUserContext } from "../context/UserContext";
import '../style.css'

const Chat = (props) => {
  const { selectedUser } = useUserContext();

  if (!selectedUser) {
    return (
      <div className="position-relative d-flex align-items-center justify-content-center" style={{ height: "500px" }}>
        <div className="text-center">
          <h5 className="text-muted">Chọn một cuộc trò chuyện để bắt đầu nhắn tin</h5>
          <p className="text-muted">Hãy chọn người dùng từ danh sách bên trái hoặc tìm kiếm người mới</p>
        </div>
      </div>
    );
  }

  // Xác định người đang chat (sender hoặc receiver)
  const accessToken = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(accessToken);
  const currentUserId = parseInt(decodedToken.sub);

  // Lấy thông tin người chat (không phải mình)
  const chatPartner = currentUserId === selectedUser.sender?.id 
    ? selectedUser.receiver 
    : selectedUser.sender;

  return (
    <div className="position-relative" style={{ height: "100%" }}>
      {/* Header hiển thị thông tin người đang chat */}
      <div className="py-2 px-4 border-bottom d-none d-lg-block" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="d-flex align-items-center">
          <img 
            src={chatPartner?.imageUrl || "https://via.placeholder.com/40"} 
            alt={chatPartner?.name}
            className="rounded-circle me-3"
            style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
          />
          <div className="flex-grow-1">
            <strong>{chatPartner?.name || "Unknown User"}</strong>
            <div className="text-muted small">{chatPartner?.email || ""}</div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="chat-messages p-4" style={{ height: "calc(100% - 140px)", overflowY: "auto" }}>
        <Messages selectedUser={selectedUser} />
      </div>

      {/* Input area */}
      <Input selectedUser={selectedUser} />
    </div>
  );
};

export default Chat;
