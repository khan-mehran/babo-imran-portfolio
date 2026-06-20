import { useState, useEffect, useRef } from 'react'
import { useLang } from '../context/LangContext'

export default function Download() {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const shareUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : ''

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  const isIos = /iphone|ipad|ipod/i.test(ua)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true)
    }
    const handler = e => { e.preventDefault(); setDeferredPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setIsInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      await deferredPrompt.userChoice
      setDeferredPrompt(null)
    }
  }

  const handleCopy = () => {
    const url = shareUrl
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => fallbackCopy(url))
    } else {
      fallbackCopy(url)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const fallbackCopy = url => {
    const el = document.createElement('input')
    el.value = url
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }

  return (
    <>
      <div className="page-header">
        <div className="hero-watermark"></div>
        <h1>{t('download_pageTitle')}</h1>
        <p>{t('download_subtitle')}</p>
      </div>

      <section className="download-section section-pad">
        <div className="container">

          {/* App Card */}
          <div className="app-card">
            <div className="app-icon">
              <div className="app-icon-monogram">
                <i className="fa-solid fa-moon"></i>
                <span>RHC</span>
              </div>
            </div>
            <h2>{t('appName')}</h2>
            <p>{t('app_desc')}</p>

            <div className="download-btns">
              {isInstalled ? (
                <p style={{ color: 'var(--green)', fontWeight: 600 }}>✓ App installed</p>
              ) : isIos ? (
                <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--walnut)' }}>
                  <p style={{ fontWeight: 600, marginBottom: '0.4rem' }}>{t('ios_label')}</p>
                  <p>{t('ios_instruction')}</p>
                </div>
              ) : deferredPrompt ? (
                <button className="btn btn-android" onClick={handleInstall}>
                  <i className="fa-solid fa-download"></i>
                  {t('btn_installApp')}
                </button>
              ) : (
                <button className="btn btn-android" disabled style={{ opacity: 0.6 }}>
                  <i className="fa-solid fa-download"></i>
                  {t('btn_installApp')}
                </button>
              )}
              <button className="btn-webapp" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                {t('btn_continueWebApp')}
              </button>
            </div>
          </div>

          {/* Share Section */}
          <div className="share-section-card">
            <h3>
              <i className="fa-solid fa-share-nodes" style={{ marginRight: '0.4rem', color: 'var(--gold)' }}></i>
              {t('share_title')}
            </h3>
            <p>{t('share_desc')}</p>
            <div className="share-input-row">
              <input type="text" value={shareUrl} readOnly />
              <button className={`btn-copy${copied ? ' copied' : ''}`} onClick={handleCopy}>
                {copied ? t('btn_copied') : t('btn_copyLink')}
              </button>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
