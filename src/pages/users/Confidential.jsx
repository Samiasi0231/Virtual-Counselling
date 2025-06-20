import React from 'react';
import { FaCalendarAlt, FaUserGraduate, FaClock, FaFileAlt, FaExternalLinkAlt, FaShieldAlt } from 'react-icons/fa';

const DashboardCard = ({ title, icon, description, link, color }) => {
  return (
    <div className={`bg-white shadow-lg rounded-2xl p-5 border-t-4 ${color} transition duration-300 hover:shadow-xl`}>      
      <div className="flex items-center justify-between">
        <div className="text-3xl text-gray-700">{icon}</div>
        <div className="text-sm text-gray-500">{new Date().toLocaleDateString()}</div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-purple-600 hover:underline inline-flex items-center"
        >
          Open <FaExternalLinkAlt className="ml-1" size={12} />
        </a>
      )}
    </div>
  );
};

export default function CounselorDashboardCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <DashboardCard
        title="Confidentiality Consent"
        icon={<FaShieldAlt />}
        description="Students must accept the confidentiality agreement before sessions."
        link="/consent-policy"
        color="border-red-500"
      />
    </div>
  );
}
