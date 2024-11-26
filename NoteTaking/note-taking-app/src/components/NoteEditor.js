import React, { useState, useEffect } from 'react';

function NoteEditor({ note, onUpdate, onDelete }) {
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);
  const [currentLineIndex, setCurrentLineIndex] = useState(null);

  const lineHeight = 24; // Set a consistent line height

  useEffect(() => {
    setEditedTitle(note.title);
    setEditedContent(note.content);
  }, [note]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setEditedTitle(newTitle);
    onUpdate({ ...note, title: newTitle });
  };

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
    onUpdate({ ...note, content: e.target.value });
  };

  const handleCursorPosition = (e) => {
    const textArea = e.target;
    const cursorPosition = textArea.selectionStart;
    const lines = editedContent.split('\n');

    let charCount = 0;
    for (let i = 0; i < lines.length; i++) {
      charCount += lines[i].length + 1; // +1 for newline character
      if (cursorPosition <= charCount) {
        setCurrentLineIndex(i);
        break;
      }
    }
  };

  const indentLine = () => {
    const lines = editedContent.split('\n');
    lines[currentLineIndex] = `- ${lines[currentLineIndex]}`;
    const newContent = lines.join('\n');
    setEditedContent(newContent);
    onUpdate({ ...note, content: newContent });
  };

  const outdentLine = () => {
    const lines = editedContent.split('\n');
    if (lines[currentLineIndex]?.startsWith('- ')) {
      lines[currentLineIndex] = lines[currentLineIndex].substring(2).trim();
      const newContent = lines.join('\n');
      setEditedContent(newContent);
      onUpdate({ ...note, content: newContent });
    }
  };

  return (
    <div className="note-editor" style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <input
        type="text"
        value={editedTitle}
        onChange={handleTitleChange}
        placeholder="Note Title"
        style={{
          width: '100%',
          marginBottom: '1rem',
          padding: '0.5rem',
          fontSize: '1.2rem',
          borderRadius: '5px',
          border: '1px solid #ddd',
        }}
      />
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'stretch' }}>
        <div
          className="indent-buttons"
          style={{
            position: 'absolute',
            top: currentLineIndex * lineHeight,
            left: '-40px',
            display: currentLineIndex !== null ? 'flex' : 'none',
            flexDirection: 'column',
          }}
        >
          <button
            onClick={outdentLine}
            style={{
              marginBottom: '5px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.3rem 0.6rem',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            -
          </button>
          <button
            onClick={indentLine}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.3rem 0.6rem',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            +
          </button>
        </div>
        <textarea
          value={editedContent}
          onChange={handleContentChange}
          onClick={handleCursorPosition}
          onKeyUp={handleCursorPosition}
          style={{
            flex: "1 1 auto", // Allow it to resize freely
            resize: "both", // Allow resizing in both directions
            width: "auto",
            height: "auto",
            minWidth: "200px",
            minHeight: "150px",
            padding: "1rem",
            fontSize: "1rem",
            border: "1px solid #ddd",
            borderRadius: "5px",
            lineHeight: `${lineHeight}px`,
          }}
        />
      </div>
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'stretch' }}>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this note?')) {
              onDelete();
            }
          }}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteEditor;
