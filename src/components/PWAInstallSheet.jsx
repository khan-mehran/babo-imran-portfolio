import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLang } from '../context/LangContext'

/* ── device detection (run once) ───────────────────────── */
const ua           = navigator.userAgent
const isIos        = /iphone|ipad|ipod/i.test(ua)
const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true

/* ── theme ──────────────────────────────────────────────── */
const C = {
  green:      '#1A3A2A',
  greenLight: '#254d38',
  gold:       '#C8A85B',
  goldDark:   '#A8882B',
  walnut:     '#5C3D1E',
  parchment:  '#F8F4EE',
  sand:       '#E8DCC8',
}

/* ── reusable inline style blocks ───────────────────────── */
const S = {
  backdrop: (shown) => ({
    position:       'fixed',
    inset:          0,
    background:     'rgba(0,0,0,0.55)',
    zIndex:         9998,
    opacity:        shown ? 1 : 0,
    pointerEvents:  shown ? 'auto' : 'none',
    transition:     'opacity 0.3s ease',
  }),
  sheet: (shown) => ({
    position:     'fixed',
    bottom:       0,
    left:         '50%',
    transform:    shown ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(110%)',
    transition:   'transform 0.38s cubic-bezier(0.32,0.72,0,1)',
    width:        '100%',
    maxWidth:     480,
    zIndex:       9999,
    background:   '#fff',
    borderRadius: '22px 22px 0 0',
    boxShadow:    '0 -8px 48px rgba(0,0,0,0.22)',
    overflow:     'hidden',
    fontFamily:   "'Inter', sans-serif",
  }),
  handle: {
    width: 40, height: 4, background: '#e0e0e0',
    borderRadius: 2, margin: '14px auto 0',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '14px 20px 12px',
  },
  appIcon: {
    width: 58, height: 58, borderRadius: 14,
    background: C.green,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, gap: 2,
    boxShadow: '0 4px 14px rgba(26,58,42,0.3)',
  },
  appIconI:    { fontSize: '1.5rem', color: C.gold, lineHeight: 1 },
  appIconSpan: { fontSize: '0.55rem', fontWeight: 700, color: C.gold, letterSpacing: '0.06em' },
  metaWrap:    { flex: 1, minWidth: 0 },
  metaH3: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.05rem', color: C.green,
    margin: 0, whiteSpace: 'nowrap',
    overflow: 'hidden', textOverflow: 'ellipsis',
  },
  metaP: { fontSize: '0.78rem', color: '#999', margin: 0 },
  closeBtn: {
    width: 30, height: 30, borderRadius: '50%',
    background: '#f2f2f2', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', color: '#888', flexShrink: 0,
  },
  divider: { height: 1, background: '#f0f0f0', margin: '0 20px' },
  /* Android */
  androidBody: { padding: '12px 20px 0' },
  featureList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 },
  featureItem: { display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.87rem', color: C.walnut },
  featureIcon: { color: C.green, fontSize: '0.78rem', width: 16, textAlign: 'center' },
  actionRow: {
    display: 'flex', gap: 10,
    paddingBottom: 'env(safe-area-inset-bottom, 20px)',
    marginBottom: 20,
  },
  laterBtn: {
    flex: 1, padding: '12px 0',
    background: '#f3f3f3', border: 'none', borderRadius: 12,
    fontSize: '0.9rem', fontWeight: 500, color: '#666',
    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
  },
  installBtn: {
    flex: 2, padding: '12px 0',
    background: C.green, border: 'none', borderRadius: 12,
    fontSize: '0.9rem', fontWeight: 600, color: '#fff',
    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  installIcon: { color: C.gold, fontSize: '0.9rem' },
  /* iOS */
  iosBody:  { padding: '12px 20px 0' },
  iosSteps: { display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 },
  iosStep:  { display: 'flex', alignItems: 'center', gap: 14 },
  stepNum: {
    width: 28, height: 28, borderRadius: '50%',
    background: C.gold, color: C.green,
    fontSize: '0.78rem', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepText: { fontSize: '0.87rem', color: C.walnut, lineHeight: 1.45 },
  iosIcon: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: C.sand, border: '1px solid #ddd', borderRadius: 5,
    padding: '1px 7px', fontSize: '0.75rem', margin: '0 3px', verticalAlign: 'middle',
  },
  gotItBtn: {
    width: '100%', padding: '12px 0',
    background: C.green, border: 'none', borderRadius: 12,
    fontSize: '0.9rem', fontWeight: 600, color: '#fff',
    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
    marginBottom: 20,
  },
  safeArea: { height: 'env(safe-area-inset-bottom, 8px)', minHeight: 8 },
}

export default function PWAInstallSheet() {
  const { t } = useLang()
  const [visible, setVisible] = useState(false)
  const [shown,   setShown]   = useState(false)
  const [prompt,  setPrompt]  = useState(null)

  useEffect(() => {
    if (isStandalone) return

    const id = setTimeout(() => {
      setVisible(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
    }, 2000)

    const onPrompt = e => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => {
      clearTimeout(id)
      window.removeEventListener('beforeinstallprompt', onPrompt)
    }
  }, [])

  function dismiss() {
    setShown(false)
    setTimeout(() => setVisible(false), 420)
  }

  async function handleInstall() {
    if (!prompt) return
    prompt.prompt()
    await prompt.userChoice
    setPrompt(null)
    dismiss()
  }

  if (!visible) return null

  return createPortal(
    <>
      <div style={S.backdrop(shown)} onClick={dismiss} />

      <div style={S.sheet(shown)} role="dialog" aria-modal="true">
        <div style={S.handle} />

        {/* Header */}
        <div style={S.header}>
          <div style={S.appIcon}>
            <i className="fa-solid fa-moon" style={S.appIconI} />
            <span style={S.appIconSpan}>RHC</span>
          </div>
          <div style={S.metaWrap}>
            <h3 style={S.metaH3}>{isIos ? t('pwa_ios_title') : t('appName')}</h3>
            <p style={S.metaP}>{isIos ? t('pwa_ios_subtitle') : t('pwa_subtitle')}</p>
          </div>
          <button style={S.closeBtn} onClick={dismiss} aria-label="Dismiss">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div style={S.divider} />

        {/* iOS: Add to Home Screen steps */}
        {isIos ? (
          <div style={S.iosBody}>
            <div style={S.iosSteps}>
              <div style={S.iosStep}>
                <span style={S.stepNum}>1</span>
                <span style={S.stepText}>
                  {t('pwa_ios_step1')}&nbsp;
                  <span style={S.iosIcon}>
                    <i className="fa-solid fa-arrow-up-from-bracket" />
                  </span>
                </span>
              </div>
              <div style={S.iosStep}>
                <span style={S.stepNum}>2</span>
                <span style={S.stepText}>{t('pwa_ios_step2')}</span>
              </div>
              <div style={S.iosStep}>
                <span style={S.stepNum}>3</span>
                <span style={S.stepText}>{t('pwa_ios_step3')}</span>
              </div>
            </div>
            <button style={S.gotItBtn} onClick={dismiss}>{t('pwa_got_it')}</button>
          </div>
        ) : (
          /* Android / desktop: feature list + install button */
          <div style={S.androidBody}>
            <ul style={S.featureList}>
              {['pwa_feature1','pwa_feature2','pwa_feature3'].map(key => (
                <li key={key} style={S.featureItem}>
                  <i className="fa-solid fa-circle-check" style={S.featureIcon} />
                  {t(key)}
                </li>
              ))}
            </ul>
            <div style={S.actionRow}>
              <button style={S.laterBtn} onClick={dismiss}>{t('pwa_not_now')}</button>
              <button style={S.installBtn} onClick={handleInstall} disabled={!prompt}>
                <i className="fa-solid fa-download" style={S.installIcon} />
                {t('btn_installApp')}
              </button>
            </div>
          </div>
        )}

        <div style={S.safeArea} />
      </div>
    </>,
    document.body
  )
}
