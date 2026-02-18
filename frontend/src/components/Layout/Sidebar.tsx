import { NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  // Sidebar automatisch schliessen bei Routenwechsel (mobile)
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  return (
    <>
      {/* Dunkler Overlay-Hintergrund auf Mobile */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}
      >
        <div className={styles.logo}>
          <span className={styles.logoIcon}>&#127918;</span>
          <span className={styles.logoText}>Game Vault</span>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/library"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            <span className={styles.navIcon}>&#128218;</span>
            Bibliothek
          </NavLink>

          <NavLink
            to="/diary"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            <span className={styles.navIcon}>&#128214;</span>
            Tagebuch
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            <span className={styles.navIcon}>&#9881;</span>
            Einstellungen
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
