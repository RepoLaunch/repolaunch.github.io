// Shared site chrome. Edit these templates once to update every page.
// Resolve local assets and navigation from this script, including project-site subpaths.
const siteRoot = new URL('../', document.currentScript.src);
const sharedLayout = {
  header: `
<a class="repo-link" href="https://github.com/microsoft/RepoLaunch"><img data-site-src="assets/github_logo.svg" alt="" width="23" height="23">GitHub Repo <span class="external-arrow" aria-hidden="true">↗</span></a>
    <a class="brand" data-site-href="index.html" target="_self"><img data-site-src="assets/repolaunch_logo.png" alt="" width="38" height="38">RepoLaunch Agent</a>
    <button class="menu-toggle" type="button" aria-label="Open navigation" aria-controls="site-navigation" aria-expanded="false">☰</button>
  `,
  sidebar: `
<nav aria-label="Documentation">
      <p class="nav-label">Documentation</p>
      <ul class="nav-list">
        <li><a data-site-href="index.html"><span class="nav-icon" aria-hidden="true">◎</span>Introduction</a></li>
        <li><a data-site-href="pages/installation/installation.html"><span class="nav-icon" aria-hidden="true">↓</span>Installation</a><ul><li><a data-site-href="pages/installation/windows.html">Windows Container Setup</a></li></ul></li>
        <li><a data-site-href="pages/run/run.html"><span class="nav-icon" aria-hidden="true">▷</span>Run RepoLaunch</a><ul><li><a data-site-href="pages/run/customize.html">Customize Input &amp; Config</a></li><li><a data-site-href="pages/run/api.html">Useful public APIs</a></li></ul></li>
        <li><a data-site-href="pages/citations.html"><span class="nav-icon" aria-hidden="true">◷</span>Citations &amp; History</a></li>
        <li><a data-site-href="pages/contact.html"><span class="nav-icon" aria-hidden="true">✉</span>Contact Us</a></li>
      </ul>
    </nav>
    <div class="sidebar-note"><strong>A codebase is actively evolving.</strong>Build environments.<br>Make build&test reproducible.<br><a href="https://github.com/microsoft/RepoLaunch">microsoft/RepoLaunch ↗</a></div>
  `,
  footer: `
<div class="footer-inner">
        <h2 class="footer-heading">Relevant Links</h2>
        <div class="footer-links">
          <div><a href="https://swe-bench-live.github.io/">SWE-bench-Live Webpage ↗</a><a href="https://github.com/microsoft/SWE-bench-Live">SWE-bench-Live GitHub ↗</a></div>
          <div><a href="https://huggingface.co/collections/SWE-bench-Live/swe-bench-live">SWE-bench-Live Huggingface ↗</a><a href="https://huggingface.co/collections/SWE-bench-Live/cross-platform-bench">Cross-platform Bench Huggingface ↗</a></div>
        </div>
        <div class="footer-bottom">RepoLaunch Agent · Open source tools for reproducible Software Engineering research.</div>
      </div>
  `
};

for (const [name, markup] of Object.entries(sharedLayout)) {
  const container = document.querySelector(`[data-shared="${name}"]`);
  if (container) container.innerHTML = markup;
}

document.querySelectorAll('[data-site-href], [data-site-src]').forEach(element => {
  for (const attribute of ['href', 'src']) {
    const path = element.getAttribute(`data-site-${attribute}`);
    if (path !== null) element.setAttribute(attribute, new URL(path, siteRoot).href);
  }
});

// Keep site navigation in this tab; open external websites in a new tab.
document.querySelectorAll('a[href]').forEach(link => {
  const url = new URL(link.href);
  const isExternalWebsite = ['http:', 'https:'].includes(url.protocol) && url.origin !== siteRoot.origin;
  link.setAttribute('target', isExternalWebsite ? '_blank' : '_self');
  if (isExternalWebsite) link.relList.add('noopener', 'noreferrer');
});

const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
document.querySelectorAll('.sidebar .nav-list a').forEach(link => {
  if (new URL(link.href).pathname.replace(/\/index\.html$/, '/') === currentPath) {
    link.setAttribute('aria-current', 'page');
  }
});

const menuButton = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const backdrop = document.querySelector('.menu-backdrop');
const mobileLayout = window.matchMedia('(orientation: portrait), (max-width: 600px)');

function setMenu(open, restoreFocus = false) {
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menuButton.textContent = open ? '×' : '☰';
  if (open) sidebar.querySelector('a[aria-current="page"]').focus();
  else if (restoreFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
backdrop.addEventListener('click', () => setMenu(false, true));
sidebar.addEventListener('click', event => {
  if (event.target.closest('a') && mobileLayout.matches) setMenu(false);
});
mobileLayout.addEventListener('change', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (!document.body.classList.contains('menu-open')) return;
  if (event.key === 'Escape') setMenu(false, true);
  if (event.key === 'Tab') {
    const controls = [menuButton, ...sidebar.querySelectorAll('a')];
    const position = controls.indexOf(document.activeElement);
    event.preventDefault();
    controls[(position + (event.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
  }
});

document.querySelectorAll('.code-block').forEach(block => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-button';
  button.textContent = 'Copy';
  button.setAttribute('aria-label', 'Copy code to clipboard');
  block.querySelector('.code-toolbar').append(button);
  button.addEventListener('click', async () => {
    const text = block.querySelector('code').textContent;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = 'Copied!';
      document.querySelector('#copy-status').textContent = 'Code copied to clipboard.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(block.querySelector('code'));
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = 'Code selected';
      document.querySelector('#copy-status').textContent = 'Copy unavailable. Code selected; use your device’s copy command.';
    }
    window.setTimeout(() => { button.textContent = 'Copy'; }, 2500);
  });
});
