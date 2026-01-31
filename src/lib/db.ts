import Dexie, { type EntityTable } from 'dexie';
import type { NewspaperData } from './types';

export interface SavedNewspaper {
	id: string;
	timestamp: number;
	gradeLevel: string;
	data: NewspaperData;
}

export interface AppSettings {
	key: string;
	value: string;
}

const db = new Dexie('KidsPostDB') as Dexie & {
	newspapers: EntityTable<SavedNewspaper, 'id'>;
	settings: EntityTable<AppSettings, 'key'>;
};

// Schema declaration
db.version(1).stores({
	newspapers: 'id, timestamp, gradeLevel' // Primary key and indexed props
});

// Bump version to add settings table
db.version(2).stores({
	newspapers: 'id, timestamp, gradeLevel', // Primary key and indexed props
	settings: 'key' // Key-value store for app settings
});

export { db };
