// import { useState } from "react";

// export default function ContributionModal({ event, closeModal }) {
//     const [contribution, setContribution] = useState(0);
  
//     const handleContributionChange = (e) => {
//       setContribution(e.target.value);
//     };
  
//     const handleSubmit = async (e) => {
//       e.preventDefault();
  
//       try {
//         const response = await fetch(`/api/events/contribute`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ eventId: event._id, amount: contribution }),
//         });
  
//         if (response.ok) {
//           // Contribution added successfully
//           console.log("Contribution added successfully.");
//           closeModal();
//         } else {
//           console.error("Failed to add contribution.");
//         }
//       } catch (error) {
//         console.error("Error adding contribution:", error);
//       }
//     };
  
//     return (
//       <div className="modal-overlay">
//         <div className="modal-content bg-white p-6 rounded-lg shadow-lg">
//           <h2 className="text-2xl font-semibold mb-4">Add Contribution</h2>
//           <p>Event: {event.name}</p>
//           <form onSubmit={handleSubmit}>
//             <input
//               type="number"
//               value={contribution}
//               onChange={handleContributionChange}
//               placeholder="Contribution Amount"
//               className="w-full p-2 border rounded mb-4"
//               required
//             />
//             <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
//               Add Contribution
//             </button>
//             <button onClick={closeModal} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
//               Close
//             </button>
//           </form>
//         </div>
//       </div>
//     );
//   }
  