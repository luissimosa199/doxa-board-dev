import { TimeLineModel } from "../../../db/models";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../db/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const id = req.query.id as string;
  if (req.method === "GET") {
    const timeline = await TimeLineModel.findById(id);
    if (timeline) {
      res.status(200).json(timeline);
    } else {
      res.status(404);
    }
  } else if (req.method === "PUT") {
    const body = JSON.parse(req.body);
    const timeline = await TimeLineModel.findById(id);

    if (timeline) {
      const updateResult = await TimeLineModel.updateMany(
        { _id: id },
        { $set: body }
      ).catch((err) => {
        console.error("Update Error:", err);
        res.status(500).json({ error: "Update Error" });
      });

      const updatedTimeline = await TimeLineModel.findById(id);

      if (updatedTimeline) {
        res.status(200).json(updatedTimeline);
      }
    } else {
      res.status(404).send({ message: "Timeline not found" });
    }
  }
}
