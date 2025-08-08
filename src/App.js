import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import AdminPage from "./pages/AdminPage";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData); // 로그인 완료
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if(user.userId==='admin'){
    return <AdminPage user={user} onLogout={handleLogout} />;
  }

  return <MainPage user={user} onLogout={handleLogout} />;
}

export default App;