function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  })
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

function formatDuration(departureIso, returnIso) {
  const minutes = Math.round(
    (new Date(returnIso).getTime() - new Date(departureIso).getTime()) / 60_000
  )
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}분 / ${m}min`
  if (m === 0) return `${h}시간 / ${h}h`
  return `${h}시간 ${m}분 / ${h}h ${m}m`
}

export default function HistoryScreen({ history, onBack, onClear }) {
  return (
    <div className="screen">
      <header className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="뒤로">&#8592;</button>
        <div className="screen-heading">
          <span className="screen-heading__kr">외출 기록</span>
          <span className="screen-heading__en">Walk History</span>
        </div>
      </header>

      {history.length === 0 ? (
        <div className="history-empty">
          <div className="history-empty__kr">외출 기록이 없습니다</div>
          <div className="history-empty__en">No walk history yet</div>
        </div>
      ) : (
        <div className="scroll-list">
          {history.map((entry) => (
            <div
              key={entry.id}
              className={`history-entry${entry.onTime ? '' : ' history-entry--late'}`}
            >
              <div className="history-entry__date">{formatDate(entry.departureTime)}</div>
              <div className="history-entry__times">
                <div className="history-entry__time-block">
                  <span className="history-entry__time-label">출발 / Depart</span>
                  <span className="history-entry__time-value">{formatTime(entry.departureTime)}</span>
                </div>
                <div className="history-entry__time-block">
                  <span className="history-entry__time-label">귀가 / Return</span>
                  <span className="history-entry__time-value">{formatTime(entry.returnTime)}</span>
                </div>
                <div className="history-entry__time-block">
                  <span className="history-entry__time-label">외출 시간 / Duration</span>
                  <span className="history-entry__time-value">
                    {formatDuration(entry.departureTime, entry.returnTime)}
                  </span>
                </div>
              </div>
              <span className={`history-entry__badge${entry.onTime ? '' : ' history-entry__badge--late'}`}>
                {entry.onTime ? '안전 귀가 / Safe Return' : '늦은 귀가 / Late Return'}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="spacer" />

      {history.length > 0 && (
        <button
          className="btn btn--ghost"
          onClick={() => {
            if (window.confirm('기록을 모두 삭제할까요?\nClear all history?')) {
              onClear()
            }
          }}
        >
          <span className="btn__kr">기록 모두 삭제</span>
          <span className="btn__en">Clear All History</span>
        </button>
      )}
    </div>
  )
}
