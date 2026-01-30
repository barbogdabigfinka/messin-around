/**
 * TaskNotesPanel component
 * Displays and manages notes for a task
 */

import React, { useState, useEffect } from 'react';
import '../styles/TaskNotesPanel.css';

interface TaskNotesPanelProps {
  /** Initial notes content */
  initialNotes?: string;
  /** Callback when notes are saved */
  onSaveNotes: (notes: string) => void;
  /** Whether notes are being saved */
  isSaving?: boolean;
}

/**
 * Component for managing task notes
 */
export default function TaskNotesPanel({
  initialNotes = '',
  onSaveNotes,
  isSaving = false,
}: TaskNotesPanelProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setNotes(initialNotes);
    setHasChanges(false);
  }, [initialNotes]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setHasChanges(e.target.value !== initialNotes);
  };

  const handleSave = () => {
    onSaveNotes(notes);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setNotes(initialNotes);
    setHasChanges(false);
  };

  const characterCount = notes.length;
  const maxCharacters = 2000;

  return (
    <div className="task-notes-panel">
      <h4 className="notes-title">Notes</h4>

      <textarea
        className="notes-input"
        placeholder="Add detailed notes for this task..."
        value={notes}
        onChange={handleNotesChange}
        maxLength={maxCharacters}
        disabled={isSaving}
        aria-label="Task notes"
      />

      <div className="notes-footer">
        <span className="character-count">
          {characterCount}/{maxCharacters}
        </span>

        <div className="notes-actions">
          {hasChanges && (
            <>
              <button
                className="notes-btn notes-cancel"
                onClick={handleCancel}
                disabled={isSaving}
                aria-label="Cancel changes"
              >
                Cancel
              </button>
              <button
                className="notes-btn notes-save"
                onClick={handleSave}
                disabled={isSaving}
                aria-label="Save notes"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
