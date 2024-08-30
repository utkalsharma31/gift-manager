import dbConnect from '@/lib/mongoDB';
import Event from '@/models/Event';

export async function GET(req, { params }) {
  await dbConnect();

  const { email, phone } = params;

  try {
    const event = await Event.findOne({
      guests: { $elemMatch: { email, phone } },
    });

    if (!event) {
      return new Response(JSON.stringify({ error: 'Event not found for this guest' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(event), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
