// app/index.tsx
import { loadNotes } from '@/store/notesSlice';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { database } from '../services/storage/database';

export default function IndexScreen() {
  const dispatch = useAppDispatch();
  const { notes, loading } = useAppSelector((state) => state.notes);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize database
        await database.init();
        console.log('Database initialized');

        // Load notes from database
        await dispatch(loadNotes());
        console.log('Notes loaded');

        // Navigate to main app
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, [dispatch]);

  // Show loading screen while initializing
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10 }}>Loading Flux...</Text>
    </View>
  );
}
