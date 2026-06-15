import { useState, useEffect } from 'react'

export default function SOSActiveScreen({ contact, onDismiss }) {
  const [coords, setCoords] = useState(null)
  const [locationStatus, setLocationStatus] = useState('loading') // loading | ok | error
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('error')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocationStatus('ok')
      },
      () => setLocationStatus('error'),
      { enableHighAccuracy: true, timeout: 12000 }
    )
  }, [])

  const mapsUrl = coords
    ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
    : null

  const sosText = coords
    ? `[안전산책 SOS] 도움이 필요합니다!\n현재 위치: ${mapsUrl}`
    : '[안전산책 SOS] 도움이 필요합니다! 위치 확인 불가'

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: '안전산책 SOS', text: sosText, url: mapsUrl || '' })
        return
      } catch { /* fallthrough to clipboard */ }
    }
    try {
      await navigator.clipboard.writeText(sosText)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch { /* unable to copy */ }
  }

  return (
    <div className="screen sos-active-screen">
      <div className="sos-active-banner">
        <div className="sos-active-banner__kr">SOS 발송됨</div>
        <div className="sos-active-banner__en">Emergency Alert Active</div>
      </div>

      <div className="card">
        {locationStatus === 'loading' && (
          <div className="location-status">위치 확인 중... / Getting location...</div>
        )}
        {locationStatus === 'ok' && coords && (
          <>
            <div className="info-row">
              <div className="info-row__label">
                <span className="info-row__label-kr">현재 위치</span>
                <span className="info-row__label-en">Current Location</span>
              </div>
              <a className="location-map-link" href={mapsUrl} target="_blank" rel="noreferrer">
                지도 보기
              </a>
            </div>
            <div className="location-coords">
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </div>
          </>
        )}
        {locationStatus === 'error' && (
          <div className="location-status location-status--error">
            위치를 가져올 수 없습니다. 직접 주소를 알려주세요.<br />
            <span style={{ fontSize: '0.8rem' }}>Location unavailable — share address manually.</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {contact?.phone && (
          <a className="btn btn--sos-call" href={`tel:${contact.phone}`}>
            <span className="btn__kr">전화하기 — {contact.name || '비상연락처'}</span>
            <span className="btn__en">Call Emergency Contact</span>
          </a>
        )}

        <a className="btn btn--119" href="tel:119">
          <span className="btn__kr">119 신고</span>
          <span className="btn__en">Call 119 (Emergency Services)</span>
        </a>
      </div>

      <button className="btn btn--secondary" onClick={handleShare}>
        <span className="btn__kr">{copied ? '복사됨!' : '위치 문자로 보내기'}</span>
        <span className="btn__en">{copied ? 'Copied!' : 'Share Location via Text'}</span>
      </button>

      <div className="spacer" />

      <button className="btn btn--ghost" onClick={onDismiss}>
        <span className="btn__kr">종료 (안전함)</span>
        <span className="btn__en">Dismiss — I'm Safe Now</span>
      </button>
    </div>
  )
}
