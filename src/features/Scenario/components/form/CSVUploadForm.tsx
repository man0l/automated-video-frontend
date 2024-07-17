import React from 'react';
import { useForm, Controller } from 'react-hook-form';

interface CSVUploadFormProps {
  onSubmit: (templates: any[]) => void;
}

const CSVUploadForm: React.FC<CSVUploadFormProps> = ({ onSubmit }) => {
  const { handleSubmit, control, setError, clearErrors } = useForm();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    clearErrors();
    const file = event.target.files?.[0];
    if (!file) {
      setError('file', { type: 'manual', message: 'File is required' });
      return;
    }

    const text = await file.text();
    if (!text.trim()) {
      setError('file', { type: 'manual', message: 'File is empty' });
      return;
    }

    const rows = text.split('\n').filter(row => row.trim());
    if (rows.length === 0) {
      setError('file', { type: 'manual', message: 'File is empty' });
      return;
    }

    const headers = rows[0].split(',').map(header => header.trim());
    if (headers.length < 2 || headers[0] !== 'title' || headers[1] !== 'content') {
      setError('file', { type: 'manual', message: 'File must have "title" and "content" columns' });
      return;
    }

    if (rows.length === 1) {
      setError('file', { type: 'manual', message: 'File has only headers' });
      return;
    }

    const templates = rows.slice(1).map((row) => {
      const [title, content] = row.split(',');
      return { title, content };
    });

    onSubmit(templates);
  };

  return (
    <form onSubmit={handleSubmit(() => {})} className="space-y-6">
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Upload CSV</label>
        <Controller
          name="file"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <input
                {...field}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  error ? 'border-red-500' : 'focus:ring-blue-500'
                }`}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </>
          )}
        />
      </div>
    </form>
  );
};

export default CSVUploadForm;
