import { useLang } from '../context/LangContext'

const VIDEO_ITEMS = [
  { titleKey: 'video1_title', descKey: 'video1_desc', youtubeId: 'zcHDGEtggIs' },
  { titleKey: 'video2_title', descKey: 'video2_desc', youtubeId: null },
  { titleKey: 'video3_title', descKey: 'video3_desc', youtubeId: null },
  { titleKey: 'video4_title', descKey: 'video4_desc', youtubeId: null },
]

export default function Videos() {
  const { t } = useLang()

  return (
    <>
      <div className="page-header">
        <div className="hero-watermark"></div>
        <h1>{t('videos_pageTitle')}</h1>
        <p>{t('videos_subtitle')}</p>
      </div>

      <section className="section-pad" style={{ background: 'var(--parchment)' }}>
        <div className="container">
          <div className="video-grid">
            {VIDEO_ITEMS.map(({ titleKey, descKey, youtubeId }) => (
              <div className="video-card" key={titleKey}>
                {youtubeId ? (
                  <div className="video-embed">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title={t(titleKey)}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="video-placeholder">
                    <div className="video-placeholder-inner">
                      <i className="fa-solid fa-circle-play"></i>
                      <span className="coming-soon">{t('coming_soon')}</span>
                    </div>
                  </div>
                )}
                <div className="video-info">
                  <h3>{t(titleKey)}</h3>
                  <p>{t(descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
