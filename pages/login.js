import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/login.module.css';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // 在真实应用中，这里可以添加与后端的交互来验证用户登录信息
    // 在示例中，我们假设用户名为 "user"，密码为 "password" 才能登录
    if (username === 'user' && password === 'password') {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h1>className={styles.h1} Welcome, {username}! </h1>
          <button onClick={handleLogout}>Logout</button>
          {/* 在这里添加展示数据的组件 */}
        </div>
      ) : (
        <div>
          <h1>Login</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
}
