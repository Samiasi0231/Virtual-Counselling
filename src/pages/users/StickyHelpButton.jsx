import React, { useState } from 'react';

const StickyHelpButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-purple-700 text-white p-4 rounded-full shadow-lg hover:bg-purple-900 transition"
        title="Need Help?"
      >
        ❓
      </button>

      {/* Help Popup */}
      {open && (
        <div className="fixed bottom-20 right-6 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <h3 className="text-md font-semibold text-purple-800 mb-2">
            Need Help Right Now?
          </h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>
              🆘 <strong>Emergency:</strong>{' '}
              <a href="tel:1234567890" className="text-purple-700 underline">
                123-456-7890
              </a>
            </li>
            <li>
              💬 <strong>Live Chat:</strong>{' '}
              <button className="text-purple-700 underline" onClick={() => alert('Opening counselor chat...')}>
                Connect Now
              </button>
            </li>
            <li>
              📧 <strong>Email Support:</strong>{' '}
              <a href="mailto:support@counselingapp.com" className="text-purple-700 underline">
                support@counselingapp.com
              </a>
            </li>
          </ul>

          <button
            className="mt-3 text-xs text-gray-500 hover:underline"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default StickyHelpButton;
