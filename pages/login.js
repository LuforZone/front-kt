import { useState } from 'react';
import { useRouter } from 'next/router';

function LoginPage() {
    const router = useRouter();
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const handleAccountChange = (event) => {
        setAccount(event.target.value);
        setIsButtonDisabled(!event.target.value || !password);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setIsButtonDisabled(!account || !event.target.value);
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('http://lufor.online:8080/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                credentials: 'include', // 携带跨域请求的凭证
                body: JSON.stringify({
                    "account": account,
                    "password": password
                }),
            });

            if (response.status === 200) {
                router.push('/mainPage');
            } else {
                setErrorMessage('请检查账户名或密码');
            }
        } catch (error) {
            console.error('登录失败：', error);
        }
    };

    return (
        <div className="login-container">
          <div className="input-group">
            <input
              type="text"
              placeholder="请输入账号"
              value={account}
              onChange={handleAccountChange}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button
            className="login-button"
            onClick={handleLogin}
            disabled={isButtonDisabled}
          >
            登录
          </button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default LoginPage;
