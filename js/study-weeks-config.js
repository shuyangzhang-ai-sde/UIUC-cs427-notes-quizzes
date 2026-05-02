/**
 * 课程周次唯一数据源 — study-sidebar.js / study-index.js 共用
 * 周页面在站点根目录，与 index.html 同级；file 仅为文件名。
 */
window.STUDY_WEEKS = [
  { id: 'intro', num: 1, file: 'week_1_introduction_software_engineering.html', label: 'Intro to Software Engineering' },
  { id: 'week-2', num: 2, file: 'week_2_requirements_engineering.html', label: 'Software Process' },
  { id: 'requirements', num: 3, file: 'week_3_requirements_engineering.html', label: 'Requirements Engineering' },
  { id: 'week-4', num: 4, file: 'week_4_software_architecture.html', label: 'Software Design and Architecture' },
  { id: 'week-5', num: 5, file: 'week_5_oo_patterns_part_1.html', label: 'OO Patterns, Part 1' },
  { id: 'week-6', num: 6, file: 'week_6_design_patterns.html', label: 'OO Patterns, Part 2' },
  { id: 'week-7', num: 7, file: 'week_7_software_testing.html', label: 'Software Testing, Part 1' },
  { id: 'week-8', num: 8, file: 'week_8_junit_testing.html', label: 'Software Testing, Part 2' },
  { id: 'week-9', num: 9, file: null, label: 'Spring Break' },
  { id: 'week-10', num: 10, file: null, label: 'Iteration 3', soon: true },
  { id: 'week-11', num: 11, file: 'week_11_debugging.html', label: 'Debugging' },
  { id: 'week-12', num: 12, file: null, label: 'Iteration 4', soon: true },
  { id: 'week-13', num: 13, file: 'week_13_exam_1.html', label: 'Exam 1' },
  { id: 'week-14', num: 14, file: 'week_14_software_maintenance.html', label: 'Software Maintenance' },
  { id: 'week-15', num: 15, file: null, label: 'Exam 2', soon: true },
  { id: 'week-16', num: 16, file: null, label: 'Final Deliverable', soon: true }
];

window.formatWeekLabel = function (w) {
  if (!w || w.num == null) return w.label || '';
  return 'Week ' + w.num + ' — ' + w.label;
};
