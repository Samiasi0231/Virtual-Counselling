import React, { useState } from "react";

const recommendedResources = [
  {
    id: 1,
    title: "Deep Breathing Exercises",
    type: "Video",
    link: "https://example.com/breathing-video",
    assignedTo: "Jane Doe",
  },
  {
    id: 2,
    title: "Coping with Anxiety - Article",
    type: "Article",
    link: "https://example.com/anxiety-article",
    assignedTo: "John Smith",
  },
];

const RecommendedMaterials = () => {
  const [materials, setMaterials] = useState(recommendedResources);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          🟢 Recommended Materials
        </h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          + Upload / Assign
        </button>
      </div>

      {materials.length === 0 ? (
        <p className="text-gray-500">No materials assigned yet.</p>
      ) : (
        <ul className="space-y-4">
          {materials.map((item) => (
            <li
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    Type: {item.type} • Assigned to: {item.assignedTo}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm underline mt-1 inline-block"
                  >
                    View Material
                  </a>
                </div>

                <div className="flex gap-2">
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecommendedMaterials;
