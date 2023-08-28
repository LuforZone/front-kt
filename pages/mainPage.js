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
    const [conform, setConform] = useState('');

    const setConformType = (type) => {
        setConform(type);
    };

    useEffect(() => {
        // Check if the user is authenticated (e.g., coming from LoginPage)
        // If not authenticated, redirect to error page

        // Fetch total pages count
        fetch(`http://lufor.online:8080/api/users/count`)
            .then(response => response.json())
            .then(data => setTotalPages(data))
            .catch(error => console.error('Error fetching data:', error));

        // Fetch initial page data
        fetchPageData(1);
        setMessage('Welcome to here');
    }, []);

    const fetchPageData = (page) => {
        fetch(`http://lufor.online:8080/api/users/${page}`)
            .then(response => response.json())
            .then(data => setUsersData(data));
        console.log(usersData);
    };

    const handlePageChange = (page) => {
        fetchPageData(page);
        setCurrentPage(page);
    };
    const handlePostDatas = async () => {
        console.log("handlePostDatas");
        const requestBody = {
            name: nameToPost,
            phone: phoneToPost,
            sex: sexToPost,
            email: emailToPost,
            uuid: uuidToPost
        };

        try {
            const response = await fetch('http://lufor.online:8080/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const responseData = await response.json();
            setMessage(responseData.message);
        } catch (error) {
            console.error('Error sending POST request:', error);
        }
    };

    const handlePutDatas = async () => {
        console.log("handlePutDatas");
        const requestBody = {
            name: nameToPost?nameToPost:undefined,
            phone: phoneToPost?phoneToPost:undefined,
            sex: sexToPost?sexToPost:undefined,
            email: emailToPost,
            uuid: uuidToPost?uuidToPost:undefined
        };
        console.log(requestBody);
        const userToUpdate = usersData.find(user => user.email === emailToPost);

        if (!userToUpdate) {
            setMessage('不能找到对应的数据条目，请核对邮箱');
            console.error('User not found for the provided email.');
            return;
        }

        try {
            console.log("access put try");
            const response = await fetch(`http://lufor.online:8080/api/users/${userToUpdate.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const responseData = await response.json();
            setMessage(responseData.message);
            router.reload();
        } catch (error) {
            console.error('Error sending POST request:', error);
        }
    };
    const handleDeleteDatas = async () => {
        const emailToDelete = emailToPost;
        try {
            const response = await fetch(`http://lufor.online:8080/api/users/${emailToDelete}`, {
                method: 'DELETE',
            });
            const responseData = await response.json();
            setMessage(responseData.message);
            router.reload();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };
    const handleAddButtonClick = () => {
        setMessage("请在上面的输入栏中输入要加入人员的信息")
        setConformType("add");
    };
    const handleDeleteButtonClick = () => {
        setMessage("请在上面的输入栏中输入要删除人员的邮箱")
        setConformType("delete");
    };
    const handlePutButtonClick = () => {
        setMessage("请在上面的输入栏中输入要更改人员的信息，注意附带邮箱")
        setConformType("put");
    };
    const handleConformButtonClick = async () => {
        switch (conform) {
            case "add":
                handlePostDatas();
                break;
            case "delete":
                handleDeleteDatas();
                break;
            case "put":
                handlePutDatas();
                break;
            default:
                setMessage('请选择一个操作类型');
        }
    };

    return (
        <div className={styles['main']}>
            <div className={styles['sidebar']}>
                <div className={styles['sidebar-buttons']}>
                    <button className={styles['sidebar-change']}
                        onClick={handleAddButtonClick}
                    >添加</button>
                    <button className={styles['sidebar-delete']}
                        onClick={handlePutButtonClick}
                    >更改</button>
                    <button className={styles['sidebar-add']}
                        onClick={handleDeleteButtonClick}
                    >删除</button>
                </div>
                <div className={styles['sidebar-inputs']}>
                    <p>输入栏⬇️</p>
                    <input
                        type="text"
                        value={nameToPost}
                        placeholder="输入名称"
                        onChange={(e) => setNameToPost(e.target.value)}
                    />
                    <input
                        type="text"
                        value={phoneToPost}
                        placeholder="输入手机号码"
                        onChange={(e) => setPhoneToPost(e.target.value)} // 添加onChange处理函数
                    />
                    <input
                        type="text"
                        value={sexToPost}
                        placeholder="输入male或female"
                        onChange={(e) => setSexToPost(e.target.value)} // 添加onChange处理函数
                    />
                    <input
                        type="text"
                        value={emailToPost}
                        placeholder="输入邮箱"
                        onChange={(e) => setEmailToPost(e.target.value)} // 添加onChange处理函数
                    />
                    <input
                        type="text"
                        value={uuidToPost}
                        placeholder="输入uuid"
                        onChange={(e) => setUuidToPost(e.target.value)} // 添加onChange处理函数
                    />
                    <button className={styles['sidebar-conform']}
                        onClick={handleConformButtonClick}
                    >确认</button>
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