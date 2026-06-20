import { NavLink } from 'react-router-dom'
import { useLang } from '../context/LangContext'

export default function BottomNav() {
  const { t } = useLang()
  const cls = ({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        <NavLink to="/" end className={cls}>
          <i className="fa-solid fa-house"></i>
          <span>{t('nav_home')}</span>
        </NavLink>
        <NavLink to="/booklet" className={cls}>
          <i className="fa-solid fa-book"></i>
          <span>{t('nav_booklet')}</span>
        </NavLink>
        <NavLink to="/videos" className={cls}>
          <i className="fa-solid fa-circle-play"></i>
          <span>{t('nav_videos')}</span>
        </NavLink>
        <NavLink to="/download" className={cls}>
          <i className="fa-solid fa-download"></i>
          <span>{t('nav_app')}</span>
        </NavLink>
      </div>
    </nav>
  )
}
