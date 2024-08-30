import dbConnect from "@/lib/mongoDB";
import Contribution from "@/models/Contribution";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req, res) {
  try {
    await dbConnect();
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const contributions = await Contribution.find({ "event.hostId": session.user.id });
    
    return res.status(200).json(contributions);
  } catch (error) {
    console.error("Error fetching received contributions:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
