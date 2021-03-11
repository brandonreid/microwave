import React, { useState } from 'react';
import cn from './theme-picker.module.css';

const ThemePicker = ({
  activeTheme,
  onThemeSelection,
  themeOptions,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={cn.wrapper}>
      <button
        className={`${cn.menuToggle} ${menuOpen ? cn.menuToggleOpen : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M18 4V3c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6h1v4H9v11c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-9h8V4h-3z"/>
        </svg>
      </button>
      <div className={`${cn.options} ${menuOpen ? cn.optionsOpen : ''}`}>
        {themeOptions.map((name) => (
          <button
            key={name}
            className={`${cn.themeOption} ${name} ${activeTheme === name ? cn.themeOptionActive : ''}`}
            onClick={() => onThemeSelection(name)}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemePicker;
