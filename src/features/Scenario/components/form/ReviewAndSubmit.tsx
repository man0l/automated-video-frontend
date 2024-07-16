import React from 'react';

interface ReviewAndSubmitProps {
  data: any;
  onSubmit: (data: any) => void;
  onBack: (data: any) => void;
}

const ReviewAndSubmit: React.FC<ReviewAndSubmitProps> = ({ data, onSubmit, onBack }) => {
  const handleBack = () => {
    onBack(data);
  };

  const handleSubmit = () => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review and Submit</h2>
      <div>
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <p><strong>Title:</strong> {data.title}</p>
        <p><strong>Description:</strong> {data.description}</p>
        <p><strong>Status:</strong> {data.status}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Templates and Tags</h3>
        <p><strong>Template:</strong> {data.template ? data.template.title : 'None'}</p>
        <p><strong>Tags:</strong> {data.tags.join(', ')}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Content</h3>
        <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ReviewAndSubmit;
