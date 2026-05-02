(function () {
  /**
   * Week HTML files live at the site root next to index.html.
   * Path from site root for iframe src and nav: filename only (e.g. week_1_....html).
   */
  window.getWeekFile = function (week) {
    if (!week || !week.file) return '';
    return week.file;
  };

  /** Nav href: same-directory links — index and week pages both sit at repo root. */
  window.getWeekNavHref = function (week) {
    if (!week || !week.file) return '';
    return week.file;
  };
})();
