"use client"

import { useState, useRef } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, Share2, Bookmark, MessageSquare, X } from "lucide-react"
import Image from "next/image"

export default function MusicPlayer() {
  // 상태 관리 부분 수정
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackId, setCurrentTrackId] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null) // 현재 재생 중인 트랙 정보
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playerBarVisible, setPlayerBarVisible] = useState(false) // 플레이어 바 표시 여부
  const audioRef = useRef(null)
  const progressRef = useRef(null)

  const tracks = [
    {
      id: 1,
      title: "SoundHelix Song 7",
      artist: "SoundHelix Song 7",
      duration: "07:00",
      tags: ["일렉트로닉"],
      image: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    },
    {
      id: 2,
      title: "SoundHelix Song 8",
      artist: "SoundHelix Song 8",
      duration: "05:25",
      tags: ["일렉트로닉"],
      image: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    }
  ]

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // 트랙 재생 함수 수정
  const handlePlayPause = (trackId) => {
    const selectedTrack = tracks.find((track) => track.id === trackId)

    if (currentTrackId === trackId && isPlaying) {
      // 현재 재생 중인 트랙을 다시 클릭하면 일시정지
      audioRef.current.pause()
      setIsPlaying(false)
      // 일시정지 상태에서도 현재 시간 유지
    } else {
      // 다른 트랙을 클릭하거나 일시정지된 트랙을 다시 재생
      if (currentTrackId !== trackId) {
        // 트랙이 변경되면 오디오 소스 변경
        audioRef.current.src = selectedTrack.audioSrc
        audioRef.current.load()
        setCurrentTime(0) // 새 트랙은 처음부터 시작
      }

      audioRef.current.play()
      setIsPlaying(true)
      setCurrentTrackId(trackId)
      setCurrentTrack(selectedTrack) // 현재 트랙 정보 설정
      setPlayerBarVisible(true) // 플레이어 바 표시
    }
  }

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime)
  }

  const handleProgressClick = (e, isMainPlayer = true) => {
    if (!currentTrackId) return // 선택된 트랙이 없으면 무시

    const progressBar = isMainPlayer ? progressRef.current : e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickPosition = (e.clientX - rect.left) / rect.width
    const newTime = clickPosition * audioRef.current.duration

    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // 트랙별 진행 상태 계산 - 수정됨
  const getTrackProgress = (trackId) => {
    if (currentTrackId !== trackId) return 0
    // 재생 중이 아니더라도 현재 트랙의 진행 상태 반환
    return (currentTime / duration) * 100
  }

  return (
      <div className="min-h-screen bg-[#1A1A1A] text-white p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-1 w-12 bg-[#4AFF8C]"></div>
              <h1 className="text-lg">다운로드 순으로 자동 집계되는</h1>
            </div>
            <h2 className="text-6xl font-bold mb-8">
              <span className="text-[#4AFF8C]">HOT</span> 10
            </h2>
            <div className="flex gap-4">
              <span className="px-4 py-2 rounded-full border border-[#4AFF8C] text-[#4AFF8C]">3월 2주차</span>
              <span className="px-4 py-2">장르별</span>
              <span className="px-4 py-2">월간 BGM</span>
            </div>
          </div>

          {/* Track List */}
          <div className="space-y-4">
            {tracks.map((track, index) => (
                <div key={track.id} className="group bg-[#242424] hover:bg-[#2A2A2A] rounded-lg p-4 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-[#4AFF8C] text-2xl font-medium w-8">{index + 1}</span>
                    <Image
                        src={track.image || "/placeholder.svg"}
                        alt={track.title}
                        width={48}
                        height={48}
                        className="rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <button
                            className="w-10 h-10 rounded-full bg-[#4AFF8C] flex items-center justify-center text-black"
                            onClick={() => handlePlayPause(track.id)}
                        >
                          {isPlaying && currentTrackId === track.id ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                        <div>
                          <h3 className="font-medium">{track.title}</h3>
                          <p className="text-sm text-gray-400">{track.artist}</p>
                        </div>
                      </div>

                      {/* 트랙별 재생 바*/}
                      <div className="mt-4 mb-2">
                        <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {currentTrackId === track.id ? formatTime(currentTime) : "00:00"}
                      </span>
                          <div
                              className="flex-1 h-1 bg-[#333] rounded-full cursor-pointer"
                              onClick={(e) => currentTrackId === track.id && handleProgressClick(e, false)}
                          >
                            <div
                                className="h-full bg-[#4AFF8C] rounded-full"
                                style={{ width: `${getTrackProgress(track.id)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400">{track.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {track.tags.map((tag, i) => (
                            <span key={i} className="text-xs text-gray-400">
                        #{tag}
                      </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:text-[#4AFF8C]">
                        <Volume2 size={20} />
                      </button>
                      <button className="p-2 hover:text-[#4AFF8C]">
                        <Bookmark size={20} />
                      </button>
                      <button className="p-2 hover:text-[#4AFF8C]">
                        <Download size={20} />
                      </button>
                      <button className="p-2 hover:text-[#4AFF8C]">
                        <MessageSquare size={20} />
                      </button>
                    </div>
                    <span className="text-sm text-gray-400 w-16 text-right">{track.duration}</span>
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* Fixed Player Bar */}
        {playerBarVisible && (
            <div className="fixed bottom-0 left-0 right-0 bg-[#242424] border-t border-[#333] p-4">
              <div className="max-w-6xl mx-auto flex items-center gap-4">
                <div className="flex items-center gap-4">
                  <button className="p-2 hover:text-[#4AFF8C]">
                    <SkipBack size={20} />
                  </button>
                  <button
                      className="w-10 h-10 rounded-full bg-[#4AFF8C] flex items-center justify-center text-black"
                      onClick={() => currentTrackId && handlePlayPause(currentTrackId)}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button className="p-2 hover:text-[#4AFF8C]">
                    <SkipForward size={20} />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">{formatTime(currentTime)}</span>
                    <div
                        ref={progressRef}
                        className="flex-1 h-1 bg-[#333] rounded-full cursor-pointer"
                        onClick={(e) => handleProgressClick(e)}
                    >
                      <div
                          className="h-full bg-[#4AFF8C] rounded-full"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{formatTime(duration)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{currentTrack?.title || "선택된 트랙 없음"}</h4>
                    <span className="text-sm text-gray-400">by {currentTrack?.artist || ""}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button className="p-2 hover:text-[#4AFF8C]">
                    <Volume2 size={20} />
                  </button>
                  <button className="p-2 hover:text-[#4AFF8C]">
                    <Bookmark size={20} />
                  </button>
                  <button className="p-2 hover:text-[#4AFF8C]">
                    <Share2 size={20} />
                  </button>
                  <button className="p-2 hover:text-[#4AFF8C]" onClick={() => setPlayerBarVisible(false)}>
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* 오디오 요소 */}
        <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => setDuration(audioRef.current.duration)}
            onEnded={() => setIsPlaying(false)}
        >
          <source src="" type="audio/mpeg" />
          브라우저가 오디오 태그를 지원하지 않습니다.
        </audio>
      </div>
  )
}

