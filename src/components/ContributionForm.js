"use client";
 
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ContributionForm({ eventId, onFetchUpdatedEvents }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const contributionData = {
      phoneNumber,
      amount,
      eventId,
    };

    try {
      const response = await fetch(`/api/contributions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contributionData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage("Contribution added successfully!");
        setErrorMessage("");
        setPhoneNumber("");
        setAmount("");

        if (onFetchUpdatedEvents) {
          await onFetchUpdatedEvents();
        }


      } else {
        const result = await response.json();
        setErrorMessage(result.error || "Failed to add contribution. Please try again.");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Contribution Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Add Contribution
      </button>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </form>
  );
}
