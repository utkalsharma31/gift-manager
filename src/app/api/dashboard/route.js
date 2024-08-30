import dbConnect from "@/lib/mongoDB";
import Contribution from "@/models/Contribution";
import Event from "@/models/Event";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }


    const hostedEvents = await Event.find({ hostId: session.user.id });


    const receivedGifts = await Contribution.aggregate([
      { 
        $match: { 
          event: { $in: hostedEvents.map(event => event._id) } 
        } 
      },
      {
        $group: {
          _id: "$event",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "eventDetails",
        },
      },
      {
        $unwind: "$eventDetails",
      },
      {
        $project: {
          _id: 0,
          eventName: "$eventDetails.name",
          totalAmount: 1,
        },
      },
    ]);

        console.log("Received Gifts:", receivedGifts); 


    
    const contributedGifts = await Contribution.find({ "contributor.id": session.user.id })
      .populate("event", "title hostName")
      .lean();

      console.log("Contributed Gifts:", contributedGifts);
    

      const topContributors = await Contribution.aggregate([
      { $match: { event: { $in: hostedEvents.map(event => event._id) } } },
      {
        $group: {
          _id: "$contributor.id",
          name: { $first: "$contributor.name" },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 5 },
    ]);


    return new Response(
      JSON.stringify({
        receivedGifts,
        contributedGifts,
        topContributors,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}
