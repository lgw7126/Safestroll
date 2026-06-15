import { useState, useEffect } from 'react'

const COUNTDOWN = 5

export default function SOSConfirmScreen({ contact, onConfirm, onCancel }) {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN)

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(id)
          onConfirm()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [onConfirm])

  const progress = ((COUNTDOWN - secondsLeft) / COUNTDOWN) * 100

  return (
    <div className="screen sos-confirm-screen">
      <div className="sos-confirm__top">
        <div className="sos-confirm__label">SOS</div>
        <div className="sos-confirm__title-kr">긴급 신호를 보냅니다</div>
        <div className="sos-confirm__title-en">Sending Emergency Alert</div>
        {contact?.name && (
          <div className="sos-confirm__contact">
            {contact.name}
            {contact.phone ? ` · ${contact.phone}` : ''}
          </div>
        )}
      </div>

      <div className="sos-countdown-block">
        <div className="sos-countdown-bar">
          <div className="sos-countdown-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="sos-countdown-num">{secondsLeft}</div>
        <div className="sos-countdown-label-kr">초 후 자동 발송</div>
        <div className="sos-countdown-label-en">seconds until sent</div>
      </div>

      <div className="spacer" />

      <button className="btn btn--sos-cancel" onClick={onCancel}>
        <span className="btn__kr">취소</span>
        <span className="btn__en">Cancel — I'm OK</span>
      </button>
    </div>
  )
}
