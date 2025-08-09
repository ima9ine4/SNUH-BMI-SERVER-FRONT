import { useState, useEffect } from 'react';
import { getUserDownloadRequests, approveDownloadRequest } from '../../api/admin/userApi';

const DownloadRequestsModal = ({ onClose, user, userPW }) => {
    const [downloadRequests, setDownloadRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approveLoading, setApproveLoading] = useState({});

    useEffect(() => {
        if (user) {
            loadDownloadRequests();
        }
    }, [user]);

    const loadDownloadRequests = () => {
        setLoading(true);
        getUserDownloadRequests({userPW: userPW, user_id: user.user_id})
            .then((res) => {
                setDownloadRequests(res.data.data.item_list);
                setLoading(false);
            })
            .catch((err) => {
                console.error('다운로드 신청 목록 조회 실패:', err);
                setDownloadRequests([]);
                setLoading(false);
            });
    };

    const handleApprove = ({requestId, file_name}) => {
        setApproveLoading(prev => ({ ...prev, [requestId]: true }));
        approveDownloadRequest({userPW: userPW, user_id: user.user_id, file_name: file_name})
            .then(() => {
                alert('다운로드 신청이 허가되었습니다.');
                loadDownloadRequests();
            })
            .catch((err) => {
                console.error('허가 실패:', err);
                alert('허가에 실패했습니다. 다시 시도해주세요.');
            })
            .finally(() => {
                setApproveLoading(prev => ({ ...prev, [requestId]: false }));
            });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div
                className="overflow-y-auto bg-white rounded-xl px-10 py-8 max-h-[80vh] w-[1200px] shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-blue-700 mb-2">파일 다운로드 신청 목록</h2>
                <p className="text-sm text-gray-600 mb-6">사용자: {user?.user_id}</p>

                <div className='px-2'>
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : downloadRequests.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>다운로드 신청 내역이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-xs sm:text-sm table-fixed">
                                <colgroup>
                                    <col className="w-8" />
                                    <col className="w-16" />
                                    <col className="w-48" />
                                    <col className="w-16" />
                                    <col className="w-8" />
                                </colgroup>
                                <thead>
                                    <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
                                        <th className="py-3 px-2 font-semibold text-xs tracking-wide">번호</th>
                                        <th className="py-3 px-2 font-semibold text-xs tracking-wide">신청 날짜</th>
                                        <th className="py-3 px-2 font-semibold text-xs tracking-wide">파일명</th>
                                        <th className="py-3 px-2 font-semibold text-xs tracking-wide">허가 날짜</th>
                                        <th className="py-3 px-2 font-semibold text-xs tracking-wide">허가</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(downloadRequests).map((request, index) => (
                                        <tr key={index} className="group border-b border-gray-100 last:border-0 hover:bg-blue-50/60 transition">
                                            <td className="py-3 px-2 align-middle text-center text-gray-500 font-medium">
                                                {downloadRequests.length - index}
                                            </td>
                                            <td className="py-3 px-2 align-middle text-center text-gray-700 truncate">
                                                {new Date(request.upload_date).toLocaleDateString('ko-KR')}
                                            </td>
                                            <td className="py-3 px-2 align-middle text-center font-semibold text-gray-700 truncate">
                                                {request.name}
                                            </td>
                                            <td className="py-3 px-2 align-middle text-center text-gray-700">
                                                {request.allowed_date 
                                                    ? new Date(request.allowed_date).toLocaleDateString('ko-KR')
                                                    : '-'
                                                }
                                            </td>
                                            <td className="py-3 px-2 align-middle text-center">
                                                {request.download_allowed === true ? (
                                                    <button className="px-2 py-1 text-green-600 font-semibold text-xs">허가 완료</button>
                                                ) : (
                                                    !approveLoading[index] ? (
                                                        <button 
                                                            className="px-2 py-1 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-300 text-xs font-semibold transition-colors" 
                                                            title="허가하기"
                                                            onClick={() => handleApprove({requestId: index, file_name: request.name})}
                                                        >
                                                            허가하기
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center justify-center h-6">
                                                            <div className='flex space-x-1'>
                                                                <div className='w-1 h-1 bg-gray-400 rounded-full animate-bounce'></div>
                                                                <div className='w-1 h-1 bg-gray-400 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
                                                                <div className='w-1 h-1 bg-gray-400 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-8">
                    <button onClick={onClose} className="text-sm px-5 py-2 rounded bg-gray-100 hover:bg-gray-200">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DownloadRequestsModal; 