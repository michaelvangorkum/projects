import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";
import "./App.css";

function App() {
  const [folders, setFolders] = useState([
    {
      name: "Personal",
      notes: [
        { title: "Grocery List", content: "Eggs, Milk, Bread" },
        { title: "Workout Plan", content: "Push-ups, Sit-ups" },
      ],
      subfolders: [
        {
          name: "Health",
          notes: [{ title: "Diet Plan", content: "Low carb, high protein" }],
          subfolders: [],
        },
      ],
    },
    {
      name: "Work",
      notes: [
        { title: "Meeting Notes", content: "Discuss Q4 goals" },
        { title: "Project Ideas", content: "Build a React App" },
      ],
      subfolders: [],
    },
  ]);

  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(250);

  const handleMouseMove = (e) => {
    const newWidth = e.clientX;
    if (newWidth > 150 && newWidth < 400) setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = () => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const onAddFolder = (newFolder) => {
    const addFolderToParent = (parentFolder) => {
      if (parentFolder === selectedFolder) {
        return {
          ...parentFolder,
          subfolders: [...parentFolder.subfolders, newFolder],
        };
      }

      return {
        ...parentFolder,
        subfolders: parentFolder.subfolders.map(addFolderToParent),
      };
    };

    if (selectedFolder) {
      setFolders(folders.map(addFolderToParent));
    } else {
      setFolders([...folders, newFolder]);
    }
  };

  const onDeleteFolder = (folderToDelete) => {
    if (!window.confirm(`Are you sure you want to delete the folder "${folderToDelete.name}"?`)) {
      return;
    }

    const deleteFolderRecursively = (folderList) =>
      folderList
        .filter((folder) => folder !== folderToDelete)
        .map((folder) => ({
          ...folder,
          subfolders: deleteFolderRecursively(folder.subfolders),
        }));

    const updatedFolders = deleteFolderRecursively(folders);
    setFolders(updatedFolders);

    if (selectedFolder === folderToDelete) {
      setSelectedFolder(null);
      setSelectedNote(null);
    }
  };

  const onAddNote = (folderToUpdate) => {
    const newNote = { title: "New Note", content: "" };

    const addNoteToFolder = (folder) => {
      if (folder === folderToUpdate) {
        return {
          ...folder,
          notes: [...folder.notes, newNote],
        };
      }

      return {
        ...folder,
        subfolders: folder.subfolders.map(addNoteToFolder),
      };
    };

    const updatedFolders = folders.map(addNoteToFolder);
    setFolders(updatedFolders);

    setSelectedFolder((prevFolder) =>
      updatedFolders.find((folder) => folder.name === prevFolder?.name) || null
    );
    setSelectedNote(newNote);
  };

  const onUpdateNote = (updatedNote) => {
    const updateNotesInFolder = (folder) => {
      if (folder === selectedFolder) {
        return {
          ...folder,
          notes: folder.notes.map((note) =>
            note === selectedNote ? updatedNote : note
          ),
        };
      }

      return {
        ...folder,
        subfolders: folder.subfolders.map(updateNotesInFolder),
      };
    };

    const updatedFolders = folders.map(updateNotesInFolder);
    setFolders(updatedFolders);
    setSelectedFolder((prevFolder) =>
      updatedFolders.find((folder) => folder.name === prevFolder?.name)
    );
    setSelectedNote(updatedNote);
  };

  const onDeleteNote = () => {
    const deleteNoteFromFolder = (folder) => {
      if (folder === selectedFolder) {
        const updatedNotes = folder.notes.filter((note) => note !== selectedNote);
        return {
          ...folder,
          notes: updatedNotes,
        };
      }

      return {
        ...folder,
        subfolders: folder.subfolders.map(deleteNoteFromFolder),
      };
    };

    const updatedFolders = folders.map(deleteNoteFromFolder);
    setFolders(updatedFolders);
    setSelectedFolder((prevFolder) =>
      updatedFolders.find((folder) => folder.name === prevFolder?.name)
    );
    setSelectedNote(null);
  };

  return (
    <div className="App">
      <div
        className="sidebar-container"
        style={{
          width: `${sidebarWidth}px`,
          minWidth: "150px",
          maxWidth: "400px",
        }}
      >
        <Sidebar
          folders={folders}
          selectedFolder={selectedFolder}
          onFolderClick={(folder) => {
            setSelectedFolder(folder);
            setSelectedNote(folder.notes[0] || null);
          }}
          onNoteClick={(note) => setSelectedNote(note)}
          onAddFolder={(folder) =>
            onAddFolder({ name: folder.name, notes: [], subfolders: [] })
          }
          onDeleteFolder={onDeleteFolder}
          onAddNote={onAddNote}
        />
      </div>
      <div className="divider" onMouseDown={handleMouseDown} />
      <div className="note-editor-container">
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            onUpdate={onUpdateNote}
            onDelete={onDeleteNote}
          />
        ) : (
          <p className="placeholder">Select a note to edit</p>
        )}
      </div>
    </div>
  );
}

export default App;
