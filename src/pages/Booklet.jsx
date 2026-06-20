import { useState } from 'react'
import { useLang } from '../context/LangContext'

const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)

export default function Booklet() {
  const { t } = useLang()
  const [readerOpen, setReaderOpen] = useState(false)

  return (
    <>
      <div className="page-header">
        <div className="hero-watermark"></div>
        <h1>{t('booklet_pageTitle')}</h1>
        <p>{t('booklet_subtitle')}</p>
      </div>

      <section className="booklet-section section-pad">
        <div className="container">
          <div className="booklet-card">
            <div className="book-cover">
              <div className="hero-watermark"></div>
              <div className="book-cover-inner">
                <span className="book-crescent"><i className="fa-solid fa-moon"></i></span>
                <h2>{t('booklet_pageTitle')}</h2>
                <p className="book-sub">{t('booklet_subtitle')}</p>
                <p className="book-org amiri">رفیق حجاج کمیٹی — پاکستان</p>
              </div>
            </div>

            <div className="booklet-body">
              <p>{t('booklet_body')}</p>

              <div className="booklet-actions">
                <a href="/assets/booklet.pdf" download className="btn btn-gold">
                  <i className="fa-solid fa-download"></i>
                  {t('btn_downloadPDF')}
                </a>
                <button
                  className="btn btn-outline-green"
                  onClick={() => setReaderOpen(o => !o)}
                >
                  <i className={readerOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-book-reader'}></i>
                  {readerOpen ? t('btn_closeBooklet') : t('btn_readBooklet')}
                </button>
              </div>

              {/* <p className="booklet-note">
                <code>assets/booklet.pdf</code> — {t('booklet_note')}
              </p> */}
            </div>
          </div>

          {readerOpen && (
            isIos ? (
              <div className="booklet-ios-open">
                <i className="fa-solid fa-file-pdf booklet-ios-icon"></i>
                <p>{t('booklet_ios_msg')}</p>
                <a
                  href="/assets/booklet.pdf"
                  target="_blank"
                  rel="noopener"
                  className="btn btn-gold"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  {t('btn_openPDF')}
                </a>
              </div>
            ) : (
              <div className="booklet-viewer">
                <div className="booklet-viewer-header">
                  <span><i className="fa-solid fa-book-open" style={{ marginInlineEnd: '0.5rem' }}></i>{t('booklet_pageTitle')}</span>
                  <a href="/assets/booklet.pdf" target="_blank" rel="noopener" className="booklet-viewer-open">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>
                </div>
                <iframe
                  src="/assets/booklet.pdf"
                  className="booklet-iframe"
                  title={t('booklet_pageTitle')}
                ></iframe>
              </div>
            )
          )}
        </div>
      </section>
    </>
  )
}
