import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from 'styles/mainStyles.module.css'

function MainPage() {
    const router = useRouter();
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersData, setUsersData] = useState([]);
    const [message, setMessage] = useState('');
    const [nameToPost, setNameToPost] = useState('');
    const [phoneToPost, setPhoneToPost] = useState('');
    const [sexToPost, setSexToPost] = useState('');
    const [emailToPost, setEmailToPost] = useState('');
    const [uuidToPost, setUuidToPost] = useState('');
    const [canSubmit, setCanSubmit] = useState(false);

    useEffect(() => {
        // Check if the user is authenticated (e.g., coming from LoginPage)
        // If not authenticated, redirect to error page

        // Fetch total pages count
        fetch('http://localhost:8080/api/users/count')
            .then(response => response.json())
            .then(data => setTotalPages(data));

        // Fetch initial page data
        fetchPageData(1);
        setMessage('Welcome to here');
    }, []);

    const fetchPageData = (page) => {
        fetch(`http://localhost:8080/api/users/${page}`)
            .then(response => response.json())
            .then(data => setUsersData(data));
        console.log(usersData);
    };

    const handlePageChange = (page) => {
        fetchPageData(page);
        setCurrentPage(page);
    };
    const handleSubmit = async () => {
        const requestBody = {
            name: nameToPost,
            phone: phoneToPost,
            sex: sexToPost,
            email: emailToPost,
            uuid: uuidToPost
        };

        try {
            const response = await fetch('http://localhost:8080/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            const responseData = await response.json();
            setMessage(responseData[1]);
        } catch (error) {
            console.error('Error sending POST request:', error);
        }
    };


    return (
        <div className={styles['main']}>
            <div className={styles['sidebar']}>
                <div className={styles['sidebar-buttons']}>
                    <button className={styles['sidebar-change']}>添加</button>
                    <button className={styles['sidebar-delete']}>更改</button>
                    <button className={styles['sidebar-add']}>删除</button>
                </div>
                <div className={styles['sidebar-inputs']}>
                    <p>输入栏⬇️</p>
                    <input></input>
                    <button className={styles['sidebar-conform']}>确认</button>
                    </div>
                <div className={styles['message-board']}>
                     <p className={styles['message']}>{message} </p>
                </div>
            </div>
            <div className={styles['main-container']}> {/* 使用组件级的样式类名 */}

                <div className={styles['table-container']}>
                    <div className={styles['table-header']}>
                        <div>姓名</div>
                        <div>电话号码</div>
                        <div>性别</div>
                        <div>邮箱</div>
                        <div>uuid</div>
                    </div>
                    {usersData.map(user => (
                        <div className={styles['user-row']} key={user.uuid}>
                            <div>{user.name}</div>
                            <div className={styles['phone']}>{user.phone}</div> {/* 添加对应的类名 */}
                            <div className={styles['gender']}>{user.sex}</div> {/* 添加对应的类名 */}
                            <div className={styles['email']}>{user.email}</div> {/* 添加对应的类名 */}
                            <div>{user.uuid}</div>
                        </div>
                    ))}
                </div>
                <div className={styles['page-numbers']}>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            className={`${styles['page-button']} ${index + 1 === currentPage ? 'disabled' : ''
                                }`}
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            disabled={index + 1 === currentPage}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

        </div>


    );
}

export default MainPage;