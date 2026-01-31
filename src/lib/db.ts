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

type KidsPostDB = Dexie & {
	newspapers: EntityTable<SavedNewspaper, 'id'>;
	settings: EntityTable<AppSettings, 'key'>;
};

let _db: KidsPostDB | null = null;

export function getDb(): KidsPostDB {
	if (!_db) {
		_db = new Dexie('KidsPostDB') as KidsPostDB;

		_db.version(1).stores({
			newspapers: 'id, timestamp, gradeLevel'
		});

		_db.version(2).stores({
			newspapers: 'id, timestamp, gradeLevel',
			settings: 'key'
		});
	}
	return _db;
}
