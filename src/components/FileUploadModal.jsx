import React, {useCallback, useState} from "react";
import { useDropzone } from "react-dropzone"

const FileUploadModal = ({ onClose, onSubmit, user }) => {
    // const [ error, setError ] = useState("");
    const [ files, setFiles ] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        console.log("받은 파일들: ", acceptedFiles);
        setFiles((prev) => {
            const newFileNames = new Set(prev.map((f) => f.name));
            const uniqueFiles = acceptedFiles.filter((f) => !newFileNames.has(f.name));
            return [...prev, ...uniqueFiles];
        });
    }, []);

    

    const removeFile = (fileName) => {
        setFiles((prev) => prev.filter((f)=> f.name !== fileName));
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

    const handleSubmit = () => {
        if(files.length === 0) return;
        onSubmit(files);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div
                className="overflow-y-auto bg-white rounded-2xl px-10 py-8 max-h-[80vh] w-[600px] shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-blue-700 mb-6">파일 업로드</h2>
                <div class="mb-4">
                    <div 
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${isDragActive
                            ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
                        }`}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p className="text-blue-500">여기에 파일을 놓으세요</p>
                        ) : (
                            <p className="text-gray-600">
                                업로드할 파일을 영역 안에 드래그하거나, <br/>영역을 클릭하여 직접 파일을 첨부해주세요.{" "}
                            </p>
                        )}
                    </div>
                    
                    {files.length > 0 && (
                        <div className="mt-8">
                            <h3 className="font-medium mb-2">업로드 된 파일</h3>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                {files.map((file,idx) => (
                                    <li key={idx}
                                        className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm transition"
                                    >
                                        <span className="font-medium text-gray-800 truncate max-w-xs">
                                            {file.name}
                                        </span>
                                        <button
                                            onClick={() => removeFile(file.name)}
                                            className="ml-4 text-red-500 hover:text-red-600 text-sm font-medium transition"
                                        >
                                            x
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="text-sm px-5 py-2 rounded bg-gray-100 hover:bg-gray-200">
                        취소
                    </button>
                    <button onClick={handleSubmit} className="text-sm px-5 py-2 text-white rounded bg-blue-600 hover:bg-blue-700">
                        업로드하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileUploadModal;
