import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configure date-fns localizer
const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const StorageCalendar = () => {
  const [events, setEvents] = useState([]);
  const [slotInfo, setSlotInfo] = useState(null);

  // Load saved events
  useEffect(() => {
    const saved = localStorage.getItem('rbc-events');
    if (saved) setEvents(JSON.parse(saved));
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem('rbc-events', JSON.stringify(events));
  }, [events]);

  // Styling based on who created the event
  const eventStyleGetter = (event) => {
    const bg = event.createdBy === 'counselor' ? '#7C3AED' : '#10B981';
    return { style: { backgroundColor: bg, color: 'white', borderRadius: 4 } };
  };

  // Add or edit event in a prompt
  const handleSelect = ({ start, end, title, id }) => {
    const description = prompt('Describe the session:', title || '');
    if (!description) return;

    const metadata = prompt('Created by (counselor/student):', title ? events.find(ev => ev.id === id).createdBy : 'counselor');
    if (!metadata) return;

    const newEvent = { id: id ?? Date.now(), title: description, start, end, createdBy: metadata };

    setEvents(prev => (title
      ? prev.map(ev => ev.id === id ? newEvent : ev)
      : [...prev, newEvent]
    ));
  };

  return (
    <div className="p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        selectable
        onSelectSlot={handleSelect}
        onSelectEvent={handleSelect}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default StorageCalendar;
