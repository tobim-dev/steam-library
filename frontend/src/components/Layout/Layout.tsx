import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import styles from './Layout.module.css';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      {/* Mobile Hamburger-Button */}
      <button
        className={styles.menuButton}
        onClick={() => setSidebarOpen(true)}
        aria-label="Menu oeffnen"
      >
        <span className={styles.menuIcon}>&#9776;</span>
      </button>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
