import { NOTES_ACTIONS } from '@/constants/actions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid/non-secure';
import { database } from '../services/storage/database';
import { Note } from '../types/index';

const { LOAD, CREATE, UPDATE, DELETE } = NOTES_ACTIONS;

//Notes functions ( load notes when loading the app )
export const loadNotes = createAsyncThunk(LOAD, async () => {
  return await database.getNotes();
});

export const createNote = createAsyncThunk(
  CREATE,
  async (noteData: { title: string; content: string }) => {
    const newNote: Note = {
      id: nanoid(),
      title: noteData.title,
      content: noteData.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'temp-user',
      collaborators: [],
    };

    // Save to database
    await database.addNote(newNote);
    return newNote;
  },
);

export const updateNote = createAsyncThunk(
  UPDATE,
  async ({ id, updates }: { id: string; updates: Partial<Note> }) => {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await database.updateNote(id, updatedData);
    return { id, updates: updatedData };
  },
);

export const deleteNote = createAsyncThunk('notes/deleteNote', async (id: string) => {
  await database.deleteNote(id);
  return id;
});

// Simple notes state
interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
};

// Simple notes slice
export const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(loadNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load notes';
      })
      .addCase(createNote.fulfilled, (state, action) => {
        // Only add if not already exists
        const existingIndex = state.notes.findIndex((n) => n.id === action.payload.id);
        if (existingIndex === -1) {
          state.notes.unshift(action.payload); // Add to beginning
        }
      })

      .addCase(updateNote.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const note = state.notes.find((n) => n.id === id);
        if (note) {
          Object.assign(note, updates);
        }
      })

      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter((note) => note.id !== action.payload);
      });
  },
});

// Export actions
export const { clearError } = notesSlice.actions;
export default notesSlice.reducer;
