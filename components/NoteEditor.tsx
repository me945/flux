import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Note } from '../types';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface NoteEditorProps {
  note: Note;
  onSave: (noteId: string, title: string, content: string) => void;
  onCancel: () => void;
}

export default function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [hasChanges, setHasChanges] = useState(false);

  const insets = useSafeAreaInsets();

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setHasChanges(newTitle !== note.title || content !== note.content);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(title !== note.title || newContent !== note.content);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your note.');
      return;
    }

    onSave(note.id, title.trim(), content);
    setHasChanges(false);
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Stay', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: onCancel },
        ],
      );
    } else {
      onCancel();
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Sticky Header with action buttons */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <ThemedText style={styles.cancelText}>Cancel</ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.headerTitle}>Edit Note</ThemedText>

        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveButton, hasChanges && styles.saveButtonActive]}>
          <ThemedText style={[styles.saveText, hasChanges && styles.saveTextActive]}>
            Save
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Title input - outside scroll area */}
      <View style={styles.titleContainer}>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={handleTitleChange}
          placeholder="Note title..."
          multiline={false}
          returnKeyType="next"
          autoFocus={false}
        />
      </View>

      {/* Scrollable content area - only for note content */}
      <TextInput
        style={styles.contentInput}
        value={content}
        onChangeText={handleContentChange}
        placeholder="Start writing your note..."
        multiline={true}
        textAlignVertical="top"
        scrollEnabled={true}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff', // Ensure header has background
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  saveButtonActive: {
    backgroundColor: '#007AFF',
  },
  saveText: {
    fontSize: 16,
    color: '#999',
  },
  saveTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '700',
    padding: 0,
    color: '#333',
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    padding: 20,
    color: '#333',
    textAlignVertical: 'top',
  },
});
