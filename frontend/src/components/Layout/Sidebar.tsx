import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    handleClose();
  }, [location.pathname, handleClose]);

  return (
    <>
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
            to="/profile"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            <span className={styles.navIcon}>&#128100;</span>
            Profil
          </NavLink>

          {isAdmin && (
            <>
              <div className={styles.divider} />
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                <span className={styles.navIcon}>&#9881;</span>
                Einstellungen
              </NavLink>

              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                <span className={styles.navIcon}>&#128101;</span>
                Verwaltung
              </NavLink>
            </>
          )}
        </nav>

        <div className={styles.userSection}>
          <div className={styles.userName}>{user?.displayName}</div>
          <button className={styles.logoutBtn} onClick={logout}>
            Abmelden
          </button>
        </div>
      </aside>
    </>
  );
}
