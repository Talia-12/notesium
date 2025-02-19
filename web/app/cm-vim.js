export function initCodeMirrorVimEx(notesiumState) {
  CodeMirror.Vim.defineEx('quit', 'q', (cm, cmd) => {
    const confirmIfModified = cmd.argString !== '!';
    if (cm.quit) cm.quit(confirmIfModified);
  });

  CodeMirror.Vim.defineEx('wq', '', (cm) => {
    if (cm.writequit) cm.writequit();
  });

  CodeMirror.Vim.defineEx('cmExecCommand', '', (cm, cmd) => {
    cm.execCommand(cmd.args[0]);
  });
  CodeMirror.Vim.map('zo', ':cmExecCommand unfold', 'normal');
  CodeMirror.Vim.map('zc', ':cmExecCommand fold', 'normal');
  CodeMirror.Vim.map('zR', ':cmExecCommand unfoldAll', 'normal');
  CodeMirror.Vim.map('zM', ':cmExecCommand foldAll', 'normal');
  CodeMirror.Vim.map('za', ':cmExecCommand toggleFold', 'normal');

  CodeMirror.Vim.defineEx('OpenLinkUnderCursor', '', (cm) => {
    if (!cm.openlink) return;
    const cursor = cm.getCursor();
    const lineContent = cm.getLine(cursor.line);
    const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const urlLinkRegex = /(?:https?:\/\/|www\.)[^\s)]+/g;
    let match;
    let link = null;
    while ((match = mdLinkRegex.exec(lineContent)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      if (cursor.ch >= start && cursor.ch <= end) { link = match[2]; break; }
    }
    if (!link) {
      while ((match = urlLinkRegex.exec(lineContent)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        if (cursor.ch >= start && cursor.ch <= end) { link = match[0]; break; }
      }
    }
    if (link) cm.openlink(link);
  });
  CodeMirror.Vim.map('ge', ':OpenLinkUnderCursor', 'normal');
  CodeMirror.Vim.map('gx', ':OpenLinkUnderCursor', 'normal');

  CodeMirror.Vim.defineEx('BodyKeyEvent', '', (cm, cmd) => {
    const key = cmd.args[0];
    const code = cmd.args[1];
    const ctrlKey = key.startsWith('<C')
    cm.display.input.blur();
    document.body.focus();
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: key, code: code, ctrlKey: ctrlKey, bubbles: true, cancelable: true, composed: true }));
  });
  CodeMirror.Vim.map('<Space>', ':BodyKeyEvent <Space> Space', 'normal');
  CodeMirror.Vim.map('<C-h>', ':BodyKeyEvent <C-h> KeyH', 'normal');
  CodeMirror.Vim.map('<C-l>', ':BodyKeyEvent <C-l> KeyL', 'normal');
  CodeMirror.Vim.map('<C-6>', ':BodyKeyEvent <C-o> Digit6', 'normal');
  CodeMirror.Vim.map('<C-h>', ':BodyKeyEvent <C-h> KeyH', 'insert');
  CodeMirror.Vim.map('<C-l>', ':BodyKeyEvent <C-l> KeyL', 'insert');
  CodeMirror.Vim.map('<C-6>', ':BodyKeyEvent <C-6> Digit6', 'insert');

  CodeMirror.Vim.defineOption('wrap', notesiumState.editorLineWrapping, 'boolean', [], (value, cm) => {
    if (cm) return; // option is global, do nothing for local
    if (value === undefined) return notesiumState.editorLineWrapping;
    notesiumState.editorLineWrapping = value;
    return value;
  });

  CodeMirror.Vim.defineOption('conceal', notesiumState.editorConcealFormatting, 'boolean', [], (value, cm) => {
    if (cm) return; // option is global, do nothing for local
    if (value === undefined) return notesiumState.editorConcealFormatting;
    notesiumState.editorConcealFormatting = value;
    return value;
  });

  CodeMirror.Vim.defineOption('fold', notesiumState.editorFoldGutter, 'boolean', [], (value, cm) => {
    if (cm) return; // option is global, do nothing for local
    if (value === undefined) return notesiumState.editorFoldGutter;
    notesiumState.editorFoldGutter = value;
    return value;
  });
}
