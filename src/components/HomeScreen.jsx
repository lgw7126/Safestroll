export default function HomeScreen({
  activeWalk, contact, onGoOut, onResumeWalk,
  onHistory, onContact, onPlaces, onSOS
}) {
  return (
    <div className="screen">
      <header className="app-header">
        <h1>
          <span className="app-title__kr">안전산책</span>
          <span className="app-title__en">SafeStroll</span>
        </h1>
      </header>

      <div className="spacer" style={{ maxHeight: 16 }} />

      {/* Main action */}
      {activeWalk ? (
        <button className="btn btn--primary" onClick={onResumeWalk}>
          <span className="btn__kr">외출 중 — 화면 보기</span>
          <span className="btn__en">Walk in Progress — View</span>
        </button>
      ) : (
        <button className="btn btn--primary" onClick={onGoOut}>
          <span className="btn__kr">외출하기</span>
          <span className="btn__en">Going Out</span>
        </button>
      )}

      {/* Secondary actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button className="btn btn--secondary" onClick={onPlaces}>
          <span className="btn__kr">자주 가는 곳 · 위치 공유</span>
          <span className="btn__en">My Places & Location</span>
        </button>

        <button className="btn btn--secondary" onClick={onHistory}>
          <span className="btn__kr">외출 기록 보기</span>
          <span className="btn__en">Walk History</span>
        </button>

        <button className="btn btn--ghost" onClick={onContact}>
          <span className="btn__kr">
            {contact.name ? `비상연락처: ${contact.name}` : '비상연락처 설정'}
          </span>
          <span className="btn__en">
            {contact.name ? `Contact: ${contact.name}` : 'Set Emergency Contact'}
          </span>
        </button>
      </div>

      <div className="spacer" />

      {/* SOS — always at the bottom */}
      <button className="btn btn--sos" onClick={onSOS}>
        <span className="btn__kr">긴급 SOS</span>
        <span className="btn__en">Emergency Alert</span>
      </button>

      <p className="notice" style={{ marginTop: 8 }}>
        <strong>제가 직접 설정해요:</strong> 귀가 시간을 내가 정하고, 시간 안에 체크인하면 알림이 가지 않아요.<br />
        <span style={{ fontSize: '0.8rem' }}>I set my own return time. Alerts only if I miss check-in.</span>
      </p>
    </div>
  )
}
