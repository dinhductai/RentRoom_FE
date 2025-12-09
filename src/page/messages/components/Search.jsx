import React, { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";
import '../style.css'
import Chats from "./Chats";

const Search = () => {
  const [username, setUsername] = useState("");
  const [userList, setUserList] = useState([]);
  const [rentalersList, setRentalersList] = useState([]);
  const [err, setErr] = useState(false);
  const [showRentalers, setShowRentalers] = useState(false);
  const { setSelectedUser } = useUserContext();

  // Load danh sách rentalers khi component mount
  useEffect(() => {
    fetchRentalers();
  }, []);

  const fetchRentalers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("👥 Fetching rentalers list...");
      
      // Dùng API mới: GET /user/rentalers?pageNo=0&pageSize=20
      const response = await fetch("http://localhost:8080/user/rentalers?pageNo=0&pageSize=20", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Rentalers loaded:", data);
        setRentalersList(data.content || data); // Handle paginated or direct array response
      } else {
        console.error("❌ Error loading rentalers:", response.status);
      }
    } catch (error) {
      console.error("💥 Error fetching rentalers:", error);
    }
  };

  const handleSearch = async () => {
    if (!username.trim()) {
      console.log("Tên người dùng trống, bỏ qua tìm kiếm");
      return;
    }

    console.log("🔍 Tìm kiếm user:", username);
    const token = localStorage.getItem("accessToken");
    
    try {
      // Dùng API mới: GET /user/search?userName=...
      const response = await fetch(`http://localhost:8080/user/search?userName=${encodeURIComponent(username)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("📦 Dữ liệu nhận được:", data);
        
        if (data != null && data.length > 0) {
          setUserList(data);
          setErr(false);
          console.log("✅ Tìm thấy", data.length, "user(s)");
        } else {
          setUserList([]);
          setErr(true);
          console.log("❌ Không tìm thấy user nào");
        }
      } else {
        const errorText = await response.text();
        console.error("❌ API error:", response.status, errorText);
        setUserList([]);
        setErr(true);
      }
    } catch (error) {
      console.error("💥 Lỗi khi tìm kiếm:", error);
      setUserList([]);
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async (user) => {
    try {
      const token = localStorage.getItem("accessToken");
      const userId = user.id;
      
      console.log("💬 Opening chat with user:", user.name, "ID:", userId);

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
        console.log("✅ Chat opened:", data);
      } else {
        console.error("❌ Error fetching message data:", response.status);
      }
    } catch (error) {
      console.error("💥 Error:", error);
    }

    // Clear search results (nhưng giữ danh sách rentalers nếu đang mở)
    setUserList([]);
    setUsername("");
  };


  return (
    <>
        <div className="px-4 d-md-block">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <input 
                type="text" 
                className="form-control my-3" 
                placeholder="Nhập tên người dùng hoặc chủ trọ..."
                onKeyDown={handleKey}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setShowRentalers(false);
                }}
                value={username}
              />
              
              <button 
                className="btn btn-sm btn-outline-primary w-100 mb-2"
                onClick={() => setShowRentalers(!showRentalers)}
              >
                {showRentalers ? "Ẩn danh sách chủ trọ" : "Hiển thị tất cả chủ trọ"}
              </button>

              {err && <span className="text-danger">Không tìm thấy người dùng</span>}
              
              {/* Kết quả tìm kiếm */}
              {userList && userList.length > 0 && (
                <div className="userList">
                  <div className="text-muted small mb-2">Kết quả tìm kiếm:</div>
                  {userList.map((user) => (
                    <div 
                      className="list-group-item list-group-item-action border-0 cursor-pointer" 
                      style={{ margin: "5px 10px", paddingLeft: "10px" }}
                      key={user.id} 
                      onClick={() => handleSelect(user)}
                    >
                      <div className="d-flex align-items-start">
                        <img 
                          src={user.imageUrl || "https://via.placeholder.com/50"} 
                          alt={user.name}
                          className="rounded-circle me-2"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                        />
                        <div className="flex-grow-1">
                          <div>{user.name}</div>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Danh sách tất cả rentalers */}
              {showRentalers && rentalersList.length > 0 && (
                <div className="rentalersList" style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <div className="text-muted small mb-2">Danh sách chủ trọ ({rentalersList.length}):</div>
                  {rentalersList.map((rentaler) => (
                    <div 
                      className="list-group-item list-group-item-action border-0 cursor-pointer" 
                      style={{ margin: "5px 10px", paddingLeft: "10px", cursor: "pointer" }}
                      key={rentaler.id} 
                      onClick={() => handleSelect(rentaler)}
                    >
                      <div className="d-flex align-items-start">
                        <img 
                          src={rentaler.imageUrl || "https://via.placeholder.com/50"} 
                          alt={rentaler.name}
                          className="rounded-circle me-2"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                        />
                        <div className="flex-grow-1">
                          <div>{rentaler.name}</div>
                          <small className="text-muted">{rentaler.email}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
    </>
  );
};

export default Search;
