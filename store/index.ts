import { configureStore } from '@reduxjs/toolkit';
import { notesSlice } from './notesSlice';
export { deleteNote, updateNote } from './notesSlice';

// Create store
export const store = configureStore({
  reducer: {
    notes: notesSlice.reducer,
  },
});

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
