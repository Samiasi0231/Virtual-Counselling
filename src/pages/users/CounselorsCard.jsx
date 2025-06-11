import React from 'react';

const therapists = [
  {
    name: 'Toluse Francis',
    experience: '7 Years',
    price: 'female',
    image: '', 
    specialties: ['Anxiety', 'Depression', 'Workplace mental health', 'Relationship', 'Trauma'],
    languages: ['English', 'Yoruba'],
    options: ['chat', 'call']
  },
  {
    name: 'Abosede Akinpade',
    experience: '10 Years',
    Gender: 'male',
    image: '',
    specialties: [
      'Anxiety', 'Trauma', 'Grief', 'Bipolar Disorders', 'Psychosis', 'Depression',
      'Personality Assessment', 'Couples and Family Counselling', 'Substance Abuse',
      'Addictions (Gambling)', 'Pornography', 'Sex', 'Internet'
    ],
    languages: ['English', 'Yoruba'],
    options: ['chat', 'call']
  },

    {
    name: 'Toluse Francis',
    experience: '7 Years',
    price: 'female',
    image: '', 
    specialties: ['Anxiety', 'Depression', 'Workplace mental health', 'Relationship', 'Trauma'],
    languages: ['English', 'Yoruba'],
    options: ['chat', 'call']
  },
  {
    name: 'Abosede Akinpade',
    experience: '10 Years',
    Gender: 'male',
    image: '',
    specialties: [
      'Anxiety', 'Trauma', 'Grief', 'Bipolar Disorders', 'Psychosis', 'Depression',
      'Personality Assessment', 'Couples and Family Counselling', 'Substance Abuse',
      'Addictions (Gambling)', 'Pornography', 'Sex', 'Internet'
    ],
    languages: ['English', 'Yoruba'],
    options: ['chat', 'call']
  },
   {
    name: 'Toluse Francis',
    experience: '7 Years',
    price: 'female',
    image: '', 
    specialties: ['Anxiety', 'Depression', 'Workplace mental health', 'Relationship', 'Trauma'],
    languages: ['English', 'Yoruba'],
    options: ['chat', 'call']
  },
  {
    name: 'Abosede Akinpade',
    experience: '10 Years',
    Gender: 'male',
    image: '',
    specialties: [
      'Anxiety', 'Trauma', 'Grief', 'Bipolar Disorders', 'Psychosis', 'Depression',
      'Personality Assessment', 'Couples and Family Counselling', 'Substance Abuse',
      'Addictions (Gambling)', 'Pornography', 'Sex', 'Internet'
    ],
    languages: ['English', 'Yoruba'],
    options: ['chat', 'call']
  },
  
];

const TherapistCard = ({ therapist }) => (
  <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">
    <div className="flex items-center space-x-4 mb-4">
      <img src={therapist.image} alt={therapist.name} className="w-16 h-16 rounded-full" />
      <div>
        <h3 className="font-bold text-lg">{therapist.name}</h3>
        <p className="text-sm">Experience: {therapist.experience}</p>
        <p className="text-sm text-gray-600">Price: {therapist.Gender}</p>
      </div>
    </div>
    <div className="mb-2">
      <p className="font-semibold">Specialties:</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {therapist.specialties.map((tag, idx) => (
          <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
    <div className="mb-2">
      <p className="font-semibold">Languages:</p>
      <p>{therapist.languages.join(', ')}</p>
    </div>
    <div className="mb-4">
      <p className="font-semibold">Available Options:</p>
      <p>{therapist.options.join(', ')}</p>
    </div>
    <button className="bg-purple-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 w-full">
      Book
    </button>
  </div>
);

const Therapists = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 overflow-y-scroll">
      <h1 className="text-3xl font-bold mb-6 text-center">Counsellors</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {therapists.map((therapist, idx) => (
          <TherapistCard key={idx} therapist={therapist} />
        ))}
      </div>
    </div>
  );
};

export default Therapists;
