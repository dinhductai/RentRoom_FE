import React, { useContext, useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import '../style.css'

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { setSelectedUser } = useUserContext();


  useEffect(() => {
    const fetchChats = async () => {
      try {
        // Lấy access token từ local storage
        const accessToken = localStorage.getItem("accessToken");
        
        if (!accessToken) {
          console.log("Access token not found.");
          return;
        }

        const response = await fetch("http://localhost:8080/user/message", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();        
          console.log("💬 Danh sách conversations:", data);
          setChats(data);
          
          if (!data || data.length === 0) {
            console.log("ℹ️ Chưa có cuộc trò chuyện nào. Hãy tìm kiếm người dùng để bắt đầu chat!");
          }
        } else {
          console.log("❌ Error fetching chats:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []);


  const handleSelect = async (user) => {
    try {
      const token = localStorage.getItem("accessToken");
      const userId = user.id; // Lấy userId từ thông tin user
  
      // Gọi API để lấy thông tin tin nhắn với userId
      const response = await fetch(`http://localhost:8080/user/message-chat/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
  
        setSelectedUser(data);  
        // Hiển thị thông tin tin nhắn trên giao diện
        console.log("Message data:", data);
        // Đoạn code hiển thị thông tin data lên giao diện (thay console.log bằng phần hiển thị thực tế)
      } else {
        console.error("Error fetching message data");
        // Xử lý lỗi khi gọi API không thành công
      }
    } catch (error) {
      console.error("Error:", error);
      // Xử lý lỗi nếu có lỗi xảy ra trong quá trình gọi API
    }
  }

  return (
    <>
    {chats && chats.length > 0 ? (
      chats.map((chat) => (
        <a href="#" key={chat.id} onClick={() => handleSelect(chat)} className="list-group-item list-group-item-action border-0" style={{ margin: "10px 10px 10px 15.2px", paddingLeft: "10px" }}>
          <div className="d-flex align-items-start">
            <img src={chat.imageUrl} className="rounded-circle me-1" alt={chat.userName} width="40" height="40" />
            <div className="flex-grow-1 ms-3">
              {chat.userName}
              <div className="small"><span className="fas fa-circle chat-online">{chat.message}</span></div>
            </div>
          </div>
        </a>
      ))
    ) : (
      <div className="text-center text-muted p-4">
        <p>Chưa có cuộc trò chuyện nào</p>
        <small>Sử dụng ô tìm kiếm phía trên để tìm người dùng</small>
      </div>
    )}
    </>
  );
};

export default Chats;
