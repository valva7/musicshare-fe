import { useEffect, useRef, useState } from "react";
import WaveSurfer from 'wavesurfer.js'
import { Pause, Play } from "lucide-react";

const AudioWaveformC = ({ audioUrl }) => {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null); // wavesurfer 인스턴스를 useRef로 정의
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgb(103,248,115)',
      progressColor: 'rgb(64,196,196)',
      minPxPerSec: 1,
      url: audioUrl, // audioUrl을 props로 받습니다.
    });

    wavesurferRef.current = wavesurfer; // wavesurfer를 useRef에 저장

    // 클릭 시 음원을 재생
    wavesurfer.on('click', () => {
      //wavesurfer.play()
    });

    // 클린업 (컴포넌트 언마운트 시)
    return () => {
      wavesurfer.destroy()
    }
  }, [audioUrl]); // audioUrl이 변경될 때마다 초기화

  const handlePlayPause = () => {
    const wavesurfer = wavesurferRef.current; // useRef로 저장된 wavesurfer 참조

    if (wavesurfer) {
      wavesurfer.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  return (
      <div className="flex items-center space-x-6">
        <button
            className="w-12 h-12 rounded-full bg-[#4AFF8C] flex items-center justify-center text-black shadow-lg hover:bg-[#3fdf75] transition"
            onClick={handlePlayPause}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        {/* WaveSurfer 파형 컨테이너 */}
        <div ref={containerRef} className="w-full rounded-lg shadow-md" />
      </div>
  );
};

export default AudioWaveformC;
