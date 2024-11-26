import React, { useState } from "react";

function Folder({ folder, onFolderClick, onNoteClick, onAddNote, onDeleteFolder }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ marginLeft: "1rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <span onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "▼" : "▶"} {folder.name}
        </span>
        <button
          className="delete-folder-btn"
          onClick={(e) => {
            e.stopPropagation(); // Prevent expanding/collapsing when clicking delete
            onDeleteFolder(folder);
          }}
          style={{ marginLeft: "auto", marginRight: "0.5rem" }}
        >
          X
        </button>
      </div>

      {isExpanded && (
        <>
          <ul style={{ listStyleType: "none", paddingLeft: "1rem" }}>
            {folder.notes.map((note, index) => (
              <li
                key={index}
                className="note-item"
                onClick={() => onNoteClick(note)}
              >
                {note.title}
              </li>
            ))}
            <button
              className="add-note-btn"
              onClick={() => onAddNote(folder)} // Pass the current folder context
            >
              Add Note
            </button>
          </ul>

          {folder.subfolders.map((subfolder, index) => (
            <Folder
              key={index}
              folder={subfolder}
              onFolderClick={onFolderClick}
              onNoteClick={onNoteClick}
              onAddNote={onAddNote}
              onDeleteFolder={onDeleteFolder} // Pass the delete functionality
            />
          ))}
        </>
      )}
    </div>
  );
}

function Sidebar({
  folders,
  selectedFolder,
  onFolderClick,
  onNoteClick,
  onAddFolder,
  onAddNote,
  onDeleteFolder,
}) {
  const [newFolderName, setNewFolderName] = useState("");

  return (
    <div className="sidebar">
      <h3>Folders</h3>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {folders.map((folder, index) => (
          <Folder
            key={index}
            folder={folder}
            onFolderClick={onFolderClick}
            onNoteClick={onNoteClick}
            onAddNote={onAddNote}
            onDeleteFolder={onDeleteFolder}
          />
        ))}
      </ul>
      <input
        type="text"
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
        placeholder="New Folder Name"
        className="new-folder-input"
      />
      <button
        className="add-folder-btn"
        onClick={() => {
          if (newFolderName.trim()) {
            onAddFolder({ name: newFolderName, notes: [], subfolders: [] });
            setNewFolderName("");
          }
        }}
      >
        Add Folder
      </button>
    </div>
  );
}

export default Sidebar;
