// Carrusel infinito con onclick (compacto, sin logs)
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  function getEls(group) {
    const groupEl = document.getElementById(group);
    if (!groupEl) return {};
    const container = $('.team-cards-container', groupEl);
    const track = $('.team-cards', groupEl);
    const items = $$('.team-card', groupEl);
    return { container, track, items };
  }

  function getStep(track, item) {
    if (!track || !item) return 0;
    const itemW = item.getBoundingClientRect().width;
    const csTrack = getComputedStyle(track);
    const gap = parseFloat(csTrack.columnGap || csTrack.gap || '0') || 0;
    const csItem = getComputedStyle(item);
    const ml = parseFloat(csItem.marginLeft) || 0;
    const mr = parseFloat(csItem.marginRight) || 0;
    return itemW + gap + ml + mr;
  }

  function getVisible(container, step) {
    if (!container || step <= 0) return 1;
    return Math.max(1, Math.floor(container.clientWidth / step));
  }

  function apply(track, index, step) {
    if (!track) return;
    track.style.transform = `translateX(${-index * step}px)`;
    track.dataset.index = String(index);
  }

  function removeClones(track) {
    if (!track) return;
    track.querySelectorAll('.team-card.cloned').forEach(n => n.remove());
  }

  function buildLoop(group) {
    const { container, track } = getEls(group);
    if (!container || !track) return;

    removeClones(track);

    const originals = Array.from(track.querySelectorAll('.team-card'));
    const total = originals.length;
    if (total === 0) return;

    const step = getStep(track, originals[0]);
    let visible = getVisible(container, step);
    visible = Math.min(Math.max(1, visible), total);

    // clones al inicio (últimas V)
    for (let i = total - visible; i < total; i++) {
      const c = originals[i].cloneNode(true);
      c.classList.add('cloned');
      track.insertBefore(c, track.firstChild);
    }
    // clones al final (primeras V)
    for (let i = 0; i < visible; i++) {
      const c = originals[i].cloneNode(true);
      c.classList.add('cloned');
      track.appendChild(c);
    }

    const prev = track.style.transition;
    track.style.transition = 'none';
    apply(track, visible, step); // arrancar “dentro” de los clones
    void track.offsetHeight;
    track.style.transition = prev || 'transform 0.5s ease';

    track.dataset.visible = String(visible);
    track.dataset.total = String(total);
    track.dataset.index = String(visible);
  }

  function initCarousel(group) {
    const { track } = getEls(group);
    if (!track) return;

    if (track.dataset.loopInit !== '1') {
      buildLoop(group);

      const onEnd = () => {
        const { track } = getEls(group);
        if (!track) return;

        const total = parseInt(track.dataset.total || '0', 10);
        const visible = parseInt(track.dataset.visible || '1', 10);
        const index = parseInt(track.dataset.index || '0', 10);

        const any = track.querySelector('.team-card');
        if (!any) return;
        const step = getStep(track, any);

        // si pasamos al bloque de clones del final → saltamos al equivalente real
        if (index >= total + visible) {
          track.style.transition = 'none';
          apply(track, visible, step);
          void track.offsetHeight;
          track.style.transition = 'transform 0.5s ease';
        }
        // si pasamos a los clones del inicio → saltamos al equivalente real (final)
        else if (index < visible) {
          const lastReal = total + visible - 1;
          track.style.transition = 'none';
          apply(track, lastReal, step);
          void track.offsetHeight;
          track.style.transition = 'transform 0.5s ease';
        }
      };

      track.addEventListener('transitionend', onEnd);
      track._loopHandler = onEnd;
      track.dataset.loopInit = '1';
    } else {
      rebuildLoop(group);
    }
  }

  function rebuildLoop(group) {
    const { track } = getEls(group);
    if (!track) return;
    const prev = track.style.transition;
    track.style.transition = 'none';
    apply(track, 0, 0);
    removeClones(track);
    void track.offsetHeight;
    track.style.transition = prev || 'transform 0.5s ease';
    buildLoop(group);
  }

  // ====== API pública para tus onclick ======
  window.moveCarousel = function (group, direction) {
    const { track } = getEls(group);
    if (!track) return;

    if (track.dataset.loopInit !== '1') initCarousel(group);

    const any = track.querySelector('.team-card');
    if (!any) return;

    const step = getStep(track, any);
    const visible = parseInt(track.dataset.visible || '1', 10);

    let index = parseInt(track.dataset.index || String(visible), 10);
    if (Number.isNaN(index)) index = visible;

    if (direction === 'next') index += 1;
    else if (direction === 'prev') index -= 1;

    apply(track, index, step);
  };

  window.showTeachers = function (specialty) {
    $$('.teachers-group').forEach(g => g.classList.remove('active'));
    const sel = document.getElementById(specialty);
    if (sel) sel.classList.add('active');

    $$('.specialty-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`button[onclick="showTeachers('${specialty}')"]`);
    if (btn) btn.classList.add('active');

    // inicializar cuando ya es visible (evita width=0)
    requestAnimationFrame(() => initCarousel(specialty));
  };

  // ====== Bootstrap ======
  document.addEventListener('DOMContentLoaded', () => {
    // pestaña por defecto
    window.showTeachers('contabilidad');

    // auto-avance infinito solo del grupo visible
    setInterval(() => {
      const active = document.querySelector('.teachers-group.active');
      if (active && active.id) window.moveCarousel(active.id, 'next');
    }, 6000);

    // rearmar al redimensionar
    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const active = document.querySelector('.teachers-group.active');
        if (active && active.id) rebuildLoop(active.id);
      }, 150);
    });
  });
})();

