import { useState, useEffect } from 'react'
import { useLang } from '../context/LangContext'

export default function PWAInstallSheet() {
  const { t } = useLang()
  const [mounted, setMounted] = useState(false)
  const [shown, setShown] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  const ua = navigator.userAgent
  const isIos     = /iphone|ipad|ipod/i.test(ua)
  const isSafari  = isIos && /safari/i.test(ua) && !/crios|fxios|opios|mercury/i.test(ua)
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true

  const triggerShow = () => {
    setMounted(true)
    // double-RAF so the DOM is painted before CSS transition starts
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
  }

  const dismiss = () => {
    setShown(false)
    sessionStorage.setItem('rhc-pwa-dismissed', '1')
    setTimeout(() => setMounted(false), 420)
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    dismiss()
  }

  useEffect(() => {
    if (isStandalone) return
    if (sessionStorage.getItem('rhc-pwa-dismissed')) return

    // Always show after a short delay — don't gate on beforeinstallprompt
    const id = setTimeout(triggerShow, 2000)

    // Separately capture the install prompt to enable the install button
    const onPrompt = e => { e.preventDefault(); setDeferredPrompt(e) }
    const onInstalled = () => dismiss()
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      clearTimeout(id)
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <div
        className={`pwa-backdrop${shown ? ' show' : ''}`}
        onClick={dismiss}
      />
      <div
        className={`pwa-sheet${shown ? ' show' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={isIos && isSafari ? t('pwa_ios_title') : t('appName')}
      >
        <div className="pwa-sheet-handle" />

        {/* Header */}
        <div className="pwa-sheet-header">
          <div className="pwa-sheet-app-icon">
            <i className="fa-solid fa-moon" />
            <span>RHC</span>
          </div>
          <div className="pwa-sheet-meta">
            <h3>{isIos && isSafari ? t('pwa_ios_title') : t('appName')}</h3>
            <p>{isIos && isSafari ? t('pwa_ios_subtitle') : t('pwa_subtitle')}</p>
          </div>
          <button className="pwa-sheet-close" onClick={dismiss} aria-label="Dismiss">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="pwa-sheet-divider" />

        {/* iOS body */}
        {isIos && isSafari ? (
          <div className="pwa-ios-body">
            <div className="pwa-ios-steps">
              <div className="pwa-ios-step">
                <span className="pwa-step-num">1</span>
                <span>
                  {t('pwa_ios_step1').split('Share').map((part, i, arr) =>
                    i < arr.length - 1
                      ? <span key={i}>{part}<span className="pwa-ios-icon"><i className="fa-solid fa-arrow-up-from-bracket" /></span></span>
                      : <span key={i}>{part}</span>
                  )}
                </span>
              </div>
              <div className="pwa-ios-step">
                <span className="pwa-step-num">2</span>
                <span>{t('pwa_ios_step2')}</span>
              </div>
              <div className="pwa-ios-step">
                <span className="pwa-step-num">3</span>
                <span>{t('pwa_ios_step3')}</span>
              </div>
            </div>
            <button className="btn-pwa-gotit" onClick={dismiss}>
              {t('pwa_got_it')}
            </button>
          </div>
        ) : (
          /* Android / Chrome body */
          <div className="pwa-android-body">
            <ul className="pwa-feature-list">
              <li><i className="fa-solid fa-circle-check" /> {t('pwa_feature1')}</li>
              <li><i className="fa-solid fa-circle-check" /> {t('pwa_feature2')}</li>
              <li><i className="fa-solid fa-circle-check" /> {t('pwa_feature3')}</li>
            </ul>
            <div className="pwa-action-row">
              <button className="btn-pwa-later" onClick={dismiss}>
                {t('pwa_not_now')}
              </button>
              <button className="btn-pwa-install" onClick={handleInstall}>
                <i className="fa-solid fa-download" /> {t('btn_installApp')}
              </button>
            </div>
          </div>
        )}

        <div className="pwa-safe-area" />
      </div>
    </>
  )
}
