export async function fetchEvents() {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) {
        throw new Error(`Failed to fetch events: ${res.status}`);
      } 
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching events:', error.message);
      return [];
    }
  }
  