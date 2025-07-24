import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaExternalLinkAlt } from 'react-icons/fa';
import { FiFileText, FiTrash2 } from 'react-icons/fi';
import {getContainerList, startContainer, stopContainer, fetchLogs, deleteContainer, createContainer, getDockerVolume} from '../api/containerApi';
import NewContainerModal from '../components/NewContainerModal'
import PasswordChangeModal from '../components/PasswordChangeModal'
import { BsDownload } from 'react-icons/bs';
import { LuRefreshCw } from "react-icons/lu";
import { getDownloadList } from '../api/downloadApi';
import { MdOutlineReplay } from "react-icons/md";
import { FaRegCircleStop } from "react-icons/fa6";
import ContainerSkeletonRow from '../components/skeleton/ContainerSkeletonRow';
import { changePassword } from '../api/loginApi';


const COMPANY_NAME = 'SNUH BMI LAB SERVER';

const PAGE_SIZE = 4;
const DOWNLOAD_PAGE_SIZE = 4;

function mapApiContainer(apiObj) { // api response의 원본 json 배열을 가공하여 저장
    return {
        status: apiObj["status"] === "true" ? "Running" : "Stopped",
        name: apiObj["컨테이너이름"],
        image: apiObj["이미지이름"],
        cpu: apiObj["CPU크기(core)"] + " core",
        ram: apiObj["RAM크기(GB)"] + "GB",
        gpu: apiObj["GPU슬롯"],
        server: apiObj["생성 서버"],
        address: apiObj["접속주소"],
    };
}

const MainPage = ({ user, onLogout }) => {
    const [containerData, setContainerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createLoading, setCreateLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
    const [availableVolumes, setAvailableVolumes] = useState([]);
    const totalPages = Math.ceil(containerData.length / PAGE_SIZE);
    const pagedData = containerData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const [downloadData, setDownloadData] = useState([]);
    const [downloadPage, setDownloadPage] = useState(1);
    const downloadTotalPages = Math.ceil(downloadData.length / DOWNLOAD_PAGE_SIZE);
    const downloadPagedData = downloadData.slice((downloadPage - 1) * DOWNLOAD_PAGE_SIZE, downloadPage * DOWNLOAD_PAGE_SIZE);

    // 컨테이너 목록 새로고침 함수
    const refreshContainerList = () => {
        setLoading(true);
        getContainerList({userId: user.userId, userPW: user.userPW})
            .then((res) => {
                const mapped = res.data.data.map(mapApiContainer);
                setContainerData(mapped);
                setLoading(false);
            })
            .catch((err) => {
                
                setLoading(false);
            });
    };

    const handleStart = (name) => { // 컨테이너 시작 API 호출
        setStatusLoading(prev => ({ ...prev, [name]: true}));
        startContainer({userId: user.userId, userPW: user.userPW, serverName: name})
            .then(() => {
                setContainerData((prev) =>
                    prev.map((item) =>
                        item.name === name ? { ...item, status: "Running"} : item
                    )
                );
            })
            .catch(err => console.error("Start error", err))
            .finally(() => {
                setStatusLoading(prev => ({ ...prev, [name]: false }));
            });
    }

    const handleStop = (name) => { // 컨테이너 중지 API 호출
        setStatusLoading(prev => ({ ...prev, [name]: true}));
        stopContainer({userId: user.userId, userPW: user.userPW, serverName: name})
            .then(() => {
                setContainerData((prev) =>
                    prev.map((item) =>
                        item.name === name ? { ...item, status: "Stopped"} : item
                    )
                );
            })
            .catch(err => console.error("Stop error", err))
            .finally(() => {
                setStatusLoading(prev => ({ ...prev, [name]: false }));
            });
    }

    // const handleLogs = (name) => { // 컨테이너 로그 조회 API 호출
    //     fetchLogs({userId: user.userId, userPW: user.userPW, serverName: name})
    //         .then(res => {
    //             alert(`로그 ${res.data.logs}`);
    //         })
    //         .catch(err => console.error("Logs error", err));
    // }

    const handleDelete = (name) => { // 컨테이너 삭제 API 호출
        if (window.confirm(`${name} 컨테이너를 삭제하시겠습니까?`)){
            setContainerData((prev) => {
                const backup = [...prev];
                const updated = prev.filter(item => item.name !== name);

                deleteContainer({userId: user.userId, userPW: user.userPW, serverName: name})
                .then(() => {
                    console.log("삭제 완료");
                })
                .catch((err) => {
                    alert("삭제에 실패하였습니다.");
                    console.error("Delete error", err);
                    setContainerData(backup);
                });
                
            return updated;
            });
        }
    };

    const handleCreateContainer = (formData) => { // 컨테이너 생성 API 호출
        setCreateLoading(true);
        createContainer({userId: user.userId, userPW: user.userPW, formData})
            .then((res) => {
                alert("컨테이너 생성이 완료되었습니다.");
                setShowModal(false);
                refreshContainerList();
            })
            .catch((err) => {
                alert("컨테이너 생성에 실패하였습니다.");
            })
            .finally(() => {
                setCreateLoading(false);
            });
    };

    const handleChangePassword = (new_password) => {  // 비밀번호 변경 API 호출
        changePassword({userId: user.userId, userPW: user.userPW, new_password})
            .then(() => {
                alert("비밀번호가 성공적으로 변경되었습니다. \n새로운 비밀번호로 다시 로그인 해주세요.");
                setProfileOpen(false);
                setShowPasswordChangeModal(false);
                onLogout();
            })
            .catch((err) => {
                alert("비밀번호 변경에 실패하였습니다.");  
            })
    }
    
    // 다운로드 데이터 불러오기
    const fetchDownloadData = () => {
        getDownloadList().then(res => {
            setDownloadData(res.data);
        });
    };

    useEffect(() =>{
        refreshContainerList();
        getDockerVolume({userId: user.userId, userPW: user.userPW}).then((response) => {
            if(response.data.status_code !== 404){ // 도커 볼륨이 있을 때만
                setAvailableVolumes(response.data );
            }
        })
        .catch((err) => {
            console.log("도커 볼륨 로딩 실패", err);
        })
        fetchDownloadData();
    }, [user.userId, user.userPW]);

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
                        <button className="w-full text-left px-4 py-2 text-black-500 hover:bg-red-50 text-xs font-medium" onClick={() => setShowPasswordChangeModal(true)}>비밀번호 변경</button>
                        {showPasswordChangeModal && (
                            <PasswordChangeModal
                                onClose={() => setShowPasswordChangeModal(false)}
                                onSubmit={handleChangePassword}
                                user = {user}
                            />
                        )}
                        <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 text-xs font-medium" onClick={onLogout}>로그아웃</button>
                    </div>
                    )}
                </div>
                </div>
            </nav>

            {/* 컨테이너 목록 헤더 */}
            <div className="max-w-7xl mx-auto flex justify-between items-center px-3 mt-8 mb-4">
                <div className="flex gap-2">
                    <span className="text-3xl font-medium text-gray-900 mb-2">컨테이너 목록</span>
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 mb-2"
                        title="컨테이너 목록 새로고침"
                        onClick={refreshContainerList}
                    >
                        <LuRefreshCw size={18} />
                    </button>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm transition" onClick={() => setShowModal(true)}>
                    + 새 컨테이너 생성
                </button>
                {showModal && (
                    <NewContainerModal
                        onClose={() => setShowModal(false)}
                        onSubmit={handleCreateContainer}
                        volumeOptions={availableVolumes}
                    />
                )}
            </div>

            {/* 컨테이너 목록 테이블 */}
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 mb-10 overflow-x-auto">
                <table className="w-full min-w-[900px] text-xs sm:text-sm table-fixed">
                <colgroup>
                    <col className="w-48" />
                    <col className="w-40" />
                    <col className="w-16" />
                    <col className="w-16" />
                    <col className="w-16" />
                    <col className="w-28" />
                    <col className="w-20" />
                    <col className="w-12" />
                    <col className="w-16" />
                    {/* <col className="w-12" /> */}
                    <col className="w-12" />
                </colgroup>
                <thead>
                    <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
                    <th className="py-3 px-2 font-semibold text-xs tracking-wide">컨테이너 이름</th>
                    <th className="py-3 px-2 font-semibold text-xs tracking-wide">이미지 이름</th>
                    <th className="py-3 px-2 font-semibold text-xs tracking-wide">CPU</th>
                    <th className="py-3 px-2 font-semibold text-xs tracking-wide">RAM</th>
                    <th className="py-3 px-2 font-semibold text-xs tracking-wide">GPU 슬롯</th>
                    <th className="py-3 px-2 font-semibold text-xs tracking-wide">생성 서버</th>
                    <th className="py-3 px-2 font-semibold text-xs tracking-wide">상태</th>
                    <th className="py-3 px-2 font-semibold text-xs tracking-wide">동작</th>
                    <th className="py-3 px-2 font-semibold text-xs tracking-wide">접속</th>
                    {/* <th className="py-3 px-2 font-semibold text-xs tracking-wide">로그</th> */}
                    <th className="py-3 px-2 font-semibold text-xs tracking-wide">삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {loading
                        ? Array.from({ length: 4 }).map((_, idx) => <ContainerSkeletonRow key={idx} />)
                        : pagedData.map((c) => (
                            <tr key={c.id} className="group border-b border-gray-100 last:border-0 hover:bg-blue-50/60 transition">
                                <td className="py-3 px-2 align-middle text-center font-semibold text-gray-700 truncate">{c.name}</td>
                                <td className="py-3 px-2 align-middle text-center text-gray-700 truncate">{c.image}</td>
                                <td className="py-3 px-2 align-middle text-center text-gray-700">{c.cpu}</td>
                                <td className="py-3 px-2 align-middle text-center text-gray-700">{c.ram}</td>
                                <td className="py-3 px-2 align-middle text-center text-gray-700">{c.gpu}</td>
                                <td className="py-3 px-2 align-middle text-center text-gray-700">{c.server}</td>
                                <td className="py-3 px-2 align-middle text-center">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${c.status === 'Running' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{c.status}</span>
                                </td>
                                <td className="py-3 px-2 align-middle text-center">
                                {/* 동작 버튼 */}
                                {statusLoading[c.name] ? (
                                    <div className="flex items-center justify-center h-6">
                                        <div className='flex space-x-1'>
                                            <div className='w-1 h-1 bg-gray-400 rounded-full animate-bounce'></div>
                                            <div className='w-1 h-1 bg-gray-400 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
                                            <div className='w-1 h-1 bg-gray-400 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
                                        </div>
                                    </div>
                                ) : c.status === 'Running' ? (
                                    <button
                                        className="p-1 rounded hover:bg-gray-100 text-gray-500 text-sm"
                                        title="중지"
                                        onClick={() => handleStop(c.name)}
                                        disabled={statusLoading[c.name]}
                                    >
                                        <FaRegCircleStop />
                                    </button>
                                    ) : (
                                    <button
                                        className="p-1 rounded hover:bg-gray-100 text-gray-500 text-sm"
                                        title="재시작"
                                        onClick={() => handleStart(c.name)}
                                        disabled={statusLoading[c.name]}
                                    >
                                        <MdOutlineReplay />
                                    </button>
                                )}
                                </td>
                                <td className="py-3 px-2 align-middle text-center">
                                    {c.status === 'Running'
                                        ? <a
                                            href={c.address}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium underline"
                                            title="접속"
                                        >
                                        {c.status === 'Running' ? '접속' : '-'}
                                        <FaExternalLinkAlt className="inline-block text-xs mb-0.5" />
                                    </a>
                                    : <span>-</span>
                                    }
                                </td>
                                {/* <td className="py-3 px-2 align-middle text-center">
                                <button className="p-1 rounded hover:bg-gray-100 text-gray-500 text-sm" title="로그보기"
                                    onClick={() => handleLogs(c.name)}>
                                    <FiFileText />
                                </button>
                                </td> */}
                                <td className="py-3 px-2 align-middle text-center">
                                <button className="p-1 rounded hover:bg-gray-100 text-gray-500 text-sm" title="삭제"
                                    onClick={() => handleDelete(c.name)}>
                                    <FiTrash2 />
                                </button>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
                </table>
                {/* 페이지네이션 */}
                <div className="flex justify-center items-center gap-4 py-4">
                <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 rounded bg-gray-100 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">&lt;</button>
                <span className="text-gray-700 text-xs sm:text-sm">{page} / {totalPages}</span>
                <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-100 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">&gt;</button>
                </div>
            </div>

            {createLoading && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white bg-opacity-50 rounded-2xl p-6 flex flex-col items-center gap-4">
                        <div className='flex flex-col items-center gap-4'>
                            <div className='flex space-x-2'>
                                <div className='w-3 h-3 bg-blue-600 rounded-full animate-bounce'></div>
                                <div className='w-3 h-3 bg-blue-600 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
                                <div className='w-3 h-3 bg-blue-600 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <p className='text-xl text-gray-700 font-bold'>컨테이너 생성 중...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 다운로드 목록 헤더 */}
            {/* <div className="max-w-7xl mx-auto flex justify-between items-center px-3 mt-8 mb-4">
                <div className="flex gap-2">
                    <span className="text-3xl font-medium text-gray-900 mb-2">파일 다운로드</span>
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 mb-2"
                        title="파일 다운로드 목록 새로고침"
                        onClick={fetchDownloadData}
                    >
                        <LuRefreshCw size={18} />
                    </button>
                </div>
            </div> */}

            {/* 다운로드 목록 테이블 */}
            {/* <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 mb-10 overflow-x-auto">
                <table className="w-full min-w-[900px] text-xs sm:text-sm table-fixed">
                <colgroup>
                    <col className="w-16" />
                    <col className="w-48" />
                    <col className="w-16" />
                    <col className="w-16" />
                    <col className="w-8" />
                </colgroup>
                <thead>
                    <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
                    <th className="py-3 px-2 font-semibold text-xs tracking-wide">신청 날짜</th>
                    <th className="py-3 px-2 font-semibold text-xs tracking-wide">파일명</th>
                    <th className="py-3 px-2 font-semibold text-xs tracking-wide">허가 상태</th>
                    <th className="py-3 px-2 font-semibold text-xs tracking-wide">허가 날짜</th>
                    <th className="py-3 px-2 font-semibold text-xs tracking-wide">다운로드</th>
                    </tr>
                </thead>
                <tbody>
                    {downloadPagedData.map((c) => (
                    <tr key={c.id} className="group border-b border-gray-100 last:border-0 hover:bg-blue-50/60 transition">
                        <td className="py-3 px-2 align-middle text-center text-gray-700 truncate">{c.requestDate}</td>
                        <td className="py-3 px-2 align-middle text-center font-semibold text-gray-700 truncate">{c.fileName}</td>
                        <td className="py-3 px-2 align-middle text-center">
                            <span
                                className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border
                                    ${c.status === '허가 완료' ? 'bg-green-50 text-green-700 border-green-200' :
                                        c.status === '대기 중' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                        c.status === '반려' ? 'bg-red-50 text-red-600 border-red-200' :
                                        ''}
                                `}
                            >
                                {c.status}
                            </span>
                        </td>
                        <td className="py-3 px-2 align-middle text-center text-gray-700">{c.approveDate || '-'}</td>
                        <td className="py-3 px-2 align-middle text-center">
                            {c.status === '허가 완료' ? (
                              <button className="p-1 rounded hover:bg-gray-100 text-gray-500 text-sm" title="다운로드"
                                  onClick={() => alert(`${c.fileName} 다운로드`)}>
                                  <BsDownload />
                              </button>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table> */}
                {/* 페이지네이션 */}
                {/* <div className="flex justify-center items-center gap-4 py-4">
                    <button onClick={() => setDownloadPage(downloadPage - 1)} disabled={downloadPage === 1} className="px-3 py-1 rounded bg-gray-100 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">&lt;</button>
                    <span className="text-gray-700 text-xs sm:text-sm">{downloadPage} / {downloadTotalPages}</span>
                    <button onClick={() => setDownloadPage(downloadPage + 1)} disabled={downloadPage === downloadTotalPages} className="px-3 py-1 rounded bg-gray-100 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">&gt;</button>
                </div>
            </div> */}
        </div>
    );
}

export default MainPage;