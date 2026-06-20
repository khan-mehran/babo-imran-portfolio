import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useLang } from '../context/LangContext'

export default function Navbar() {
  const { t, toggleLang } = useLang()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <NavLink to="/" className="nav-logo" onClick={close}>
          <i className="fa-solid fa-moon"></i>
          <span>{t('nav_logoName')}</span>
        </NavLink>

        <ul className={`nav-links${open ? ' open' : ''}`}>
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''} onClick={close}>
              {t('nav_home')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/booklet" className={({ isActive }) => isActive ? 'active' : ''} onClick={close}>
              {t('nav_booklet')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/videos" className={({ isActive }) => isActive ? 'active' : ''} onClick={close}>
              {t('nav_videos')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/download" className={({ isActive }) => isActive ? 'active' : ''} onClick={close}>
              {t('nav_downloadApp')}
            </NavLink>
          </li>
        </ul>

        <button className="lang-toggle" onClick={toggleLang}>
          <i className="fa-solid fa-globe"></i>
          {t('lang_toggle')}
        </button>

        <button
          className={`hamburger${open ? ' open' : ''}`}
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen(o => !o)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}
