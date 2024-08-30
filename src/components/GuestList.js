export default function GuestList({ guests = [] }) {
  if (!guests || guests.length === 0) {
    return (
      <p className="text-gray-600 italic">No guests found for this event.</p>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Guest List</h2>
      <ul className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
        {guests.map((guest, index) => (
          <li
            key={index}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
          >
            <div className="text-lg font-semibold text-gray-700">
              {guest.name}
            </div>
            <div className="text-sm text-gray-500">{guest.email}</div>
            <div className="text-sm text-gray-500">{guest.phone}</div>

            <div className="text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
