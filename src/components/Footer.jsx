import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="footer">
      <div className="footer-divider"></div>
      <div className="footer-inner">
        <div className="footer-brand">
          <i className="fa-solid fa-moon"></i>
          {t('footer_brand')}
          <span>© {new Date().getFullYear()}</span>
        </div>
        <ul className="footer-links">
          <li><Link to="/">{t('nav_home')}</Link></li>
          <li><Link to="/booklet">{t('nav_booklet')}</Link></li>
          <li><Link to="/videos">{t('nav_videos')}</Link></li>
          <li><Link to="/download">{t('nav_downloadApp')}</Link></li>
        </ul>
      </div>
    </footer>
  )
}
