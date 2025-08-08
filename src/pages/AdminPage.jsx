import { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { FiUserPlus, FiTrash2 } from 'react-icons/fi';
import { getAllDockerVolumeList } from '../api/containerApi';
import { LuRefreshCw } from "react-icons/lu";
import DockerVolumeSkeletonRow from '../components/skeleton/DockerVolumeSkeleton';

// 볼륨 목록 관련
import NewVolumeModal from '../components/admin/NewVolumeModal';
import AddVolumeUserModal from '../components/admin/AddVolumeUserModal';
import { CreateVolumeApi, DeleteVolumeApi, DeleteVolumeUserApi, AddVolumeUserApi } from '../api/admin/volumeControlApi';
import { getAllUsers, deleteUserApi, addUserApi } from '../api/admin/userApi';
import DownloadRequestsModal from '../components/admin/DownloadRequestsModal';

// 사용자 목록 관련
import AddUserModal from '../components/admin/AddUserModal';

const COMPANY_NAME = 'BMI Server Controller ADMIN';

const AdminPage = ({ user, onLogout }) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const [dockerVolumeListloading, setDockerVolumeListLoading] = useState(true);
    const [dockerVolumeData, setDockerVolumeData] = useState([]);
    const [hoveredVolume, setHoveredVolume] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");

    const [showNewVolumeModal, setShowNewVolumeModal] = useState(false);
    const [showAddVolumeUserModal, setShowAddVolumeUserModal] = useState(false);
    const [createVolumeLoading, setCreateVolumeLoading] = useState(false);
    const [addVolumeUserLoading, setAddVolumeUserLoading] = useState(false);
    
    // 사용자 목록 관련
    const [showDownloadRequestsModal, setShowDownloadRequestsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userSearchKeyword, setUserSearchKeyword] = useState("");
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [addUserLoading, setAddUserLoading] = useState(false);
    const [userListLoading, setUserListLoading] = useState(false);
    const [userList, setUserList] = useState([]);
    const [userPage, setUserPage] = useState(1);
    const USER_PAGE_SIZE = 10;

    // 도커 볼륨 목록 새로고침 함수
    const refreshDockerVolumeList = () => {
        setDockerVolumeListLoading(true);
        getAllDockerVolumeList()
            .then((res) => {
                const data = res.data;
                setDockerVolumeData(data);
                setDockerVolumeListLoading(false);
            })
            .catch((err) => {
                setDockerVolumeListLoading(false);
            });
    };

    // 도커 볼륨 혹은 사용자 검색 함수
    const filteredVolumeData = Object.entries(dockerVolumeData).filter(
        ([volumeName, info]) => {
            const keyword = searchKeyword.toLowerCase();
            const matchesVolume = volumeName.toLowerCase().includes(keyword);
            const matchesUser = info.users.some((user) => 
                user.toLowerCase().includes(keyword)
            );
            return matchesVolume || matchesUser;
        }
    )

    // 사용자 검색 함수
    const filteredUserData = Object.values(userList).filter((user) => {
        const keyword = userSearchKeyword.toLowerCase();
        const matchesUserId = user.user_id.toLowerCase().includes(keyword);
        const matchesUserName = user.user_name.toLowerCase().includes(keyword);
        return matchesUserId || matchesUserName;
    });

    // 페이지네이션 계산
    const userTotalPages = Math.ceil(filteredUserData.length / USER_PAGE_SIZE);
    const pagedUserData = filteredUserData.slice((userPage - 1) * USER_PAGE_SIZE, userPage * USER_PAGE_SIZE);

    // 검색어 변경 시 페이지 리셋
    useEffect(() => {
        setUserPage(1);
    }, [userSearchKeyword]);
    
    // 검색한 키워드 하이라이트 함수
    const highlightText = (text, keyword) => {
        if (!keyword) return text;
        const regex = new RegExp(`(${keyword})`, 'gi');
        return text.split(regex).map((part, i) => 
            part.toLowerCase() === keyword.toLowerCase() ? (
                <mark key={i} className='bg-yellow-200 text-black rounded'>
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    // 볼륨 생성 API 호출
    const handleCreateVolume = ( volumeData ) => {
        setCreateVolumeLoading(true);
        CreateVolumeApi({userPW: user.userPW, volumeData: volumeData})
            .then((res) => {
                alert("볼륨이 생성되었습니다.");
                setShowNewVolumeModal(false);
                refreshDockerVolumeList();
            })
            .catch((err) => {
                console.log(err);
                alert("볼륨 생성에 실패하였습니다. 다시 시도해주세요.");  
            })
            .finally(() => {
                setCreateVolumeLoading(false);
            });
    }

    // 볼륨 생성 API 호출
    const handleAddVolumeUser = ( vol_name, user_name ) => {
        setAddVolumeUserLoading(true);
        AddVolumeUserApi({userPW: user.userPW, vol_name: vol_name, user_name: user_name})
            .then((res) => {
                alert("사용자가 추가되었습니다.");
                setShowAddVolumeUserModal(false);
                refreshDockerVolumeList();
            })
            .catch((err) => {
                console.log(err);
                alert("사용자 추가에 실패하였습니다. 다시 시도해주세요.");  
            })
            .finally(() => {
                setAddVolumeUserLoading(false);
            });
    }

    const handleDeleteVolume = (vol_name) => { // 볼륨 삭제 API 호출
        if (window.confirm(`${vol_name} 볼륨을 삭제하시겠습니까?`)){
            setDockerVolumeData((prev) => {
                const backup = {...prev};
                const updated = {...prev};
                delete updated[vol_name];

                DeleteVolumeApi({userPW: user.userPW, vol_name: vol_name})
                .then(() => {
                    console.log("정상적으로 삭제되었습니다.");
                })
                .catch((err) => {
                    alert("삭제에 실패하였습니다. 다시 시도해주세요.");
                    console.error("Delete error", err);
                    setDockerVolumeData(backup);
                });
            return updated;
            });
        }
    };

    const handleDeleteVolumeUser = (vol_name, user_name) => { // 볼륨 사용자 삭제 API 호출
        if (window.confirm(`${vol_name} 볼륨의 ${user_name} 사용자를 삭제하시겠습니까?`)){
            setDockerVolumeData((prev) => {
                const backup = {...prev};
                const updatedUsers = prev[vol_name].users.filter(
                    (user) => user !== user_name
                );

                const updated = {
                    ...prev,
                    [vol_name]: {
                        ...prev[vol_name],
                        users: updatedUsers
                    }
                }
                DeleteVolumeUserApi({userPW: user.userPW, vol_name: vol_name, user_name: user_name})
                .then(() => {
                    console.log("정상적으로 삭제되었습니다.");
                })
                .catch((err) => {
                    alert("삭제에 실패하였습니다. 다시 시도해주세요.");
                    console.error("Delete error", err);
                    setDockerVolumeData(backup);
                });
            return updated;
            });
        }
    };


    // 사용자 목록 새로고침 함수
    const refreshUserList = () => {
        setUserListLoading(true);
        getAllUsers(user.userPW)
            .then((res) => {
                setUserList(res.data.data);
                setUserListLoading(false);
            })
            .catch((err) => {
                setUserListLoading(false);
                setUserList([]);
            });
    }

    // 사용자 삭제 API 호출
    const handleDeleteUser = (user_id, user_key) => { 
        if (window.confirm(`${user_id} 사용자를 삭제하시겠습니까?`)){
            setUserList(prev => {
                const backup = {...prev};
                const updated = {...prev};

                const keyToDelete = Object.keys(prev)
                    .find(key => prev[key].user_id === user_id);
                delete updated[keyToDelete];

                console.log('backup', backup);
                console.log('updated', updated);
                console.log('keyToDelete', keyToDelete);

                deleteUserApi({userPW: user.userPW, user_id: user_id})
                .then(() => {
                    console.log("정상적으로 삭제되었습니다.");
                })
                .catch((err) => {
                    alert("삭제에 실패하였습니다. 다시 시도해주세요.");
                    console.error("Delete error", err);
                    setUserList(backup);
                });
            return updated;
            });
        }
    };

     // 사용자 생성 API 호출
     const handleAddUser = ({ user_id, user_name, user_password }) => {
        addUserApi({userPW: user.userPW, user_id: user_id, user_name: user_name, user_password: user_password})
            .then((res) => {
                alert("사용자가 추가되었습니다.");
                setShowAddUserModal(false);
                refreshUserList();
            })
            .catch((err) => {
                console.log(err);
                alert("사용자 추가에 실패하였습니다. 다시 시도해주세요.");  
            })
            .finally(() => {
                setAddUserLoading(false);
            });
    }

    useEffect(() => {
        refreshDockerVolumeList();
        refreshUserList();
    }, []);

    // 외부 영역 클릭 감지
    useEffect(() => {
        function handleClickOutside(event) {
            if(profileRef.current && !profileRef.current.contains(event.target)){
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setProfileOpen]);

    // 모달이 열렸을 때 body의 스크롤 막기
    useEffect(() => {
        if (showNewVolumeModal || showAddUserModal || showDownloadRequestsModal) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        
        return () => document.body.classList.remove('overflow-hidden');
    }, [showNewVolumeModal, showAddUserModal, showDownloadRequestsModal]);

    const userOptions = Object.values(userList).map(user => ({ value: user.user_id, label: user.user_id }));

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* 상단바 */}
            <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-3 h-14">
                <span className="text-base sm:text-lg font-bold tracking-wide text-blue-700">{COMPANY_NAME}</span>
                <div className="relative" ref={profileRef}>
                    <button className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition" onClick={() => setProfileOpen(v => !v)}>
                    <span className="text-sm text-gray-800 font-medium">{user.userId}</span>
                    <FaChevronDown className="text-gray-400 text-xs" />
                    </button>
                    {profileOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20">
                        <div className="px-4 py-2 text-blue-700 text-xs font-semibold">{user.userId}</div>                        
                        <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 text-xs font-medium" onClick={onLogout}>로그아웃</button>
                    </div>
                    )}
                </div>
                </div>
            </nav>
            
            {/* 사용자 목록 섹션 */}
            <div className="max-w-7xl mx-auto flex justify-between items-center px-3 mt-8 mb-4">
                <div className="flex gap-2">
                    <span className="text-3xl font-semibold text-gray-800 mb-2">사용자 목록</span>
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 mb-2"
                        title="사용자 목록 새로고침"
                        onClick={refreshUserList}
                    >
                        <LuRefreshCw size={18} />
                    </button>
                </div>
                <div className='flex gap-4'>
                    <input
                        type='text'
                        placeholder='사용자 ID/이름 검색'
                        value={userSearchKeyword}
                        onChange={(e) => setUserSearchKeyword(e.target.value)}
                        className='border border-gray-300 px-3 py-1 rounded-lg max-w-lg hover:border-gray-400 focus:border-gray-900 outline-none'
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm transition" onClick={() => setShowAddUserModal(true)}>
                        + 새 사용자 생성
                    </button>
                    {showAddUserModal && (
                        <AddUserModal
                            onClose={() => setShowAddUserModal(false)}
                            onSubmit={handleAddUser}
                        />
                    )}
                </div>
            </div>

            {/* 사용자 목록 테이블 */}
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 mb-10 overflow-x-auto">
                <table className="w-full min-w-[600px] text-xs sm:text-sm table-fixed">
                <colgroup>
                    <col className="w-32" />
                    <col className="w-32" />
                    <col className="w-4" />
                    <col className="w-4" />
                </colgroup>
                <thead>
                    <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
                        <th className="border-r border-gray-200 py-3 px-2 font-semibold text-xs tracking-wide">사용자 ID</th>
                        <th className="border-r border-gray-200 py-3 px-2 font-semibold text-xs tracking-wide">사용자 이름</th>
                        <th className="border-r border-gray-200 py-3 px-2 font-semibold text-xs tracking-wide">사용자<br></br>삭제</th>
                        <th className="py-3 px-2 font-semibold text-xs tracking-wide">파일<br></br>다운로드</th>
                    </tr>
                </thead>
                <tbody>
                    {pagedUserData.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="py-8 text-center text-gray-500">
                                {userSearchKeyword ? '검색 결과가 없습니다.' : '사용자가 없습니다.'}
                            </td>
                        </tr>
                    ) : (
                        pagedUserData.map((userItem) => (
                            <tr key={userItem.user_id} className="group border-b border-gray-100 last:border-0 hover:bg-blue-50 transition">
                                <td className="border-r border-gray-200 py-3 px-2 align-middle text-center font-semibold text-gray-700 truncate">
                                    {highlightText(userItem.user_id, userSearchKeyword)}
                                </td>
                                <td className="border-r border-gray-200 py-3 px-2 align-middle text-center text-gray-700 truncate">
                                    {highlightText(userItem.user_name, userSearchKeyword)}
                                </td>
                                <td className="border-r border-gray-200 py-3 px-2 align-middle text-center">
                                    <button className="p-1 rounded-lg bg-red-50 hover:bg-red-100 transition-all duration-200 border border-red-200/50 hover:border-red-300 hover:shadow-sm" title="볼륨 삭제"
                                        onClick={() => handleDeleteUser(userItem.user_id)}>
                                        <FiTrash2 className='text-red-600'/>
                                    </button>
                                </td>
                                <td className="py-3 px-2 align-middle text-center">
                                    <button 
                                        className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200 border border-blue-200/50 hover:border-blue-300 hover:shadow-sm" 
                                        title="파일 다운로드 신청 내역"
                                        onClick={() => {
                                            setSelectedUser(userItem);
                                            setShowDownloadRequestsModal(true);
                                        }}
                                     >
                                         <FaChevronRight className='text-blue-500'/>
                                     </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
                </table>
            </div>

            {/* 사용자 목록 페이지네이션 */}
            {userTotalPages > 1 && (
                <div className="max-w-7xl mx-auto flex justify-center items-center px-3 mb-10">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setUserPage(prev => Math.max(prev - 1, 1))}
                            disabled={userPage === 1}
                            className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            이전
                        </button>
                        
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: userTotalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setUserPage(pageNum)}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                        userPage === pageNum
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                        
                        <button
                            onClick={() => setUserPage(prev => Math.min(prev + 1, userTotalPages))}
                            disabled={userPage === userTotalPages}
                            className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            다음
                        </button>
                    </div>
                </div>
            )}

            {/* 파일 다운로드 신청 모달 */}
            {showDownloadRequestsModal && selectedUser && (
                <DownloadRequestsModal
                    onClose={() => {
                        setShowDownloadRequestsModal(false);
                        setSelectedUser(null);
                    }}
                    user={selectedUser}
                    userPW={user.userPW}
                />
            )}

            <div className="max-w-7xl mx-auto flex justify-between items-center px-3 mt-16 mb-4">
                <div className="flex gap-2">
                    <span className="text-3xl font-semibold text-gray-800 mb-2">도커 볼륨 목록</span>
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 mb-2"
                        title="도커 볼륨 목록 새로고침"
                        onClick={refreshDockerVolumeList}
                    >
                        <LuRefreshCw size={18} />
                    </button>
                </div>
                <div className='flex gap-4'>
                    <input
                        type='text'
                        placeholder='볼륨/사용자 검색'
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className='border border-gray-300 px-3 py-1 rounded-lg max-w-lg hover:border-gray-400 focus:border-gray-900 outline-none'
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm transition" onClick={() => setShowNewVolumeModal(true)}>
                        + 새 볼륨 생성
                    </button>
                    {showNewVolumeModal && (
                        <NewVolumeModal
                            onClose={() => setShowNewVolumeModal(false)}
                            onSubmit={handleCreateVolume}
                            userOptions={userOptions}
                        />
                    )}
                </div>
            </div>

            {/* 도커 볼륨 목록 테이블 */}
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 mb-10 overflow-x-auto">
                <table className="w-full min-w-[900px] text-xs sm:text-sm table-fixed">
                <colgroup>
                    <col className="w-32" />
                    <col className="w-8" />
                    <col className="w-4" />
                    <col className="w-4" />
                    <col className="w-24" />
                    <col className="w-4" />
                </colgroup>
                <thead>
                    <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
                        <th className="border-r border-gray-200 py-3 px-2 font-semibold text-xs tracking-wide">볼륨 이름</th>
                        <th className="border-r border-gray-200 py-3 px-2 font-semibold text-xs tracking-wide">권한</th>
                        <th className="border-r border-gray-200 py-3 px-2 font-semibold text-xs tracking-wide">사용자<br></br>추가</th>
                        <th className="border-r border-gray-200 py-3 px-2 font-semibold text-xs tracking-wide">볼륨<br></br>삭제</th>
                        <th className="py-3 px-2 font-semibold text-xs tracking-wide">사용자</th>
                        <th className="py-3 px-2 pr-4 font-semibold text-xs tracking-wide">사용자 삭제</th>
                    </tr>
                </thead>
                <tbody>
                    { dockerVolumeListloading
                        ? Array.from({ length: 5 }).map((_, idx) => <DockerVolumeSkeletonRow key={idx} />)
                        : filteredVolumeData.map(([volumeName, info]) => {
                            const users = info.users.length > 0 ? info.users : ['-'];
                            return users.map((user, idx) => (
                                <tr key={`${volumeName}-${user}`}
                                    onMouseEnter={() => setHoveredVolume(volumeName)}
                                    onMouseLeave={() => setHoveredVolume(null)}
                                    className={`group border-b border-gray-00 last:border-0 ${hoveredVolume === volumeName ? 'bg-blue-50 transition-all' : ''}`}>
                                    {idx === 0 && (
                                        <>
                                            <td rowSpan={users.length} className="border-r border-gray-200 py-3 px-2 align-middle text-center text-gray-700 font-semibold truncate">{highlightText(volumeName, searchKeyword)}</td>
                                            <td rowSpan={users.length} className="border-r border-gray-200 py-3 px-2 align-middle text-center text-gray-700 truncate">
                                                <span
                                                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border
                                                        ${info.readwrite === 1 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}
                                                >
                                                    {info.readwrite
                                                        ? "readwrite"
                                                        :"readonly"}
                                                </span>
                                            </td>
                                            <td rowSpan={users.length} className="border-r border-gray-200 py-3 px-2 align-middle text-center">
                                                <button className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200 border border-blue-200/50 hover:border-blue-300 hover:shadow-sm" title="사용자 추가"
                                                    onClick={() => {setShowAddVolumeUserModal(volumeName)}}>
                                                    <FiUserPlus className='text-blue-600'/>
                                                </button>
                                            </td>
                                            <td rowSpan={users.length} className="border-r border-gray-200 py-3 px-2 align-middle text-center">
                                                <button className="p-1 rounded-lg bg-red-50 hover:bg-red-100 transition-all duration-200 border border-red-200/50 hover:border-red-300 hover:shadow-sm" title="볼륨 삭제"
                                                    onClick={() => {handleDeleteVolume(volumeName)}}>
                                                    <FiTrash2 className='text-red-600'/>
                                                </button>
                                            </td>
                                        </>
                                    )}

                                    <td className="py-3 px-2 align-middle text-center font-semibold text-gray-700 truncate">{user === '-' ? <span>-</span> : highlightText(user, searchKeyword)}</td>
                                    <td className="pr-4 border-r border-gray-200 py-3 px-2 align-middle text-center">
                                        {user === '-' ? (
                                            <span>-</span>
                                        ) : (
                                            <button className="p-1 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-gray-200/50 hover:border-gray-400 hover:shadow-sm" title="사용자 삭제"
                                                onClick={() => {handleDeleteVolumeUser(volumeName, user)}}>
                                                <FiTrash2 className='text-gray-600'/>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ));
                        })}
                        {showAddVolumeUserModal && (
                            <AddVolumeUserModal
                                onClose={() => setShowAddVolumeUserModal(false)}
                                onSubmit={(username) => handleAddVolumeUser(showAddVolumeUserModal, username)}
                                userOptions={userOptions}
                            />
                        )}
                </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminPage;