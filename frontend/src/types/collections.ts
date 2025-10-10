// src/types/collections.ts
export interface SavedItem {
  id: string;
  dateSaved: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  collaborators?: string[];
  recipes: SavedItem[];
}
