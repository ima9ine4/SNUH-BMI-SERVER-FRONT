import React, { useState, useEffect } from 'react';
import { FaPlay, FaStop, FaTrashAlt, FaFileAlt, FaChevronDown, FaExternalLinkAlt } from 'react-icons/fa';
import { getContainerList } from '../api/containerApi';

const COMPANY_NAME = 'SNUH BMI SERVER';
const USER_ID = 'test_1234';
const USER_PW = 'test_1234'
const USER_NAME = 'testuser';

const PAGE_SIZE = 10;

function mapApiContainer(apiObj) {
  return {
    id: apiObj["컨테이너이름"],
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

const MainPage = () => {
    const [containerData, setContainerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [page, setPage] = useState(1);
    const [profileOpen, setProfileOpen] = useState(false);
    const totalPages = Math.ceil(containerData.length / PAGE_SIZE);
    const pagedData = containerData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() =>{
        getContainerList()
            .then((res) => {
                const mapped = res.data.map(mapApiContainer);
                setContainerData(mapped);
                setLoading(false);
            })
            .catch((err) => {
                console.error("데이터 로딩 실패", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        {/* 상단바 */}
        <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-8 h-14">
            <span className="text-base sm:text-lg font-bold tracking-wide text-blue-700">{COMPANY_NAME}</span>
            <div className="relative">
                <button className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition" onClick={() => setProfileOpen(v => !v)}>
                <span className="text-sm text-gray-800 font-medium">{USER_NAME}</span>
                <FaChevronDown className="text-gray-400 text-xs" />
                </button>
                {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20">
                    <div className="px-4 py-2 text-blue-700 text-xs font-semibold">{USER_ID}</div>
                    <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 text-xs font-medium">로그아웃</button>
                </div>
                )}
            </div>
            </div>
        </nav>

        {/* 컨테이너 목록 헤더 */}
        <div className="max-w-7xl mx-auto flex justify-between items-center px-3 mt-8 mb-4">
            <span className="text-2xl font-medium text-gray-700">컨테이너 목록</span>
            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm transition" onClick={() => setShowPopup(true)}>
            + 새 도커 컨테이너 생성
            </button>
        </div>

        {/* 컨테이너 목록 테이블 */}
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 mb-10 overflow-x-auto">
            <table className="w-full min-w-[900px] text-xs sm:text-sm table-fixed">
            <colgroup>
                <col className="w-20" /> {/* 상태 */}
                <col className="w-48" /> {/* 이름 */}
                <col className="w-40" /> {/* 이미지 */}
                <col className="w-16" /> {/* CPU */}
                <col className="w-16" /> {/* RAM */}
                <col className="w-16" /> {/* GPU */}
                <col className="w-28" /> {/* 서버 */}
                <col className="w-12" /> {/* 동작 */}
                <col className="w-16" /> {/* 접속 */}
                <col className="w-12" /> {/* 로그 */}
                <col className="w-12" /> {/* 삭제 */}
            </colgroup>
            <thead>
                <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
                <th className="py-3 px-2 font-semibold text-xs tracking-wide">상태</th>
                <th className="py-3 px-2 font-semibold text-xs tracking-wide">컨테이너 이름</th>
                <th className="py-3 px-2 font-semibold text-xs tracking-wide">이미지 이름</th>
                <th className="py-3 px-2 font-semibold text-xs tracking-wide">CPU</th>
                <th className="py-3 px-2 font-semibold text-xs tracking-wide">RAM</th>
                <th className="py-3 px-2 font-semibold text-xs tracking-wide">GPU 슬롯</th>
                <th className="py-3 px-2 font-semibold text-xs tracking-wide">생성 서버</th>
                <th className="py-3 px-2 font-semibold text-xs tracking-wide">동작</th>
                <th className="py-3 px-2 font-semibold text-xs tracking-wide">접속</th>
                <th className="py-3 px-2 font-semibold text-xs tracking-wide">로그</th>
                <th className="py-3 px-2 font-semibold text-xs tracking-wide">삭제</th>
                </tr>
            </thead>
            <tbody>
                {pagedData.map((c) => (
                <tr key={c.id} className="group border-b border-gray-100 last:border-0 hover:bg-blue-50/60 transition">
                    <td className="py-3 px-2 align-middle text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${c.status === 'Running' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{c.status}</span>
                    </td>
                    <td className="py-3 px-2 align-middle text-center font-semibold text-gray-700 truncate">{c.name}</td>
                    <td className="py-3 px-2 align-middle text-center text-gray-700 truncate">{c.image}</td>
                    <td className="py-3 px-2 align-middle text-center text-gray-700">{c.cpu}</td>
                    <td className="py-3 px-2 align-middle text-center text-gray-700">{c.ram}</td>
                    <td className="py-3 px-2 align-middle text-center text-gray-700">{c.gpu}</td>
                    <td className="py-3 px-2 align-middle text-center text-gray-700">{c.server}</td>
                    <td className="py-3 px-2 align-middle text-center">
                    {c.status === 'Running' ? (
                        <button className="p-1.5 rounded hover:bg-red-100 text-red-500 text-base" title="중지">
                            <FaStop />
                        </button>
                    ) : (
                        <button className="p-1.5 rounded hover:bg-green-100 text-green-600 text-base" title="재시작">
                            <FaPlay />
                        </button>
                    )}
                    </td>
                    <td className="py-3 px-2 align-middle text-center">
                    <a
                        href={c.address}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium underline"
                        title="접속"
                    >
                        접속
                        <FaExternalLinkAlt className="inline-block text-xs mb-0.5" />
                    </a>
                    </td>
                    <td className="py-3 px-2 align-middle text-center">
                    <button className="p-1.5 rounded hover:bg-blue-100 text-blue-600 text-base" title="로그보기">
                        <FaFileAlt />
                    </button>
                    </td>
                    <td className="py-3 px-2 align-middle text-center">
                    <button className="p-1.5 rounded hover:bg-red-100 text-red-500 text-base" title="삭제">
                        <FaTrashAlt />
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            {/* 페이지네이션 */}
            <div className="flex justify-center items-center gap-4 py-4">
            <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 rounded bg-gray-100 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">&lt;</button>
            <span className="text-gray-700 text-xs sm:text-sm">{page} / {totalPages}</span>
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-100 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">&gt;</button>
            </div>
        </div>

        {/* 팝업 */}
        {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50" onClick={() => setShowPopup(false)}>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 min-w-[340px] px-8 py-7 relative" onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-blue-700 mb-3">새 도커 컨테이너 생성</h2>
                <p className="text-gray-700 text-sm mb-4">팝업 내용은 추후 구현 예정</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2 text-sm font-semibold shadow-sm transition" onClick={() => setShowPopup(false)}>닫기</button>
            </div>
            </div>
        )}
        </div>
    );
}

export default MainPage;