import { useState, useEffect, useCallback } from 'react'
import HomeScreen from './components/HomeScreen'
import SetupScreen from './components/SetupScreen'
import ActiveWalkScreen from './components/ActiveWalkScreen'
import AlertScreen from './components/AlertScreen'
import HistoryScreen from './components/HistoryScreen'
import ContactSetupScreen from './components/ContactSetupScreen'

const KEY_WALK = 'ss_walk'
const KEY_HISTORY = 'ss_history'
const KEY_CONTACT = 'ss_contact'

function loadJSON(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function saveJSON(key, value) {
  try {
    if (value == null) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  } catch {
    // Storage unavailable (private mode, quota exceeded)
  }
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [activeWalk, setActiveWalk] = useState(() => loadJSON(KEY_WALK, null))
  const [history, setHistory] = useState(() => loadJSON(KEY_HISTORY, []))
  const [contact, setContact] = useState(() => loadJSON(KEY_CONTACT, { name: '', phone: '' }))
  const [alertFired, setAlertFired] = useState(false)

  // On mount: restore screen state from persisted walk
  useEffect(() => {
    const walk = loadJSON(KEY_WALK, null)
    if (!walk) return
    const expired = Date.now() >= new Date(walk.expectedReturnTime).getTime()
    if (expired) {
      setAlertFired(true)
      setScreen('alert')
    } else {
      setScreen('active')
    }
  }, [])

  // Load contact reference inside triggerAlert
  const triggerAlert = useCallback((contactRef) => {
    setAlertFired(true)
    setScreen('alert')

    if ('Notification' in window && Notification.permission === 'granted') {
      const name = contactRef?.name || '가족'
      new Notification('안전산책 — 귀가 시간 초과', {
        body: `${name}께 알림: 어르신께서 예정 귀가 시간을 초과했습니다.`,
        requireInteraction: true,
        tag: 'safestroll-alert'
      })
    }
  }, [])

  // Poll every 10 s to detect walk expiry while app is open
  useEffect(() => {
    if (!activeWalk || alertFired) return
    const id = setInterval(() => {
      if (Date.now() >= new Date(activeWalk.expectedReturnTime).getTime()) {
        triggerAlert(contact)
      }
    }, 10_000)
    return () => clearInterval(id)
  }, [activeWalk, alertFired, contact, triggerAlert])

  const startWalk = (expectedReturnTime) => {
    const walk = {
      departureTime: new Date().toISOString(),
      expectedReturnTime: expectedReturnTime.toISOString()
    }
    setActiveWalk(walk)
    setAlertFired(false)
    saveJSON(KEY_WALK, walk)

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    setScreen('active')
  }

  const checkInSafe = () => {
    if (!activeWalk) return
    const now = new Date()
    const entry = {
      id: Date.now(),
      departureTime: activeWalk.departureTime,
      returnTime: now.toISOString(),
      expectedReturnTime: activeWalk.expectedReturnTime,
      onTime: !alertFired
    }
    const updated = [entry, ...history].slice(0, 50)
    setHistory(updated)
    saveJSON(KEY_HISTORY, updated)

    setActiveWalk(null)
    setAlertFired(false)
    saveJSON(KEY_WALK, null)
    setScreen('home')
  }

  const saveContact = (newContact) => {
    setContact(newContact)
    saveJSON(KEY_CONTACT, newContact)
    setScreen('home')
  }

  const clearHistory = () => {
    setHistory([])
    saveJSON(KEY_HISTORY, null)
  }

  const screenMap = {
    home: (
      <HomeScreen
        activeWalk={activeWalk}
        contact={contact}
        onGoOut={() => setScreen('setup')}
        onResumeWalk={() => setScreen(alertFired ? 'alert' : 'active')}
        onHistory={() => setScreen('history')}
        onContact={() => setScreen('contact-setup')}
      />
    ),
    setup: (
      <SetupScreen
        onStart={startWalk}
        onBack={() => setScreen('home')}
      />
    ),
    active: (
      <ActiveWalkScreen
        walk={activeWalk}
        onCheckIn={checkInSafe}
        onExpire={() => triggerAlert(contact)}
      />
    ),
    alert: (
      <AlertScreen
        walk={activeWalk}
        contact={contact}
        onCheckIn={checkInSafe}
      />
    ),
    history: (
      <HistoryScreen
        history={history}
        onBack={() => setScreen('home')}
        onClear={clearHistory}
      />
    ),
    'contact-setup': (
      <ContactSetupScreen
        contact={contact}
        onSave={saveContact}
        onBack={() => setScreen('home')}
      />
    )
  }

  return (
    <div className="app">
      {screenMap[screen]}
    </div>
  )
}
