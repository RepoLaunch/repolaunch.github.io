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
