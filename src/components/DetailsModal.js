export default function DetailsModal({ event, closeModal }) {
    if (!event) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
          <p><strong>Name:</strong> {event.name}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Venue:</strong> {event.venue}</p>
          <p><strong>Host:</strong> {event.hostId.name}</p>
  
          <h3 className="mt-4 mb-2 font-semibold">Guests:</h3>
          <ul>
            {event.guests.map((guest) => (
              <li key={guest._id}>{guest.name} ({guest.email})</li>
            ))}
          </ul>
  
          <button onClick={closeModal} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Close
          </button>
        </div>
      </div>
    );
  }
  