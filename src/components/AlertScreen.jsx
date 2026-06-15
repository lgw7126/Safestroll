function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString('ko-KR', {
    hour: '2-digit', minute: '2-digit', hour12: false
  })
}

export default function AlertScreen({ walk, contact, onCheckIn, onSOS }) {
  const hasContact = contact?.name || contact?.phone

  return (
    <div className="screen screen--alert">
      <div className="alert-banner">
        <div className="alert-banner__kr">귀가 예정 시간이 지났습니다</div>
        <div className="alert-banner__en">Expected return time has passed</div>
      </div>

      {walk && (
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
              <span className="info-row__label-en">Expected</span>
            </div>
            <span className="info-row__value">{formatTime(walk.expectedReturnTime)}</span>
          </div>
        </div>
      )}

      {hasContact ? (
        <div className="contact-card">
          <div className="contact-card__title-kr">비상연락처에 알림을 보냈습니다</div>
          <div className="contact-card__title-en">Alert sent to emergency contact</div>
          {contact.name && <div className="contact-card__name">{contact.name}</div>}
          {contact.phone && <div className="contact-card__phone">{contact.phone}</div>}
          {contact.phone && (
            <a className="call-link" href={`tel:${contact.phone}`}>전화하기 · Call</a>
          )}
        </div>
      ) : (
        <div className="notice">
          <strong>비상연락처가 설정되지 않았습니다.</strong><br />
          홈 화면에서 비상연락처를 설정하면 자동으로 알림이 갑니다.<br />
          <span style={{ fontSize: '0.8rem' }}>No emergency contact set.</span>
        </div>
      )}

      <div className="spacer" />

      <button className="btn btn--sos btn--sos-walk" onClick={onSOS}>
        <span className="btn__kr">긴급 SOS 발송</span>
        <span className="btn__en">Send Emergency SOS</span>
      </button>

      <button className="btn btn--alert" onClick={onCheckIn}>
        <span className="btn__kr">집에 돌아왔어요!</span>
        <span className="btn__en">I'm Home Safe!</span>
      </button>
    </div>
  )
}
