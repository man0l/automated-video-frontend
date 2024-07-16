// src/features/Scenario/components/ScenarioForm.tsx
import React, { useState } from 'react';
import { CreateScenarioPayload } from '../Scenario.types';

interface ScenarioFormProps {
  onSubmit: (scenario: CreateScenarioPayload) => void;
}

const ScenarioForm: React.FC<ScenarioFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [tags, setTags] = useState<string[]>([]);
  const [authorId, setAuthorId] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, content, status, tags, authorId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Title</label>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Description</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Content</label>
        <textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Status</label>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'archived')} 
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Tags</label>
        <input 
          value={tags.join(', ')} 
          onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))} 
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Author ID</label>
        <input 
          type="number" 
          value={authorId} 
          onChange={(e) => setAuthorId(Number(e.target.value))} 
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>
      <button 
        type="submit" 
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  );
};

export default ScenarioForm;
