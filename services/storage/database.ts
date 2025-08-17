import * as SQLite from 'expo-sqlite';
import { Note } from '../../types';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    try {
      // Open or create database
      this.db = await SQLite.openDatabaseAsync('flux.db');

      // Create tables if they don't exist
      await this.createTables();

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private async createTables() {
    if (!this.db) throw new Error('Database not initialized');

    const createNotesTable = `
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        language TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        user_id TEXT NOT NULL,
        collaborators TEXT DEFAULT '[]'
      );
    `;

    await this.db.execAsync(createNotesTable);
  }

  // Get all notes
  async getNotes(): Promise<Note[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync(`
      SELECT * FROM notes 
      ORDER BY updated_at DESC
    `);

    return result.map(this.mapRowToNote);
  }

  // Add a new note
  async addNote(note: Note): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `
      INSERT INTO notes (id, title, content, language, created_at, updated_at, user_id, collaborators)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        note.id,
        note.title,
        note.content,
        note.language || null,
        note.createdAt,
        note.updatedAt,
        note.userId,
        JSON.stringify(note.collaborators),
      ],
    );
  }

  // Update an existing note
  async updateNote(id: string, updates: Partial<Note>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const setClause = [];
    const values = [];

    if (updates.title !== undefined) {
      setClause.push('title = ?');
      values.push(updates.title);
    }
    if (updates.content !== undefined) {
      setClause.push('content = ?');
      values.push(updates.content);
    }
    if (updates.language !== undefined) {
      setClause.push('language = ?');
      values.push(updates.language);
    }
    if (updates.collaborators !== undefined) {
      setClause.push('collaborators = ?');
      values.push(JSON.stringify(updates.collaborators));
    }

    // Always update the timestamp
    setClause.push('updated_at = ?');
    values.push(new Date().toISOString());

    values.push(id); // for WHERE clause

    await this.db.runAsync(
      `
      UPDATE notes 
      SET ${setClause.join(', ')} 
      WHERE id = ?
    `,
      values,
    );
  }

  // Delete a note
  async deleteNote(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
  }

  // Get a single note by ID
  async getNoteById(id: string): Promise<Note | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync('SELECT * FROM notes WHERE id = ?', [id]);

    return result ? this.mapRowToNote(result) : null;
  }

  // Helper to map database row to Note interface
  private mapRowToNote(row: any): Note {
    console.log('row', JSON.stringify(row, null, 4));
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      language: row.language,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      userId: row.user_id,
      collaborators: JSON.parse(row.collaborators || '[]'),
    };
  }

  // Clear all notes (useful for development/testing)
  async clearAllNotes(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM notes');
  }
}

// Export singleton instance
export const database = new DatabaseService();
