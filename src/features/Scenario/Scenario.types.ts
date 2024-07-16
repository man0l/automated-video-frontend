export interface Scenario {
    id: number;                      // Unique identifier for the scenario
    title: string;                   // Title or name of the scenario
    description: string;             // Brief description or overview
    content?: string;                // Detailed text or script (optional)
    status: 'draft' | 'published' | 'archived'; // Current status of the scenario
    tags?: string[];                 // Optional array of tags
    authorId: number;                // ID of the user who created the scenario
    createdAt: string;               // Creation timestamp
    updatedAt: string;               // Last update timestamp
  }
  
  export interface CreateScenarioPayload {
    title: string;
    description: string;
    content?: string;
    status: 'draft' | 'published' | 'archived';
    tags?: string[];
    authorId: number;
  }
  
  export interface UpdateScenarioPayload {
    title?: string;
    description?: string;
    content?: string;
    status?: 'draft' | 'published' | 'archived';
    tags?: string[];
  }
  