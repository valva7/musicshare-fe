"use client"

import {useState, useRef, useEffect} from "react"
import { X, Upload, Music, AlertCircle, Loader } from "lucide-react"
import {fetchFileWithAuth, getCommonCode} from "@/pages/common/fetch";

export default function UploadModal({ isOpen, onClose }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false) // 업로드 중 상태 추가
  const [step, setStep] = useState(1) // 1: 파일 업로드, 2: 메타데이터 입력
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    theme: "",
    tags: "",
    description: "",
  })
  const [themeCode, setThemeCode] = useState([]);
  const [genreCode, setGenreCode] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    loadCode();
  }, [isOpen]);

  const loadCode = async () => {
    const theme = await getCommonCode(`/common/code/theme`);
    const genre = await getCommonCode(`/common/code/genre`);
    setThemeCode(theme.value);
    setGenreCode(genre.value);
  };

  if (!isOpen) return null

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("audio/")) {
        handleFile(file)
      } else {
        alert("오디오 파일만 업로드 가능합니다.")
      }
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith("audio/")) {
        handleFile(file)
      } else {
        alert("오디오 파일만 업로드 가능합니다.")
      }
    }
  }

  const handleFile = (file) => {
    setUploadedFile(file)
    // 파일명에서 제목과 아티스트 추출 시도 (예: "아티스트 - 제목.mp3")
    const fileName = file.name.replace(/\.[^/.]+$/, "") // 확장자 제거
    const parts = fileName.split(" - ")

    if (parts.length > 1) {
      setFormData({
        ...formData,
        title: parts[0],
      })
    } else {
      setFormData({
        ...formData,
        title: fileName,
      })
    }

    setStep(2) // 메타데이터 입력 단계로 이동
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 음악 정보 valid
    if (formData.title === ''){
      alert('제목을 입력하세요.');
      return;
    }
    if (formData.genre === ''){
      alert('장르를 입력하세요.');
      return;
    }
    if (formData.theme === ''){
      alert('테마를 선택하세요.');
      return;
    }
    if (formData.tags === ''){
      alert('태그를 입력하세요.');
      return;
    }
    if (formData.description === ''){
      alert('설명을 입력하세요.');
      return;
    }

    // 업로드 시작 시 로딩 상태 활성화
    setIsUploading(true)

    try {
      // 파일과 메타데이터를 함께 전송하기 위해 FormData 객체 사용
      const sendFormData = new FormData();
      sendFormData.append("file", uploadedFile);
      sendFormData.append("description", formData.description);
      sendFormData.append("genre", formData.genre);
      sendFormData.append("theme", formData.theme);
      sendFormData.append("tags", formData.tags);
      sendFormData.append("title", formData.title);

      const response = await fetchFileWithAuth("/music/auth/upload", {
        method: "POST",
        body: sendFormData,
      });

      // JSON 응답을 파싱
      const result = await response;

      if (result.code === 0) {
        alert('업로드 성공');
      } else {
        alert('업로드 실패');
      }
    } catch (error) {
      console.error("업로드 실패", error);
    } finally {
      // 업로드 완료 후 로딩 상태 비활성화
      setIsUploading(false)
    }

    // 업로드 완료 후 모달 닫기
    onClose()
    // 상태 초기화
    setUploadedFile(null)
    setFormData({
      title: "",
      genre: "",
      tags: "",
      theme: "",
      description: "",
    })
    setStep(1)
  }

  const handleCancel = () => {
    if (step === 2) {
      // 메타데이터 입력 단계에서 취소 시 파일 업로드 단계로 돌아감
      setStep(1)
      setUploadedFile(null)
    } else {
      // 파일 업로드 단계에서 취소 시 모달 닫기
      onClose()
    }
  }

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-[#1A1A1A] rounded-lg w-full max-w-2xl overflow-hidden shadow-xl transform transition-all">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">음악 파일 업로드</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" disabled={isUploading}>
              <X size={24} />
            </button>
          </div>

          {/* 컨텐츠 */}
          <div className="p-6">
            {step === 1 ? (
                /* 파일 업로드 단계 */
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center ${
                        dragActive ? "border-[#4AFF8C] bg-[#4AFF8C]/10" : "border-gray-700"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#4AFF8C]/20 flex items-center justify-center">
                      <Music size={32} className="text-[#4AFF8C]" />
                    </div>
                    <h3 className="text-lg font-medium text-white">
                      {dragActive ? "파일을 여기에 놓으세요" : "음악 파일을 드래그하거나 선택하세요"}
                    </h3>
                    <p className="text-gray-400 text-sm max-w-md">
                      MP3, WAV, FLAC 형식의 파일을 업로드할 수 있습니다. 최대 파일 크기는 50MB입니다.
                    </p>
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="px-4 py-2 bg-[#4AFF8C] text-black rounded-full font-medium hover:bg-[#3de07d] transition-colors cursor-pointer"
                    >
                      파일 선택
                    </button>
                    <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />
                  </div>
                </div>
            ) : (
                /* 메타데이터 입력 단계 */
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 rounded-lg bg-[#333] flex items-center justify-center">
                        <Music size={24} className="text-[#4AFF8C]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium truncate">{uploadedFile.name}</p>
                        <p className="text-gray-400 text-sm">{(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">제목 *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-[#333] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#4AFF8C]"
                            required
                            disabled={isUploading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-1">장르 *</label>
                      <select
                          name="genre"
                          value={formData.genre}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-[#333] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#4AFF8C]"
                          disabled={isUploading}
                      >
                        <option value="">장르 선택</option>
                        {genreCode.map((genre) => (
                            <option key={genre.code} value={genre.code}>{genre.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-1">테마 *</label>
                      <select
                          name="theme"
                          value={formData.theme}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-[#333] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#4AFF8C]"
                      >
                        <option value="">테마 선택</option>
                        {themeCode.map((theme) => (
                            <option key={theme.code} value={theme.code}>{theme.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-1">태그 (쉼표로 구분) *</label>
                      <input
                          type="text"
                          name="tags"
                          value={formData.tags}
                          onChange={handleInputChange}
                          placeholder="예: 피아노, 감성적, BPM(120-139)"
                          className="w-full px-4 py-2 bg-[#333] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#4AFF8C]"
                          disabled={isUploading}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-1">설명 *</label>
                      <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-2 bg-[#333] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#4AFF8C]"
                      />
                    </div>

                    <div className="flex items-start p-4 bg-[#2A2A2A] rounded-lg">
                      <AlertCircle size={20} className="text-[#4AFF8C] mt-0.5 mr-3 flex-shrink-0" />
                      <p className="text-sm text-gray-300">
                        업로드한 음악은 모두가 행복하게 들어줄 예정입니다 ^^{" "}
                        <a href="#" className="text-[#4AFF8C] hover:underline">
                          이용약관
                        </a>
                        은 별 거 없습니다. ㅎㅎ
                      </p>
                    </div>
                  </div>
                </form>
            )}
          </div>

          {/* 푸터 */}
          <div className="px-6 py-4 border-t border-gray-800 flex justify-end space-x-3">
            <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-gray-800 transition-colors"
                disabled={isUploading}
            >
              {step === 1 ? "취소" : "이전"}
            </button>
            {step === 2 && (
                <button
                    onClick={handleSubmit}
                    className={`px-4 py-2 bg-[#4AFF8C] text-black rounded-lg font-medium hover:bg-[#3de07d] transition-colors flex items-center ${
                        isUploading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={isUploading}
                >
                  {isUploading ? (
                      <>
                        <Loader size={18} className="mr-2 animate-spin" />
                        업로드 중...
                      </>
                  ) : (
                      <>
                        <Upload size={18} className="mr-2" />
                        업로드
                      </>
                  )}
                </button>
            )}
          </div>
        </div>
        {/* 업로드 중 오버레이 */}
        {isUploading && (
            <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
              <div className="bg-[#242424] p-8 rounded-xl shadow-xl flex flex-col items-center">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <Loader size={48} className="text-[#4AFF8C] animate-spin" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">파일 업로드 중...</h3>
                <p className="text-gray-400 text-center max-w-md">
                  음악 파일을 서버에 업로드하고 있습니다. 잠시만 기다려주세요.
                </p>
              </div>
            </div>
        )}
      </div>
  )
}

