/**
 * index.html：iframe 切换周次。周次数据在 study-weeks-config.js，侧栏 DOM 在 study-sidebar.js。
 */
(function () {
  var DEFAULT_ID = 'week-8';

  function $(sel) {
    return document.querySelector(sel);
  }

  function findWeekById(id) {
    if (!id || !window.STUDY_WEEKS) return null;
    var clean = String(id).replace(/^#/, '');
    for (var i = 0; i < window.STUDY_WEEKS.length; i++) {
      if (window.STUDY_WEEKS[i].id === clean) return window.STUDY_WEEKS[i];
    }
    return null;
  }

  function setCurrentNav(activeId) {
    var links = document.querySelectorAll('.study-nav-list a[data-week-id]');
    links.forEach(function (a) {
      var isCurrent = a.getAttribute('data-week-id') === activeId;
      a.classList.toggle('current', isCurrent);
      if (isCurrent) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function loadWeek(week) {
    if (!week || !week.file) return;
    var frame = $('#study-frame');
    if (!frame) return;
    var f = window.getWeekFile ? window.getWeekFile(week) : week.file;
    frame.src = f + '?embed=1';
    setCurrentNav(week.id);
    try {
      history.replaceState(null, '', '#' + week.id);
    } catch (e) {}
    document.title = 'CS 427 Study · ' + window.formatWeekLabel(week);
  }

  function hashToWeekId() {
    var h = (location.hash || '').replace(/^#/, '');
    return h || null;
  }

  function pickInitialWeek() {
    var fromHash = findWeekById(hashToWeekId());
    if (fromHash && fromHash.file) return fromHash;
    var def = findWeekById(DEFAULT_ID);
    if (def && def.file) return def;
    if (!window.STUDY_WEEKS) return null;
    for (var j = 0; j < window.STUDY_WEEKS.length; j++) {
      if (window.STUDY_WEEKS[j].file) return window.STUDY_WEEKS[j];
    }
    return null;
  }

  function init() {
    var initial = pickInitialWeek();
    if (typeof window.renderStudyNavList === 'function') {
      window.renderStudyNavList($('#study-nav-list'), {
        useHash: true,
        currentId: initial ? initial.id : '',
        onWeekClick: loadWeek
      });
    }
    if (initial) loadWeek(initial);

    window.addEventListener('hashchange', function () {
      var w = findWeekById(hashToWeekId());
      if (w && w.file) loadWeek(w);
    });

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
