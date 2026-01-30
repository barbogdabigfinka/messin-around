/**
 * TaskTagsPanel component
 * Displays and manages tags for a task
 */

import React, { useState } from 'react';
import '../styles/TaskTagsPanel.css';

interface TaskTagsPanelProps {
  /** Existing tags for the task */
  tags?: string[];
  /** All available tags */
  availableTags: string[];
  /** Callback when tags are updated */
  onTagsChange: (tags: string[]) => void;
}

/**
 * Component for managing task tags
 */
export default function TaskTagsPanel({
  tags = [],
  availableTags,
  onTagsChange,
}: TaskTagsPanelProps) {
  const [newTag, setNewTag] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const updated = [...tags, trimmedTag];
      onTagsChange(updated);
      setNewTag('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveTag = (tag: string) => {
    const updated = tags.filter(t => t !== tag);
    onTagsChange(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(newTag);
    }
  };

  const suggestions = availableTags.filter(
    tag =>
      tag.toLowerCase().includes(newTag.toLowerCase()) &&
      !tags.includes(tag)
  );

  return (
    <div className="task-tags-panel">
      <h4 className="tags-title">Tags</h4>

      {/* Existing tags */}
      <div className="tags-container">
        {tags.length === 0 ? (
          <p className="no-tags">No tags yet. Add one below!</p>
        ) : (
          tags.map(tag => (
            <div key={tag} className="tag-badge">
              <span className="tag-label">#{tag}</span>
              <button
                className="tag-remove"
                onClick={() => handleRemoveTag(tag)}
                aria-label={`Remove tag ${tag}`}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add tag input */}
      <div className="tag-input-wrapper">
        <input
          type="text"
          className="tag-input"
          placeholder="Add new tag..."
          value={newTag}
          onChange={e => {
            setNewTag(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onFocus={() => newTag && setShowSuggestions(true)}
        />
        <button
          className="tag-add-btn"
          onClick={() => handleAddTag(newTag)}
          aria-label="Add tag"
        >
          +
        </button>

        {/* Tag suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="tag-suggestions">
            {suggestions.map(tag => (
              <button
                key={tag}
                className="suggestion-item"
                onClick={() => handleAddTag(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
