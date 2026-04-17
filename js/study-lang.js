(function () {
  function insideLangFolder() {
    var p = ((typeof location !== 'undefined' && location.pathname) || '').replace(/\\/g, '/');
    return /\/(zh|en)\/[^/]+\.html$/i.test(p);
  }

  /** Path from site root, e.g. en/week_1_....html — for index iframe src */
  window.getWeekFile = function (week) {
    if (!week || !week.file) return '';
    return 'en/' + week.file;
  };

  /** Nav href: from index use en/...; from inside en/ use sibling filename only. */
  window.getWeekNavHref = function (week) {
    if (!week || !week.file) return '';
    if (insideLangFolder()) return week.file;
    return window.getWeekFile(week);
  };
})();
