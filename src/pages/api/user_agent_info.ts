import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../db/dbConnect";
import { UserAgentModel } from "../../db/models";
import { serialize } from "cookie";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userData, id } = req.body;

  if (req.method === "POST") {
    const newId = uuidv4();
    try {
      dbConnect();
      const userAgent = new UserAgentModel({ visits: [userData], _id: newId });
      await userAgent.save();
    } catch (error) {
      console.error("Error creating UserAgent:", error);
      res.status(500).json({ error: "Failed to create userAgent" });
    }

    res.setHeader(
      "Set-Cookie",
      serialize(`user_agent_id`, newId, {
        httpOnly: false,
        secure: process.env.NODE_ENV !== "development",
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        sameSite: "strict",
        path: "/",
      })
    );
    res.status(200).json({ message: "userAgent registered" });
  } else if (req.method === "PUT") {
    try {
      dbConnect();
      await UserAgentModel.findByIdAndUpdate(id, {
        $push: { visits: userData },
      });

      res.status(200).json({ message: "UserAgent updated" });
    } catch (error) {
      console.error("Error updating UserAgent:", error);
      res.status(500).json({ error: "Failed to update userAgent" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
