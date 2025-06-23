import React, { useState } from 'react';

const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState('Counseling');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (message.trim() === '') return;

    console.log('Feedback Submitted:', {
      type: feedbackType,
      message,
    });

    setSubmitted(true);
    setMessage('');

    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
 
      <div className="overflow-auto mx-auto p-4 bg-white rounded-xl shadow">
        {/* Header */}
        <div className="bg-purple-700 text-white px-8 py-6">
          <h1 className="text-3xl font-bold">🗣️ Share Your Feedback</h1>
          <p className="text-sm mt-1 text-purple-200">
            Help us improve your experience with thoughtful feedback.
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          <div className="text-gray-800 space-y-6 text-base leading-relaxed">
            <div>
              <label className="font-semibold block mb-1">Feedback Type</label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="Counseling">Counseling</option>
                <option value="Platform">Student</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Your Message</label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us how your session went, or how the app could be improved..."
                className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="bg-purple-700 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-900 transition"
            >
              Submit Feedback
            </button>

            {submitted && (
              <p className="text-green-600 text-sm">Thank you for your feedback!</p>
            )}
          </div>
        </div>
      </div>

  );
};

export default Feedback;
