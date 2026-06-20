import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

export default function Home() {
  const { t } = useLang()

  useEffect(() => {
    const els = document.querySelectorAll('.fade-in')
    if (!els.length) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      })
    }, { threshold: 0.12 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-watermark"></div>
        <div className="hero-inner">
          <div className="hero-photo-wrap">
            <img
              src="/assets/profile.jpg"
              alt="Babu Imran Qureshi"
              className="hero-photo"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
            <div className="hero-photo-placeholder" style={{ display: 'none' }}>
              <i className="fa-solid fa-user"></i>
              <span>profile.jpg</span>
            </div>
          </div>
          <div className="hero-text">
            <p className="hero-eyebrow">{t('hero_eyebrow')}</p>
            <h1>{t('nav_logoName')}</h1>
            <p className="hero-subheading">{t('hero_subheading')}</p>
            <p className="hero-tagline">{t('hero_tagline')}</p>
            <div className="hero-ctas">
              <a href="/assets/booklet.pdf" download className="btn btn-gold">
                <i className="fa-solid fa-download"></i>
                {t('btn_downloadBooklet')}
              </a>
              <Link to="/videos" className="btn btn-outline-white">
                <i className="fa-solid fa-circle-play"></i>
                {t('btn_watchVideos')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <hr className="gold-divider" />

      {/* About */}
      <section className="about-section section-pad">
        <div className="container">
          <div className="section-header fade-in">
            <h2>{t('about_title')}</h2>
            <span className="gold-bar"></span>
          </div>
          <div className="about-highlights fade-in">
            <div className="highlight-card">
              <span className="icon"><i className="fa-solid fa-graduation-cap" style={{ color: 'var(--gold)' }}></i></span>
              <h3>{t('highlight_hajjExpert')}</h3>
            </div>
            <div className="highlight-card">
              <span className="icon"><i className="fa-solid fa-handshake" style={{ color: 'var(--gold)' }}></i></span>
              <h3>{t('highlight_ministryCollab')}</h3>
            </div>
            <div className="highlight-card">
              <span className="icon"><i className="fa-solid fa-chalkboard-user" style={{ color: 'var(--gold)' }}></i></span>
              <h3>{t('highlight_masterTrainer')}</h3>
            </div>
          </div>
          <div className="about-bio fade-in">
            <p>
              {t('bio_p1')} <strong>{t('bio_p1_strong')}</strong> {t('bio_p1_end')}
            </p>
            <p>{t('bio_p2')}</p>
            <p>{t('bio_p3')}</p>
          </div>
        </div>
      </section>

      <hr className="gold-divider" />

      {/* Key Highlights */}
      <section className="highlights-section section-pad">
        <div className="container">
          <div className="section-header fade-in">
            <h2>{t('highlights_title')}</h2>
            <span className="gold-bar"></span>
          </div>
          <div className="stat-grid">
            {[
              { num: 'stat1_number', label: 'stat1_label', icon: 'fa-users' },
              { num: 'stat2_number', label: 'stat2_label', icon: 'fa-map-location-dot' },
              { num: 'stat3_number', label: 'stat3_label', icon: 'fa-certificate' },
            ].map(({ num, label, icon }) => (
              <div className="stat-card fade-in" key={num}>
                <span className="stat-number">
                  {t(num).split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                </span>
                <p className="stat-label">{t(label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="gold-divider" />

      {/* Press */}
      <section className="press-section section-pad">
        <div className="container">
          <div className="section-header fade-in">
            <h2>{t('press_title')}</h2>
            <span className="gold-bar"></span>
          </div>
          <div className="press-card fade-in">
            <span className="quote-icon">&ldquo;</span>
            <p className="press-quote">{t('press_quote')}</p>
            <div className="press-source">
              <span className="app-badge">APP</span>
              <span className="press-attribution">{t('press_attribution')}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
