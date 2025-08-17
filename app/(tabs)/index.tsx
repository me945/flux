import { Image } from 'expo-image';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createNote, deleteNote, updateNote } from '@/store/notesSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/index';
import { Note } from '../../types/index';

// Option 1: DD/MM/YYYY, HH:MM
// new Date(note.updatedAt).toLocaleDateString('en-GB', {
//   day: '2-digit', month: '2-digit', year: 'numeric',
//   hour: '2-digit', minute: '2-digit', hour12: false
// })
// Result: "01/08/2025, 17:03"

// Option 2: More readable
// new Date(note.updatedAt).toLocaleDateString('en-US', {
//   month: 'short', day: 'numeric', year: 'numeric',
//   hour: '2-digit', minute: '2-digit', hour12: false
// })
// Result: "Aug 1, 2025, 17:03"

// Option 3: Just date
// new Date(note.updatedAt).toLocaleDateString('en-GB')
// Result: "01/08/2025"

export default function NotesScreen() {
  const notes = useAppSelector((state) => state.notes.notes);
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  console.log('Redux notes:', notes);
  console.log('Number of notes:', notes.length);

  //Show pop-up/alert
  const handleAddNote = () => {
    Alert.prompt('New Note', 'Enter note title:', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Create',
        onPress: async (title) => {
          if (title?.trim()) {
            // Create note in database AND Redux
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

  // Add these functions inside your NotesScreen component (after the handleAddNote function)

  const handleEditNote = (note: Note) => {
    Alert.prompt(
      'Edit Note',
      'Edit note title:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: (newTitle) => {
            if (newTitle?.trim() && newTitle.trim() !== note.title) {
              dispatch(
                updateNote({
                  id: note.id,
                  updates: { title: newTitle.trim() },
                }),
              );
            }
          },
        },
      ],
      'plain-text',
      note.title, // Pre-fill with current title
    );
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

  const renderNote = ({ item }: { item: Note }) => (
    <ThemedView style={styles.noteCard}>
      <ThemedText type="defaultSemiBold" style={styles.noteTitle}>
        {item.title}
      </ThemedText>
      <ThemedText style={styles.notePreview}>
        {item.content ? item.content.substring(0, 80) + '...' : 'No content yet'}
      </ThemedText>
      <ThemedText style={styles.noteDate}>
        {new Date(item.updatedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </ThemedText>
    </ThemedView>
  );

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
              <ThemedView key={note.id} style={styles.noteCard}>
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

                {/* Simple edit/delete buttons */}
                <ThemedView style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                  <TouchableOpacity
                    onPress={() => handleEditNote(note)}
                    style={{ padding: 8, backgroundColor: '#007AFF', borderRadius: 4 }}>
                    <ThemedText style={{ color: 'white', fontSize: 12 }}>Edit</ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteNote(note)}
                    style={{ padding: 8, backgroundColor: '#FF3B30', borderRadius: 4 }}>
                    <ThemedText style={{ color: 'white', fontSize: 12 }}>Delete</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
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
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
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
