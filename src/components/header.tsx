"use client";

import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Shallot home">
        <span>Shallot</span>
        <b>Savory Thai</b>
      </a>
      <button
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id="main-navigation"
        className={open ? "navigation is-open" : "navigation"}
        aria-label="Main navigation"
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        <a href="#menu" onClick={() => setOpen(false)}>
          Menu
        </a>
        <a href="#story" onClick={() => setOpen(false)}>
          Story
        </a>
        <a href="#reviews" onClick={() => setOpen(false)}>
          Reviews
        </a>
        <a href="#visit" onClick={() => setOpen(false)}>
          Visit
        </a>
      </nav>
    </header>
  );
}
