import { useState } from "react";

function CiamWidget() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");

  const handleLogin = () => {
    setUser("john.doe@example.com");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser("");
    setIsLoggedIn(false);
  };

  return (
    <div
      style={{
        border: "2px solid #646cff",
        borderRadius: "8px",
        padding: "20px",
        margin: "20px 0",
        backgroundColor: "#1a1a1a",
      }}
    >
      <h2 style={{ color: "#646cff", marginTop: 0 }}>
        CIAM Authentication Widget
      </h2>
      {!isLoggedIn ? (
        <div>
          <p>Please log in to continue</p>
          <button
            onClick={handleLogin}
            style={{
              backgroundColor: "#646cff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </div>
      ) : (
        <div>
          <p style={{ color: "#61dafb" }}>Welcome, {user}!</p>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#f56565",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}
      <p style={{ fontSize: "12px", color: "#888", marginBottom: 0 }}>
        🔄 Loaded from Remote Module Federation
      </p>
    </div>
  );
}

export default CiamWidget;
