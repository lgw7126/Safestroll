import { useState } from 'react'

const QUICK_OPTIONS = [
  { label: '30분', sub: '30 min', minutes: 30 },
  { label: '1시간', sub: '1 hour', minutes: 60 },
  { label: '1시간 30분', sub: '1.5 hours', minutes: 90 },
  { label: '2시간', sub: '2 hours', minutes: 120 }
]

function addMinutes(minutes) {
  return new Date(Date.now() + minutes * 60_000)
}

function formatTime12(date) {
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function parseCustomTime(timeStr) {
  if (!timeStr) return null
  const [h, m] = timeStr.split(':').map(Number)
  const d = new Date()
  d.setSeconds(0, 0)
  d.setHours(h, m)
  if (d <= new Date()) d.setDate(d.getDate() + 1)
  return d
}

export default function SetupScreen({ onStart, onBack }) {
  const [selectedMinutes, setSelectedMinutes] = useState(null)
  const [customTime, setCustomTime] = useState('')
  const [useCustom, setUseCustom] = useState(false)

  const expectedReturn = useCustom
    ? parseCustomTime(customTime)
    : selectedMinutes !== null
      ? addMinutes(selectedMinutes)
      : null

  const canStart = expectedReturn !== null

  const handleStart = () => {
    if (!canStart) return
    onStart(expectedReturn)
  }

  const handleQuickSelect = (minutes) => {
    setSelectedMinutes(minutes)
    setUseCustom(false)
    setCustomTime('')
  }

  const handleCustomChange = (e) => {
    setCustomTime(e.target.value)
    setUseCustom(true)
    setSelectedMinutes(null)
  }

  return (
    <div className="screen">
      <header className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="뒤로">&#8592;</button>
        <div className="screen-heading">
          <span className="screen-heading__kr">귀가 예정 시간 설정</span>
          <span className="screen-heading__en">Set Expected Return Time</span>
        </div>
      </header>

      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        몇 시간 후에 돌아오실 예정인가요?<br />
        <span style={{ fontSize: '0.8rem' }}>How long will you be out?</span>
      </p>

      <div className="option-grid">
        {QUICK_OPTIONS.map(({ label, sub, minutes }) => (
          <button
            key={minutes}
            className={`btn btn--option${selectedMinutes === minutes && !useCustom ? ' selected' : ''}`}
            onClick={() => handleQuickSelect(minutes)}
          >
            <span className="btn__kr">{label}</span>
            <span className="btn__en">{sub}</span>
          </button>
        ))}
      </div>

      <div className="divider">또는 / or</div>

      <div className="form-group">
        <label className="form-label" htmlFor="custom-time">
          <span className="form-label__kr">직접 시간 입력</span>
          <span className="form-label__en">Custom return time</span>
        </label>
        <input
          id="custom-time"
          type="time"
          className="form-input form-input--time"
          value={customTime}
          onChange={handleCustomChange}
        />
      </div>

      {canStart && (
        <div className="return-preview">
          <div className="return-preview__label-kr">귀가 예정 시간</div>
          <div className="return-preview__label-en">Expected return</div>
          <div className="return-preview__time">{formatTime12(expectedReturn)}</div>
          <div className="return-preview__date">
            {expectedReturn.toLocaleDateString('ko-KR', {
              month: 'long',
              day: 'numeric',
              weekday: 'short'
            })}
          </div>
        </div>
      )}

      <div className="spacer" />

      <button
        className="btn btn--primary"
        onClick={handleStart}
        disabled={!canStart}
        style={{ opacity: canStart ? 1 : 0.45 }}
      >
        <span className="btn__kr">출발!</span>
        <span className="btn__en">Let's Go!</span>
      </button>
    </div>
  )
}
