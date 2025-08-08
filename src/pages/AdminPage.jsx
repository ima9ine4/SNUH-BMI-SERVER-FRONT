import { useState, useEffect, useRef } from 'react';
import { FaChevronDown,  } from 'react-icons/fa';
import { FiUserPlus, FiTrash2 } from 'react-icons/fi';
import { getAllDockerVolumeList } from '../api/containerApi';
import PasswordChangeModal from '../components/PasswordChangeModal'
import { BsDownload } from 'react-icons/bs';
import { LuRefreshCw } from "react-icons/lu";
import FileListSkeletonRow from '../components/skeleton/FileListSkeletonRow';
import { changePassword } from '../api/loginApi';
import { getFileList } from '../api/FileApi';
import dayjs from 'dayjs';
import FileUploadModal from '../components/FileUploadModal';
import { UploadFile, DownloadFile } from '../api/FileApi';
import DockerVolumeSkeletonRow from '../components/skeleton/DockerVolumeSkeleton';

// 볼륨 목록 관련
import NewVolumeModal from '../components/admin/NewVolumeModal';
import AddVolumeUserModal from '../components/admin/AddVolumeUserModal';
import { CreateVolumeApi, DeleteVolumeApi, DeleteVolumeUserApi, AddVolumeUserApi } from '../api/admin/volumeControlApi';
import { getAllUsers } from '../api/admin/userApi';

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
    const [userList, setUserList] = useState([]);
    const [createVolumeLoading, setCreateVolumeLoading] = useState(false);
    const [addVolumeUserLoading, setAddVolumeUserLoading] = useState(false);

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

    useEffect(() => {
        refreshDockerVolumeList();
        getAllUsers(user.userPW)
            .then(res => {
                setUserList(res.data.data)
            })
            .catch(() => setUserList([]));
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
        if (showNewVolumeModal) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        
        return () => document.body.classList.remove('overflow-hidden');
    }, [showNewVolumeModal]);

    const userOptions = userList.map(user => ({ value: user.user_id, label: user.user_id }));

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