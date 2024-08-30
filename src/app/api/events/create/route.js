// pages/api/events/create.js
import dbConnect from '@/lib/mongoDB'
import Event from '@/models/Event'
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await dbConnect()

      const session = await getSession({ req });
      if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { name, date, venue, guests } = req.body
      

      const newEvent = new Event({
        name,
        date,
        venue, 
        guests: guests.map(guest => ({
          name: guest.name,
          email: guest.email,
          phone: guest.phone,
        })),
        hostId: session.user.id, // Assuming you're associating it with the logged-in user
      })

      await newEvent.save()

      return res.status(201).json({ message: 'Event created successfully', event: newEvent })
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create event' })
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}
