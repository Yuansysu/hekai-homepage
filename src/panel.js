import { SECTIONS } from './content.js';

/** 右侧抽屉面板：用 #about / #projects / #papers / #join 打开对应栏目 */
export function createPanel({ onChange } = {}) {
  const panel = document.getElementById('panel');
  const inner = panel.querySelector('.panel__inner');
  const body = document.getElementById('panel-body');
  const tabs = document.getElementById('panel-tabs');
  const scrim = document.getElementById('scrim');
  const closeBtn = document.getElementById('panel-close');

  tabs.innerHTML = SECTIONS.map((s) => `<a href="#${s.id}" data-id="${s.id}">${s.tab}</a>`).join('');

  let current = null;
  let lastFocus = null;
  let hideTimer = 0;

  function render(section) {
    body.innerHTML = `
      <header class="panel__head">
        <p class="panel__kicker">${section.kicker}</p>
        <h2 class="panel__title" id="panel-title">${section.title}</h2>
      </header>
      ${section.html()}`;
    inner.scrollTop = 0;
    tabs.querySelectorAll('a').forEach((a) => a.classList.toggle('is-current', a.dataset.id === section.id));
  }

  function open(id) {
    const section = SECTIONS.find((s) => s.id === id);
    if (!section) return close();
    const wasOpen = current !== null;
    if (current !== id) render(section);
    current = id;
    if (wasOpen) return;

    clearTimeout(hideTimer);
    lastFocus = document.activeElement;
    panel.hidden = false;
    scrim.hidden = false;
    requestAnimationFrame(() => {
      panel.classList.add('is-open');
      scrim.classList.add('is-open');
      document.body.classList.add('panel-open');
    });
    closeBtn.focus({ preventScroll: true });
    onChange?.(true);
  }

  function close() {
    if (current === null) return;
    current = null;
    panel.classList.remove('is-open');
    scrim.classList.remove('is-open');
    document.body.classList.remove('panel-open');
    hideTimer = setTimeout(() => {
      panel.hidden = true;
      scrim.hidden = true;
    }, 650);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
    onChange?.(false);
  }

  function dismiss() {
    if (location.hash) history.pushState(null, '', location.pathname + location.search);
    close();
  }

  const sync = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    SECTIONS.some((s) => s.id === id) ? open(id) : close();
  };

  addEventListener('hashchange', sync);
  addEventListener('popstate', sync);
  closeBtn.addEventListener('click', dismiss);
  scrim.addEventListener('click', dismiss);
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && current !== null) dismiss();
  });

  // 简单的焦点循环：Tab 不会跑出面板
  panel.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = [...panel.querySelectorAll('a[href], button')].filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  sync();
  return { isOpen: () => current !== null };
}
