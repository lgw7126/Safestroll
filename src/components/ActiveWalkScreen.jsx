import { useState, useEffect, useRef } from 'react'

function getSecondsLeft(expectedReturnTime) {
  return Math.max(0, Math.floor((new Date(expectedReturnTime).getTime() - Date.now()) / 1000))
}

function formatCountdown(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

export default function ActiveWalkScreen({ walk, onCheckIn, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    getSecondsLeft(walk.expectedReturnTime)
  )
  const expiredRef = useRef(false)

  useEffect(() => {
    const id = setInterval(() => {
      const left = getSecondsLeft(walk.expectedReturnTime)
      setSecondsLeft(left)
      if (left === 0 && !expiredRef.current) {
        expiredRef.current = true
        onExpire()
      }
    }, 1000)
    return () => clearInterval(id)
  }, [walk.expectedReturnTime, onExpire])

  return (
    <div className="screen">
      <div className="status-indicator">
        <div className="status-dot" />
        <div>
          <div className="status-text-kr">지금 외출 중</div>
          <div className="status-text-en">Walk in Progress</div>
        </div>
      </div>

      <div className="card">
        <div className="info-row">
          <div className="info-row__label">
            <span className="info-row__label-kr">출발 시간</span>
            <span className="info-row__label-en">Departed</span>
          </div>
          <span className="info-row__value">{formatTime(walk.departureTime)}</span>
        </div>
        <div className="info-row">
          <div className="info-row__label">
            <span className="info-row__label-kr">귀가 예정</span>
            <span className="info-row__label-en">Expected Return</span>
          </div>
          <span className="info-row__value">{formatTime(walk.expectedReturnTime)}</span>
        </div>
      </div>

      <div className="countdown">
        <div className="countdown__label-kr">귀가까지 남은 시간</div>
        <div className="countdown__label-en">Time Until Return</div>
        <div className="countdown__time">{formatCountdown(secondsLeft)}</div>
      </div>

      <div className="spacer" />

      <button className="btn btn--safe" onClick={onCheckIn}>
        <span className="btn__kr">집에 돌아왔어요!</span>
        <span className="btn__en">I'm Home Safe!</span>
      </button>
    </div>
  )
}
