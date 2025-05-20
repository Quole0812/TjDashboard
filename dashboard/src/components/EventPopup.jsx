import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './EventPopup.css';

const EventPopup = ({ isOpen, onClose, onSubmit, initialEvent = null }) => {
  const [event, setEvent] = useState(
    initialEvent || { name: '', date: '', startTime: '', endTime: '' }
  );

  // Update form when initialEvent changes
  useEffect(() => {
    if (initialEvent) {
      setEvent(initialEvent);
    } else {
      setEvent({ name: '', date: '', startTime: '', endTime: '' });
    }
  }, [initialEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(event);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="event-popup-overlay">
      <div className="event-popup">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        <h2>{initialEvent ? 'Edit Event' : 'Add New Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Event Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={event.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={event.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={event.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={event.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="submit-button">
            {initialEvent ? 'Update Event' : 'Add Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventPopup; 