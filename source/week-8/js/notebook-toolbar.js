/**
 * CS 427 notebook — highlight toolbar (markup, persistence, Link File / Export).
 * Serve the repo over http(s) so this script loads; file:// may block local JS in some browsers.
 */
(function () {
  var TOOLBAR_HTML = `<div id="hl-toolbar" class="editing">
  <span class="tb-label">Markup</span>
  <button class="btn-edit" onclick="enterEdit()" title="Enter edit mode">✏ Edit</button>
  <div class="edit-tools">
    <button class="btn-yellow" onclick="applyMark('hl-slide')" title="Yellow highlight">● Yellow</button>
    <button class="btn-blue" onclick="applyMark('hl-trans')" title="Blue highlight">● Blue</button>
    <button class="btn-red" onclick="applyMark('hl-red')" title="Light red highlight">● Red</button>
    <button onclick="applyBold()" title="Bold / unbold (toggle)"><b>B</b></button>
    <button type="button" class="btn-code" onclick="applyCode()" title="Code (monospace, same size as surrounding text)"><span class="code-inline" style="font-size:12px;">&lt;/&gt;</span></button>
    <button onclick="clearMark()" title="Remove highlight, code, or bold from selection">✕ Clear</button>
    <button id="hl-btn-undo" onclick="undo()" title="Undo (⌘Z)">↩ Undo</button>
    <button id="hl-btn-redo" onclick="redo()" title="Redo (⌘⇧Z)" disabled="">↪ Redo</button>
    <span class="tb-sep"></span>
    <button class="btn-revert" onclick="revertToSaved()" title="Discard session edits — reload from the last saved file">↩ Revert to saved</button>
    <button class="btn-clear-all" onclick="clearAllMarks()" title="Remove ALL highlights, code spans, and bold from the entire document">🗑 Clear all</button>
    <button id="hl-btn-link" class="btn-link" onclick="linkFile()" title="Link this file for auto-saving">🔗 Link File</button>
    <button id="hl-btn-export" class="btn-export" onclick="exportHTML()" title="Download updated HTML file" style="display:none">⬇ Export</button>
    <span id="hl-save-status" class="">Linking…</span>
    <span class="tb-sep"></span>
    <button class="btn-done" onclick="exitEdit()" title="Exit edit mode">✓ Done</button>
  </div>
</div>`;

  if (!document.getElementById("hl-toolbar")) {
    document.body.insertAdjacentHTML("afterbegin", TOOLBAR_HTML);
  }

  var KEY = 'hl:' + location.pathname;
  var META_KEY = KEY + ':meta';
  var IDB_NAME = 'cs427-notebook-handles';
  var IDB_VER = 1;
  var IDB_STORE = 'handles';

  /* ── Check if a text node is inside any existing highlight span ── */
  function isInsideHighlight(node) {
    var el = node.nodeType === 3 ? node.parentNode : node;
    while (el && el !== document.body) {
      if (el.tagName === 'SPAN' &&
          (el.classList.contains('hl-slide') || el.classList.contains('hl-trans') ||
           el.classList.contains('hl-red'))) {
        return true;
      }
      el = el.parentNode;
    }
    return false;
  }

  function isCodeInlineEl(el) {
    return el && el.tagName === 'SPAN' && el.classList && el.classList.contains('code-inline');
  }

  /* ── Collect all text nodes that intersect a range ── */
  function getTextNodesInRange(range) {
    var root = range.commonAncestorContainer;
    if (root.nodeType === 3) root = root.parentNode;
    var nodes = [];
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var n;
    while ((n = walker.nextNode())) {
      if (range.intersectsNode(n)) nodes.push(n);
    }
    return nodes;
  }

  /* Direct child of highlight span that contains this text (may be #text or <strong>, etc.) */
  function directChildOfSpan(parentSpan, textNode) {
    var n = textNode;
    while (n && n.parentNode !== parentSpan) n = n.parentNode;
    return n && n !== parentSpan ? n : null;
  }

  /* ── Split a highlight span around one specific child text node ──
     Produces: [old-class: before] [new-class: node] [old-class: after]
     `node` may be nested (e.g. text inside <strong>); we index the top-level child.  ── */
  function changeSpanPortion(parentSpan, node, newCls) {
    var oldCls   = parentSpan.className;
    var children = Array.prototype.slice.call(parentSpan.childNodes);
    var direct   = directChildOfSpan(parentSpan, node);
    if (!direct) return;
    var idx    = children.indexOf(direct);
    if (idx < 0) return;
    var before = children.slice(0, idx);
    var after  = children.slice(idx + 1);
    var frag     = document.createDocumentFragment();

    if (before.length > 0) {
      var bSpan = document.createElement('span');
      bSpan.className = oldCls;
      before.forEach(function (c) { bSpan.appendChild(c); });
      frag.appendChild(bSpan);
    }

    var tSpan = document.createElement('span');
    tSpan.className = newCls;
    tSpan.appendChild(node);
    frag.appendChild(tSpan);

    /* If we only peeled text off <strong> (or similar), keep the rest of that element */
    if (direct.parentNode === parentSpan && direct.childNodes.length > 0) {
      frag.appendChild(direct);
    }

    if (after.length > 0) {
      var aSpan = document.createElement('span');
      aSpan.className = oldCls;
      after.forEach(function (c) { aSpan.appendChild(c); });
      frag.appendChild(aSpan);
    }

    parentSpan.parentNode.replaceChild(frag, parentSpan);
  }

  /* ── Split a highlight span and remove highlight from one child segment only (same geometry as changeSpanPortion) ── */
  function unwrapSpanPortion(parentSpan, node) {
    var oldCls   = parentSpan.className;
    var children = Array.prototype.slice.call(parentSpan.childNodes);
    var direct   = directChildOfSpan(parentSpan, node);
    if (!direct) return;
    var idx    = children.indexOf(direct);
    if (idx < 0) return;
    var before = children.slice(0, idx);
    var after  = children.slice(idx + 1);
    var frag   = document.createDocumentFragment();

    if (before.length > 0) {
      var bSpan = document.createElement('span');
      bSpan.className = oldCls;
      before.forEach(function (c) { bSpan.appendChild(c); });
      frag.appendChild(bSpan);
    }

    frag.appendChild(node);

    if (direct.parentNode === parentSpan && direct.childNodes.length > 0) {
      frag.appendChild(direct);
    }

    if (after.length > 0) {
      var aSpan = document.createElement('span');
      aSpan.className = oldCls;
      after.forEach(function (c) { aSpan.appendChild(c); });
      frag.appendChild(aSpan);
    }

    parentSpan.parentNode.replaceChild(frag, parentSpan);
  }

  /* ── Apply highlight:
     • Unhighlighted text  → wrap with new color
     • Same color already  → leave as-is
     • Different color     → override (split span at boundary if needed)   ── */
  function applyMark(cls) {
    var sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    var range = sel.getRangeAt(0);

    var nodes = getTextNodesInRange(range);
    nodes.forEach(function (textNode) {
      if (textNode.textContent.trim() === '') return; // skip whitespace-only nodes
      var start = (textNode === range.startContainer) ? range.startOffset : 0;
      var end   = (textNode === range.endContainer)   ? range.endOffset   : textNode.length;
      if (start >= end) return;

      if (isInsideHighlight(textNode)) {
        // Find the nearest parent highlight span
        var parentSpan = textNode.parentNode;
        while (parentSpan &&
               !(parentSpan.tagName === 'SPAN' &&
                 (parentSpan.classList.contains('hl-slide') ||
                  parentSpan.classList.contains('hl-trans') ||
                  parentSpan.classList.contains('hl-red')))) {
          parentSpan = parentSpan.parentNode;
        }
        if (!parentSpan) return;
        if (parentSpan.className === cls) return; // same color — nothing to do

        // Isolate the [start..end] portion of the text node
        var node = textNode;
        if (end < node.length) node.splitText(end);
        if (start > 0)         node = node.splitText(start);

        // Replace or split the parent span with the new color
        changeSpanPortion(parentSpan, node, cls);

      } else {
        // Plain text — wrap with new color
        var node = textNode;
        if (end < node.length) node.splitText(end);
        if (start > 0)         node = node.splitText(start);

        var span = document.createElement('span');
        span.className = cls;
        node.parentNode.insertBefore(span, node);
        span.appendChild(node);
      }
    });

    sel.removeAllRanges();
    save();
  }

  /* ── Bold: wrap selection, or unwrap if selection is already entirely inside <strong> ── */
  function isUnderStrong(textNode) {
    var el = textNode.parentNode;
    while (el && el !== document.body) {
      if (el.tagName === 'STRONG') return true;
      el = el.parentNode;
    }
    return false;
  }

  function selectionIsEntirelyBold(range) {
    var nodes = getTextNodesInRange(range);
    var hasNonSpace = false;
    for (var i = 0; i < nodes.length; i++) {
      var textNode = nodes[i];
      var start = (textNode === range.startContainer) ? range.startOffset : 0;
      var end = (textNode === range.endContainer) ? range.endOffset : textNode.length;
      if (start >= end) continue;
      var slice = textNode.textContent.substring(start, end);
      if (slice.replace(/\s/g, '') === '') continue;
      hasNonSpace = true;
      if (!isUnderStrong(textNode)) return false;
    }
    return hasNonSpace;
  }

  function unwrapAllStrongInFragment(root) {
    if (!root || !root.querySelector) return;
    var s;
    while ((s = root.querySelector('strong'))) {
      var p = s.parentNode;
      if (!p) return;
      while (s.firstChild) p.insertBefore(s.firstChild, s);
      p.removeChild(s);
    }
  }

  function normalizeAncestorSection(node) {
    while (node && node !== document.body) {
      if (node.classList && node.classList.contains('section')) {
        node.normalize();
        return;
      }
      node = node.parentNode;
    }
  }

  function applyBold() {
    var sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    var range = sel.getRangeAt(0);

    if (selectionIsEntirelyBold(range)) {
      var frag = range.extractContents();
      unwrapAllStrongInFragment(frag);
      range.insertNode(frag);
      var n = range.startContainer;
      if (n.nodeType === 3) n = n.parentNode;
      normalizeAncestorSection(n);
      sel.removeAllRanges();
      save();
      return;
    }

    var el = document.createElement('strong');
    try {
      range.surroundContents(el);
    } catch (e) {
      var frag2 = range.extractContents();
      el.appendChild(frag2);
      range.insertNode(el);
    }
    sel.removeAllRanges();
    save();
  }

  /* ── Apply inline code (monospace, same font size as context) ── */
  function applyCode() {
    var sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    var range = sel.getRangeAt(0);
    var el = document.createElement('span');
    el.className = 'code-inline';
    try {
      range.surroundContents(el);
    } catch (e) {
      var frag = range.extractContents();
      el.appendChild(frag);
      range.insertNode(el);
    }
    sel.removeAllRanges();
    save();
  }

  /* ── Remove highlight / code / bold: non-collapsed selection inside a highlight clears only that slice; otherwise unwrap innermost mark at caret ── */
  function clearMark() {
    var sel = window.getSelection();
    if (!sel) return;

    if (!sel.isCollapsed && sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      var nodes = getTextNodesInRange(range);
      var clearedHL = false;
      nodes.forEach(function (textNode) {
        if (textNode.textContent.trim() === '') return;
        var start = (textNode === range.startContainer) ? range.startOffset : 0;
        var end   = (textNode === range.endContainer)   ? range.endOffset   : textNode.length;
        if (start >= end) return;
        if (!isInsideHighlight(textNode)) return;

        var parentSpan = textNode.parentNode;
        while (parentSpan &&
               !(parentSpan.tagName === 'SPAN' &&
                 (parentSpan.classList.contains('hl-slide') ||
                  parentSpan.classList.contains('hl-trans') ||
                  parentSpan.classList.contains('hl-red')))) {
          parentSpan = parentSpan.parentNode;
        }
        if (!parentSpan) return;

        var node = textNode;
        if (end < node.length) node.splitText(end);
        if (start > 0) node = node.splitText(start);

        unwrapSpanPortion(parentSpan, node);
        clearedHL = true;
      });
      if (clearedHL) {
        sel.removeAllRanges();
        save();
        return;
      }
    }

    var node = sel.anchorNode;
    var el = node && node.nodeType === 3 ? node.parentNode : node;
    while (el && el !== document.body) {
      var isHL = el.tagName === 'SPAN' &&
                 (el.classList.contains('hl-slide') || el.classList.contains('hl-trans') ||
                  el.classList.contains('hl-red'));
      var isBold = el.tagName === 'STRONG';
      var isCode = isCodeInlineEl(el);
      if (isHL || isBold || isCode) {
        var p = el.parentNode;
        while (el.firstChild) p.insertBefore(el.firstChild, el);
        p.removeChild(el);
        p.normalize();
        break;
      }
      el = el.parentNode;
    }
    sel.removeAllRanges();
    save();
  }

  /* ── History stack for Undo / Redo ── */
  var hlHistory = [];
  var hlIndex   = -1;
  var MAX_HIST  = 50;

  function snapshot() {
    var data = {};
    document.querySelectorAll('.section').forEach(function (s) { data[s.id] = s.innerHTML; });
    return data;
  }

  function pushHistory() {
    // Discard any "future" states if we branched from a mid-history point
    if (hlIndex < hlHistory.length - 1) hlHistory = hlHistory.slice(0, hlIndex + 1);
    hlHistory.push(snapshot());
    if (hlHistory.length > MAX_HIST) { hlHistory.shift(); }
    hlIndex = hlHistory.length - 1;
    refreshUndoRedo();
  }

  function applySnapshot(data) {
    document.querySelectorAll('.section').forEach(function (s) {
      if (data[s.id] !== undefined) s.innerHTML = data[s.id];
    });
  }

  function refreshUndoRedo() {
    var u = document.getElementById('hl-btn-undo');
    var r = document.getElementById('hl-btn-redo');
    if (u) u.disabled = (hlIndex <= 0);
    if (r) r.disabled = (hlIndex >= hlHistory.length - 1);
  }

  function undo() {
    if (hlIndex <= 0) return;
    hlIndex--;
    applySnapshot(hlHistory[hlIndex]);
    saveToStorage();
    autoWrite();
    refreshUndoRedo();
  }

  function redo() {
    if (hlIndex >= hlHistory.length - 1) return;
    hlIndex++;
    applySnapshot(hlHistory[hlIndex]);
    saveToStorage();
    autoWrite();
    refreshUndoRedo();
  }

  /* ── Persist to localStorage (+ draft metadata for notebook UX) ── */
  function saveToStorage() {
    var data = {};
    document.querySelectorAll('.section').forEach(function (s) { data[s.id] = s.innerHTML; });
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      var prev = {};
      try { prev = JSON.parse(localStorage.getItem(META_KEY) || '{}'); } catch (e2) {}
      prev.lastEditedAt = Date.now();
      localStorage.setItem(META_KEY, JSON.stringify(prev));
    } catch (e) {}
    updateDraftStatusUI();
  }

  /* ── Called after every user edit ── */
  function save() {
    pushHistory();
    saveToStorage();
    autoWrite();
  }

  /* ── Restore from localStorage on page load ── */
  function restore() {
    var raw;
    try { raw = localStorage.getItem(KEY); } catch (e) { return; }
    if (!raw) return;
    try {
      var data = JSON.parse(raw);
      document.querySelectorAll('.section').forEach(function (s) {
        if (data[s.id] !== undefined) s.innerHTML = data[s.id];
      });
    } catch (e) {}
  }

  /* ── If browser draft is newer than embedded file timestamp, ask before applying ── */
  function restoreDraftOrPrompt() {
    return new Promise(function (resolve) {
      var fileTs = 0;
      var m = document.querySelector('meta[name="notebook-saved-at"]');
      if (m && m.content) {
        var t = Date.parse(m.content);
        if (!isNaN(t)) fileTs = t;
      }
      var raw, metaStr;
      try {
        raw = localStorage.getItem(KEY);
        metaStr = localStorage.getItem(META_KEY);
      } catch (e) {}
      var draftTs = 0;
      if (metaStr) {
        try { draftTs = JSON.parse(metaStr).lastEditedAt || 0; } catch (e2) {}
      }
      var hasDraft = raw && raw.length > 2;
      if (hasDraft && draftTs > fileTs) {
        var msg =
          'Your browser has a newer notebook draft (' +
          new Date(draftTs).toLocaleString() +
          ') than this file snapshot (' +
          (fileTs ? new Date(fileTs).toLocaleString() : 'none or older') +
          ').\n\n' +
          'OK = Restore draft\nCancel = Discard draft and reload from file';
        if (!confirm(msg)) {
          try {
            localStorage.removeItem(KEY);
            localStorage.removeItem(META_KEY);
          } catch (e3) {}
          location.reload();
          return;
        }
      }
      restore();
      resolve();
    });
  }

  /* ── Revert: discard session edits, reload from the file on disk ── */
  function revertToSaved() {
    if (!confirm('Discard all edits from this session and reload from the last saved file?')) return;
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem(META_KEY);
    } catch (e) {}
    location.reload();
  }

  /* ── Clear all: remove every highlight and bold from the document ── */
  function clearAllMarks() {
    if (!confirm('Remove ALL highlights, code spans, and bold from the entire document?\nYou can Undo this with ↩ Undo.')) return;
    document.querySelectorAll('.section').forEach(function (section) {
      var els = Array.prototype.slice.call(
        section.querySelectorAll('.hl-slide, .hl-trans, .hl-red, strong, span.code-inline')
      );
      els.forEach(function (el) {
        if (!el.parentNode) return;
        var p = el.parentNode;
        while (el.firstChild) p.insertBefore(el.firstChild, el);
        p.removeChild(el);
      });
      section.normalize();
    });
    save(); // pushes to history, localStorage, and auto-writes file
  }

  /* ── File System Access API: auto-save + IndexedDB handle persistence ── */
  var fileHandle = null;

  function setStatus(text, cls) {
    var el = document.getElementById('hl-save-status');
    if (!el) return;
    el.textContent = text;
    el.className = cls || '';
  }

  function updateDraftStatusUI() {
    var el = document.getElementById('hl-save-status');
    if (!el || el.style.display === 'none') return;
    var ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (fileHandle) {
      el.textContent = 'Saving…';
      el.className = '';
    } else {
      el.textContent = 'Draft · ' + ts;
      el.className = 'draft';
    }
  }

  /* Updates <meta name="notebook-saved-at"> before serializing so the file knows its version */
  function ensureNotebookMeta() {
    var m = document.querySelector('meta[name="notebook-saved-at"]');
    if (!m) {
      m = document.createElement('meta');
      m.setAttribute('name', 'notebook-saved-at');
      document.head.appendChild(m);
    }
    m.setAttribute('content', new Date().toISOString());
  }

  function getHTML() {
    ensureNotebookMeta();
    return '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
  }

  /**
   * Filename for Link File / Export: use the SAME basename as this page's URL —
   * the last path segment ending in .html/.htm, URI-decoded (e.g. spaces).
   * Does NOT append "-export", "(1)", a second ".html", or "Study Notes + Quiz".
   * document.title is only a fallback when the URL path is not an .html file.
   */
  function suggestedFileName() {
    try {
      var path = location.pathname || '';
      var parts = path.split('/').filter(Boolean);
      var seg = parts.length ? parts[parts.length - 1] : '';
      if (seg && /\.html?$/i.test(seg)) {
        try {
          return decodeURIComponent(seg);
        } catch (decErr) {
          return seg;
        }
      }
    } catch (e) {}
    var t = (document.title || 'notebook').replace(/\s*[-–—]\s*Study Notes \+ Quiz\s*$/i, '').trim();
    if (!t) t = 'notebook';
    return /\.html?$/i.test(t) ? t : t + '.html';
  }

  function idbOpen() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(IDB_NAME, IDB_VER);
      req.onerror = function () { reject(req.error); };
      req.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
      };
      req.onsuccess = function () { resolve(req.result); };
    });
  }

  function idbPutHandle(handle) {
    return idbOpen().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).put(handle, KEY);
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }

  function idbGetHandle() {
    return idbOpen().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IDB_STORE, 'readonly');
        var r = tx.objectStore(IDB_STORE).get(KEY);
        r.onsuccess = function () { resolve(r.result); };
        r.onerror = function () { reject(r.error); };
      });
    });
  }

  function autoWrite() {
    if (!fileHandle) return;
    updateDraftStatusUI();
    fileHandle.createWritable().then(function (w) {
      return w.write(getHTML()).then(function () { return w.close(); });
    }).then(function () {
      var ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setStatus('Synced · ' + ts, 'linked');
      try {
        var prev = {};
        try { prev = JSON.parse(localStorage.getItem(META_KEY) || '{}'); } catch (e) {}
        prev.lastDiskWriteAt = Date.now();
        localStorage.setItem(META_KEY, JSON.stringify(prev));
      } catch (e2) {}
    }).catch(function (e) {
      setStatus('Sync error', 'error');
      console.error('Auto-save error:', e);
    });
  }

  function tryRestoreLinkedFile() {
    if (!('showSaveFilePicker' in window) || !window.indexedDB) return;
    idbGetHandle()
      .then(function (handle) {
        if (!handle) return null;
        if (!handle.queryPermission) {
          return handle.requestPermission
            ? handle.requestPermission({ mode: 'readwrite' }).then(function (s) {
                return s === 'granted' ? handle : null;
              })
            : Promise.resolve(handle);
        }
        return handle.queryPermission({ mode: 'readwrite' }).then(function (state) {
          if (state === 'granted') return handle;
          if (handle.requestPermission) {
            return handle.requestPermission({ mode: 'readwrite' }).then(function (s) {
              return s === 'granted' ? handle : null;
            });
          }
          return null;
        });
      })
      .then(function (handle) {
        if (!handle) return;
        fileHandle = handle;
        var ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setStatus('Linked · auto-save · ' + ts, 'linked');
        autoWrite();
      })
      .catch(function (e) {
        console.warn('Notebook: could not restore file link', e);
      });
  }

  function linkFile() {
    if (!('showSaveFilePicker' in window)) {
      exportHTML();
      return;
    }
    window
      .showSaveFilePicker({
        suggestedName: suggestedFileName(),
        types: [{ description: 'HTML File', accept: { 'text/html': ['.html'] } }]
      })
      .then(function (handle) {
        fileHandle = handle;
        setStatus('Linking…');
        return handle.createWritable();
      })
      .then(function (w) {
        return w.write(getHTML()).then(function () { return w.close(); });
      })
      .then(function () {
        return idbPutHandle(fileHandle);
      })
      .then(function () {
        var ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setStatus('Synced · ' + ts, 'linked');
        try {
          var prev = {};
          try { prev = JSON.parse(localStorage.getItem(META_KEY) || '{}'); } catch (e) {}
          prev.lastDiskWriteAt = Date.now();
          localStorage.setItem(META_KEY, JSON.stringify(prev));
        } catch (e2) {}
      })
      .catch(function (e) {
        if (e.name !== 'AbortError') {
          setStatus('Link error', 'error');
          console.error('Link error:', e);
        }
      });
  }

  /* ── Manual export fallback (Safari / Firefox) ── */
  function exportHTML() {
    var blob = new Blob([getHTML()], { type: 'text/html;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = suggestedFileName();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }

  /* ── Keyboard shortcuts: ⌘Z / ⌘⇧Z (only in edit mode) ── */
  document.addEventListener('keydown', function (e) {
    var toolbar = document.getElementById('hl-toolbar');
    if (!toolbar || !toolbar.classList.contains('editing')) return;
    var mod = e.metaKey || e.ctrlKey;
    if (mod && !e.shiftKey && e.key === 'z') { e.preventDefault(); undo(); }
    if (mod &&  e.shiftKey && e.key === 'z') { e.preventDefault(); redo(); }
    if (mod && e.key === 'y')                { e.preventDefault(); redo(); }
  });

  /* On load: show Export button if File System API not available */
  if (!('showSaveFilePicker' in window)) {
    document.getElementById('hl-btn-link').style.display   = 'none';
    document.getElementById('hl-btn-export').style.display = '';
    document.getElementById('hl-save-status').style.display = 'none';
  }

  /* ── Edit mode toggle ── */
  function enterEdit() {
    document.getElementById('hl-toolbar').classList.add('editing');
  }
  function exitEdit() {
    document.getElementById('hl-toolbar').classList.remove('editing');
    window.getSelection().removeAllRanges();
  }

  /* Expose functions for onclick handlers */
  window.applyMark     = applyMark;
  window.applyBold     = applyBold;
  window.applyCode     = applyCode;
  window.clearMark     = clearMark;
  window.revertToSaved = revertToSaved;
  window.clearAllMarks = clearAllMarks;
  window.exportHTML    = exportHTML;
  window.linkFile      = linkFile;
  window.enterEdit     = enterEdit;
  window.exitEdit      = exitEdit;
  window.undo          = undo;
  window.redo          = redo;

  restoreDraftOrPrompt().then(function () {
    hlHistory.push(snapshot());
    hlIndex = 0;
    refreshUndoRedo();
    if (!fileHandle) updateDraftStatusUI();
    tryRestoreLinkedFile();
  });
})();
