// Notes action types
export const NOTES_ACTIONS = {
  LOAD: 'notes/loadNotes',
  CREATE: 'notes/createNote',
  UPDATE: 'notes/updateNote',
  DELETE: 'notes/deleteNote',
} as const;

// Future action types can go here
export const USER_ACTIONS = {
  LOGIN: 'user/login',
  LOGOUT: 'user/logout',
  REGISTER: 'user/register',
} as const;

export const SYNC_ACTIONS = {
  SYNC_START: 'sync/start',
  SYNC_COMPLETE: 'sync/complete',
  CONFLICT_DETECTED: 'sync/conflict',
} as const;
