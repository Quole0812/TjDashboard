import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { FaChevronLeft, FaChevronRight, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import EventPopup from './EventPopup';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Math Club Meeting",
      date: "2025-05-15",
      startTime: "15:30",
      endTime: "16:30",
    },
    {
      id: 2,
      name: "Science Fair",
      date: "2025-05-20",
      startTime: "09:00",
      endTime: "14:00",
    },
    {
      id: 3,
      name: "Parent-Teacher Conference",
      date: "2025-05-25",
      startTime: "16:00",
      endTime: "19:00",
    },
    {
      id: 4,
      name: "School Assembly",
      date: "2025-06-02",
      startTime: "10:00",
      endTime: "11:00",
    },
    {
      id: 5,
      name: "Basketball Game",
      date: "2025-06-15",
      startTime: "17:00",
      endTime: "19:00",
    },
    {
      id: 6,
      name: "End of Year Party",
      date: "2025-06-20",
      startTime: "14:00",
      endTime: "17:00",
    }
  ]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const getEventsForDay = (day) => {
    return events.filter(event => event.date === format(day, 'yyyy-MM-dd'));
  };

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setShowPopup(true);
  };

  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setShowPopup(true);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleSubmitEvent = (eventData) => {
    if (currentEvent) {
      // Edit existing event
      setEvents(events.map(event => 
        event.id === currentEvent.id 
          ? { ...eventData, id: currentEvent.id } 
          : event
      ));
    } else {
      // Add new event
      const newEvent = {
        ...eventData,
        id: Date.now(), // Simple way to generate unique IDs
      };
      setEvents([...events, newEvent]);
    }
  };

  const formatDisplayTime = (time) => {
    if (!time) return '';
    
    // Convert 24-hour time format to 12-hour format with AM/PM
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth} className="nav-button">
          <FaChevronLeft size={20} />
        </button>
        <div className="month-title">
          <h2>{format(currentDate, 'MMMM yyyy')}</h2>
          <div className="month-subtitle">School Events Calendar</div>
        </div>
        <div className="header-controls">
          <button onClick={handleAddEvent} className="add-event-button">
            <FaPlus /> Add Event
          </button>
          <button onClick={nextMonth} className="nav-button">
            <FaChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="calendar-days">
          {days.map(day => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            return (
              <div 
                key={day.toString()} 
                className={`calendar-day ${isToday(day) ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
              >
                <span className="day-number">{format(day, 'd')}</span>
                <div className="day-events">
                  {dayEvents.map(event => (
                    <div key={event.id} className="event">
                      <div className="event-time">
                        {formatDisplayTime(event.startTime)} - {formatDisplayTime(event.endTime)}
                      </div>
                      <div className="event-name">{event.name}</div>
                      <div className="event-actions">
                        <button 
                          className="event-action edit" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvent(event);
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="event-action delete" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.id);
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EventPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onSubmit={handleSubmitEvent}
        initialEvent={currentEvent}
      />
    </div>
  );
};

export default Calendar; 