import { useState } from 'react'

export default function ContactSetupScreen({ contact, onSave, onBack }) {
  const [name, setName] = useState(contact?.name || '')
  const [phone, setPhone] = useState(contact?.phone || '')

  const handleSave = () => {
    onSave({ name: name.trim(), phone: phone.trim() })
  }

  return (
    <div className="screen">
      <header className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="뒤로">&#8592;</button>
        <div className="screen-heading">
          <span className="screen-heading__kr">비상연락처 설정</span>
          <span className="screen-heading__en">Emergency Contact</span>
        </div>
      </header>

      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        귀가 시간을 넘기면 이 분께 알림이 갑니다.<br />
        <span style={{ fontSize: '0.8rem' }}>
          This person will be notified if you miss your check-in.
        </span>
      </p>

      <div className="form-group">
        <label className="form-label" htmlFor="contact-name">
          <span className="form-label__kr">이름</span>
          <span className="form-label__en">Name</span>
        </label>
        <input
          id="contact-name"
          type="text"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 김철수"
          autoComplete="name"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="contact-phone">
          <span className="form-label__kr">전화번호</span>
          <span className="form-label__en">Phone Number</span>
        </label>
        <input
          id="contact-phone"
          type="tel"
          className="form-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="예: 010-1234-5678"
          autoComplete="tel"
          inputMode="tel"
        />
      </div>

      <div className="notice">
        <strong>알림 방식:</strong> 현재는 브라우저 알림과 화면 내 알림을 사용합니다.
        SMS 문자 발송은 서버 연동 시 추가됩니다.<br />
        <span style={{ fontSize: '0.8rem' }}>
          Currently uses browser notifications. SMS requires server integration (e.g. Twilio).
        </span>
      </div>

      <div className="spacer" />

      <button className="btn btn--primary" onClick={handleSave}>
        <span className="btn__kr">저장</span>
        <span className="btn__en">Save Contact</span>
      </button>

      {(contact?.name || contact?.phone) && (
        <button
          className="btn btn--ghost"
          onClick={() => onSave({ name: '', phone: '' })}
        >
          <span className="btn__kr">연락처 삭제</span>
          <span className="btn__en">Remove Contact</span>
        </button>
      )}
    </div>
  )
}
