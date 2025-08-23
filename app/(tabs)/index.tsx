import { Image } from 'expo-image';
import { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import NoteEditor from '@/components/NoteEditor';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createNote, deleteNote, updateNote } from '@/store/notesSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/index';
import { Note } from '../../types/index';

export default function NotesScreen() {
  const notes = useAppSelector((state) => state.notes.notes);
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  //View state management
  const [currentView, setCurrentView] = useState<'list' | 'editor'>('list');
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  //View management functions
  const openEditor = (note: Note) => {
    setEditingNote(note);
    setCurrentView('editor');
  };

  const closeEditor = () => {
    setEditingNote(null);
    setCurrentView('list');
  };

  //Note operations
  const handleAddNote = () => {
    Alert.prompt('New Note', 'Enter note title:', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Create',
        onPress: async (title) => {
          if (title?.trim()) {
            await dispatch(
              createNote({
                title: title.trim(),
                content: '',
              }),
            );
          }
        },
      },
    ]);
  };

  const handleEditNote = (note: Note) => {
    openEditor(note);
  };

  const handleDeleteNote = (note: Note) => {
    Alert.alert('Delete Note', `Are you sure you want to delete "${note.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteNote(note.id));
        },
      },
    ]);
  };

  const handleSaveNote = (noteId: string, title: string, content: string) => {
    dispatch(
      updateNote({
        id: noteId,
        updates: { title, content },
      }),
    );
    closeEditor();
  };

  //Render editor view
  if (currentView === 'editor' && editingNote) {
    return <NoteEditor note={editingNote} onSave={handleSaveNote} onCancel={closeEditor} />;
  }

  //Render list view (default)
  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Flux Notes</ThemedText>
        </ThemedView>

        {/* Notes */}
        {notes.length === 0 ? (
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">No notes yet</ThemedText>
            <ThemedText>
              Tap the <ThemedText type="defaultSemiBold">+</ThemedText> button to create your first
              note and start building your knowledge base.
            </ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Your Notes ({notes.length})</ThemedText>
            {notes.map((note) => (
              <TouchableOpacity
                key={note.id}
                style={styles.noteCard}
                onPress={() => handleEditNote(note)}
                activeOpacity={0.7}>
                <ThemedView style={styles.noteCardContent}>
                  <ThemedText type="defaultSemiBold" style={styles.noteTitle}>
                    {note.title}
                  </ThemedText>
                  <ThemedText style={styles.notePreview}>
                    {note.content ? note.content.substring(0, 100) + '...' : 'No content yet'}
                  </ThemedText>
                  <ThemedText style={styles.noteDate}>
                    Updated{' '}
                    {new Date(note.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </ThemedText>

                  {/* Action buttons */}
                  <ThemedView style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation(); // Prevent note opening
                        handleEditNote(note);
                      }}
                      style={styles.editButton}>
                      <ThemedText style={styles.editButtonText}>Edit</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation(); // Prevent note opening
                        handleDeleteNote(note);
                      }}
                      style={styles.deleteButton}>
                      <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                </ThemedView>
              </TouchableOpacity>
            ))}
          </ThemedView>
        )}

        {/* Description */}
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">What's Next?</ThemedText>
          <ThemedText>
            Add syntax highlighting for code snippets, collaborate with others in real-time, and
            sync across all your devices.
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[styles.addButton, { bottom: 52 + insets.bottom }]}
        onPress={handleAddNote}
        activeOpacity={0.8}>
        <ThemedText style={styles.addButtonText}>+</ThemedText>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  noteCard: {
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  noteCardContent: {
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  noteTitle: {
    fontSize: 16,
    marginBottom: 6,
  },
  notePreview: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  noteDate: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 28,
    color: 'white',
    fontWeight: '300',
    textAlign: 'center',
  },
});
