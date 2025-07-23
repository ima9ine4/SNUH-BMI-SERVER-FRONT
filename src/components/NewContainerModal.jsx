import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import Select from "react-select"

const NewContainerModal = ({ onClose, onSubmit, volumeOptions }) => {
    const [form, setForm] = useState({
        hostname: "",
        serverName: "",
        cpu: null,
        memory: null,
        share_memory: 8,
        gpuType: "",
        addvolumes: [],
        imageType: "",
    });

    const [error, setError] = useState("");

    const volumeData = volumeOptions && typeof volumeOptions === 'object' && !Array.isArray(volumeOptions)
        ? volumeOptions
        : {};

    const volumeOptionsFormatted = Object.keys(volumeData).map((key) => {
        const volumeName = volumeData[key];
        const readwriteText = volumeName.readwrite === 1 ? "readwrite" : "readonly";
        // const usersText = volumeName.users;
        return {
            value: key,
            // label: `${key} (${readwriteText}/ ${usersText})`
            label: `${key} (${readwriteText})`
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if ((name === "cpu" || name === "share_memory" || name === "memory")) {
            setForm(prev => ({
                ...prev,
                [name]: Number(value)
            }));
        }else{
            setForm((prev) => ({ ...prev, [name]: value }));
        };
    };

    const handleSubmit = () => {
        // 필수값 검사
        if (form.hostname.trim() === "") {
            setError("서버를 선택해주세요.");
            return;
        }
        
        if (form.serverName.trim() === "") {
            setError("컨테이너 이름을 입력해주세요.");
            return;
        }
        if (!/^[a-zA-Z][a-zA-Z0-9-_]{0,13}$/.test(form.serverName)) {
            setError("컨테이너 이름은 영어로 시작하고 한글 없이 14자 미만이어야 합니다.");
            return;
        }

        if (form.cpu === null) {
            setError("CPU 값을 입력해주세요.");
            return;
        }
        if (form.memory === null) {
            setError("memory 값을 입력해주세요.");
            return;
        }
        if (isNaN(form.cpu) || form.cpu < 0) {
            setError("CPU 값은 0 이상의 숫자여야 합니다.");
            return;
        }
        if (form.cpu > 120) {
            setError("CPU는 최대 120 core까지 가능합니다.");
            return;
        }
        if (isNaN(form.memory) || form.memory < 0) {
            setError("메모리 값은 0 이상의 숫자여야 합니다.");
            return;
        }
        if (form.memory > 512) {
            setError("메모리 최대 512 GB까지 가능합니다.");
            return;
        }
        
        if (form.share_memory === null) {
            setError("공유 메모리 값을 입력해주세요.");
            return;
        }
        if (isNaN(form.share_memory) || form.share_memory < 0) {
            setError("공유 메모리는 0 이상의 숫자여야 합니다.");
            return;
        }
        if (form.share_memory > 512) {
            setError("공유 메모리는 최대 512GB까지 가능합니다.");
            return;
        }
        
        if (form.gpuType.trim() === "") {
            setError("GPU 슬롯을 입력해주세요.");
            return;
        }
        
        if (form.imageType.trim() === "") {
            setError("이미지를 선택해주세요.");
            return;
        }
        
        // 모든 조건 통과
        setError(""); // 에러 초기화

        const payload = {
            ...form,
            addvolumes: form.addvolumes.join(","),
            cpu: Number(form.cpu),
            share_memory: Number(form.share_memory),
            memory: Number(form.memory)
        };
        onSubmit(payload);
    };
  

    const Info = ({ message }) => (
        <span className="relative group ml-1">
            <FaInfoCircle className="inline text-gray-400" />
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-max max-w-xs p-1 px-2 bg-gray-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 delay-300">
                {message}
            </div>
        </span>
    );

    return (
        <div
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        onClick={onClose}
        >
            <div
                className="overflow-y-auto bg-white rounded-2xl px-10 py-8 max-h-[80vh] w-[600px] shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-blue-700 mb-6">새 도커 컨테이너 생성</h2>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        서버 선택 <span className="text-red-500">*</span>
                        <Info message="컨테이너를 생성할 GPU 서버를 선택하세요." />
                    </label>
                    <select name="hostname" value={form.hostname} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">선택하세요</option>
                        <option value="bmi-gpu147">bmi-gpu147</option>
                        <option value="bmi-gpu148">bmi-gpu148</option>
                        <option value="bmi-gpu127">bmi-gpu127</option>
                    </select>

                    <label className="block text-sm font-medium text-gray-700">
                        컨테이너 이름 <span className="text-red-500">*</span>
                        <Info message="본인 이름(영어)으로 시작하고, 한글 없이 14자 미만이어야 합니다. 서버나 계정이 다른 경우에도 이름은 중복될 수 없습니다." />
                    </label>
                    <input
                        name="serverName"
                        value={form.serverName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="예: hyejinlim_test"
                    />

                    <label className="block text-sm font-medium text-gray-700">
                        CPU (core) <span className="text-red-500">*</span>
                        <Info message="최대 120 core까지 입력할 수 있습니다." />
                    </label>
                    <input
                        type="number"
                        name="cpu"
                        value={form.cpu}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 32"
                        min="0"
                    />

                    <label className="block text-sm font-medium text-gray-700">
                        메모리 (GB) <span className="text-red-500">*</span>
                        <Info message="컨테이너 메모리 크기(GB)를 입력하세요. 최댓값은 입니다." />
                    </label>
                    <input
                        type="number"
                        name="memory"
                        value={form.memory}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 128"
                        min="0"
                    />

                    <label className="block text-sm font-medium text-gray-700">
                        공유 메모리 <span className="text-red-500">*</span>
                        <Info message="컨테이너 공유메모리(shm-size) 크기(GB)를 입력하세요. 기본값은 8, 최댓값은 512입니다." />
                    </label>
                    <input
                        type="number"
                        name="share_memory"
                        value={form.share_memory}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                    />

                    <label className="block text-sm font-medium text-gray-700 whitespace-pre-wrap">
                        GPU 슬롯 <span className="text-red-500">*</span>
                        <Info message={`사용할 GPU 슬롯을 입력하세요. \n 예: 모두 사용할 경우: all / 4번, 5번 슬롯을 사용할 경우: 4,5`} />
                    </label>
                    <input
                        name="gpuType"
                        value={form.gpuType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 4,5"
                    />

                    <label className="block text-sm font-medium text-gray-700">
                        공유 폴더
                        <Info message="컨테이너에 사용할 공유 폴더(도커 볼륨)을 선택하세요. 연결하지 않은 폴더는 컨테이너 생성 이후 연결할 수 없습니다." />
                    </label>
                    <Select
                        isMulti
                        name="volumes"
                        value={form.addvolumes.map((v) => ({ value: v, label: v }))}
                        options={volumeOptionsFormatted}
                        onChange={(selectedOptions) => {
                            const selected = selectedOptions.map((opt) => opt.value);
                            setForm((prev) => ({...prev, addvolumes: selected}));
                        }}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                    <label className="block text-sm font-medium text-gray-700">
                        이미지 타입 <span className="text-red-500">*</span>
                        <Info message="컨테이너에 사용할 이미지 종류를 선택하세요. CPU만 사용할 경우 CPU 이미지 사용을 권장합니다. Jupyter lab은 모든 브라우저에서 사용 가능하며, Vscode Server는 Firefox 브라우저에서 사용 가능합니다." />
                    </label>
                    <select
                        name="imageType"
                        value={form.imageType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">선택하세요</option>
                        <option value="vscode_cuda_250110">vscode_cuda_250110</option>
                        <option value="vscode_cpu_250110">vscode_cpu_250110</option>
                        <option value="jupyter_cuda_250110">jupyter_cuda_250110</option>
                        <option value="jupyter_cpu_250110">jupyter_cpu_250110</option>
                    </select>
                </div>

                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="text-sm px-5 py-2 rounded bg-gray-100 hover:bg-gray-200">
                        취소
                    </button>
                    <button onClick={handleSubmit} className="text-sm px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                        생성하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewContainerModal;
