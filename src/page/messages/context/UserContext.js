// UserContext.js
import { createContext, useContext, useState, useEffect } from "react";
import '../style.css'

const UserContext = createContext();

export const UserProvider = ({ children, navigationState }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Nếu có ownerId từ navigation state, tự động fetch thông tin chat với owner
    if (navigationState?.ownerId) {
      const fetchOwnerChat = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          console.log("🎯 Auto-selecting owner chat with ID:", navigationState.ownerId);
          
          const response = await fetch(`http://localhost:8080/user/message-chat/${navigationState.ownerId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("📡 Owner chat response status:", response.status);

          if (response.ok) {
            const data = await response.json();
            setSelectedUser(data);
            console.log("✅ Auto-selected owner chat:", data);
          } else {
            const errorText = await response.text();
            console.error("❌ Error fetching owner chat:", response.status, errorText);
          }
        } catch (error) {
          console.error("💥 Error auto-selecting owner:", error);
        }
      };

      fetchOwnerChat();
    }
  }, [navigationState]);

  return (
    <UserContext.Provider value={{ selectedUser, setSelectedUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
