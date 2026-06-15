import { useState } from 'react'

function navigateTo(place) {
  const query = place.lat && place.lng
    ? `${place.lat},${place.lng}`
    : encodeURIComponent(place.name)
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
}

export default function PlacesScreen({ places, onSave, onBack }) {
  const [newName, setNewName] = useState('')
  const [locationStatus, setLocationStatus] = useState('idle') // idle | loading | ok | error
  const [sharedUrl, setSharedUrl] = useState(null)
  const [copied, setCopied] = useState(false)

  const addPlace = () => {
    const name = newName.trim()
    if (!name || places.length >= 5) return
    onSave([...places, { id: Date.now(), name, lat: null, lng: null }])
    setNewName('')
  }

  const removePlace = (id) => onSave(places.filter(p => p.id !== id))

  const shareLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('error')
      return
    }
    setLocationStatus('loading')
    setSharedUrl(null)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        const url = `https://www.google.com/maps?q=${lat},${lng}`
        const text = `지금 여기 있어요: ${url}`
        setSharedUrl(url)
        setLocationStatus('ok')
        if (navigator.share) {
          try {
            await navigator.share({ title: '내 현재 위치', text, url })
            return
          } catch { /* fallthrough */ }
        }
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 3000)
        } catch { /* unable to copy */ }
      },
      () => setLocationStatus('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className="screen">
      <header className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="뒤로">&#8592;</button>
        <div className="screen-heading">
          <span className="screen-heading__kr">자주 가는 곳</span>
          <span className="screen-heading__en">My Places & Location</span>
        </div>
      </header>

      {/* Share current location */}
      <button
        className="btn btn--primary"
        onClick={shareLocation}
        disabled={locationStatus === 'loading'}
        style={{ opacity: locationStatus === 'loading' ? 0.7 : 1 }}
      >
        <span className="btn__kr">
          {locationStatus === 'loading' ? '위치 확인 중...' : '나 지금 어디야? — 위치 공유'}
        </span>
        <span className="btn__en">
          {locationStatus === 'loading' ? 'Getting location...' : 'Share My Current Location'}
        </span>
      </button>

      {locationStatus === 'ok' && sharedUrl && (
        <div className="notice">
          <strong>{copied ? '클립보드에 복사됐습니다!' : '위치가 공유됐습니다.'}</strong><br />
          <a href={sharedUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--teal)', fontWeight: 700 }}>
            지도에서 내 위치 보기
          </a>
        </div>
      )}
      {locationStatus === 'error' && (
        <div className="notice" style={{ borderLeft: '3px solid var(--alert)' }}>
          위치를 가져올 수 없습니다. 브라우저 위치 권한을 허용해주세요.<br />
          <span style={{ fontSize: '0.8rem' }}>Allow location permission in browser settings.</span>
        </div>
      )}

      {/* Saved places */}
      <div className="section-title" style={{ marginTop: 4 }}>저장된 장소 / Saved Places</div>

      {places.length === 0 ? (
        <div className="history-empty">
          <div className="history-empty__kr">저장된 장소가 없습니다</div>
          <div className="history-empty__en">아래에서 장소를 추가하세요 · Add places below</div>
        </div>
      ) : (
        <div className="scroll-list">
          {places.map(place => (
            <div key={place.id} className="place-item">
              <span className="place-item__name">{place.name}</span>
              <div className="place-item__actions">
                <button className="place-btn place-btn--nav" onClick={() => navigateTo(place)}>
                  <span style={{ fontSize: '1rem', fontWeight: 700 }}>길 안내</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>Navigate</span>
                </button>
                <button className="place-btn place-btn--delete" onClick={() => removePlace(place.id)} aria-label="삭제">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {places.length < 5 ? (
        <div className="form-group">
          <label className="form-label" htmlFor="place-input">
            <span className="form-label__kr">장소 추가 (최대 5개)</span>
            <span className="form-label__en">Add a place (max 5)</span>
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              id="place-input"
              type="text"
              className="form-input"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addPlace()}
              placeholder="예: 강남 성모병원"
              style={{ flex: 1 }}
            />
            <button
              className="btn btn--primary"
              onClick={addPlace}
              disabled={!newName.trim()}
              style={{ width: 'auto', minWidth: 72, padding: '0 16px', minHeight: 60, opacity: newName.trim() ? 1 : 0.4 }}
            >
              <span style={{ fontSize: '1rem', fontWeight: 700 }}>저장</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="notice">
          최대 5개까지 저장할 수 있습니다. 삭제 후 추가하세요.<br />
          <span style={{ fontSize: '0.8rem' }}>Max 5 places. Delete one to add more.</span>
        </div>
      )}

      <div className="spacer" />
    </div>
  )
}
