// pages/test.js

import { useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'

const Test = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgb(200, 0, 200)',
      progressColor: 'rgb(100, 0, 100)',
      minPxPerSec: 1,
      url: 'https://musicfile-bucket.s3.ap-southeast-2.amazonaws.com/music/1c0c093d-597f-42c3-be8b-f6cfe8d60444_SoundHelix-Song-1.mp3',
    })

    // 클릭 시 음원을 재생
    wavesurfer.on('click', () => {
      wavesurfer.play()
    })

    // 클린업 (컴포넌트 언마운트 시)
    return () => {
      wavesurfer.destroy()
    }
  }, [])

  return (
      <div className="flex flex-col items-center p-4">
        {/* 파형 컨테이너 */}
        <div ref={containerRef} className="w-full h-40 mb-4" />
      </div>
  )
}

export default Test
