// api/timeline
import { TimeLineModel } from "../../../db/models";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../db/dbConnect";
import { TimelineFormInputs } from "@/types";
import { generateSlug } from "@/utils/formHelpers";
import { uploadAssistantImage } from "@/utils/uploadAssistantImage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    const { tags, page } = req.query;
    const perPage = 10;
    const skip = page ? parseInt(page as string) * perPage : 0;

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      const regexPatterns = tagsArray.map((tag) => new RegExp(`^${tag}`, "i"));

      const response = await TimeLineModel.find({
        tags: { $in: regexPatterns },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean();

      res.status(200).json(response);
    } else {
      const response = await TimeLineModel.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean();
      res.status(200).json(response);
    }
  } else if (req.method === "POST") {
    let mainText, photo, length, tags, authorId, authorName, links;
    let baseSlug;

    if (typeof req.body === "object") {
      mainText = req.body.mainText;
      photo = [];

      for (const e of req.body.photo) {
        const image = await uploadAssistantImage(e.url);
        photo.push({
          url: image,
          idx: photo.length,
          caption: "",
        });
      }
      length = req.body.length || 0;
      tags = req.body.tags;
      authorId = req.body.authorId;
      authorName = req.body.authorName;
      links = req.body.links || [];

      baseSlug = generateSlug(req.body, 35, 50);

    } else {
      const body = JSON.parse(req.body) as TimelineFormInputs;

      mainText = body.mainText;
      photo = body.photo;
      length = body.length;
      tags = body.tags;
      authorId = body.authorId;
      authorName = body.authorName;
      links = body.links;

      baseSlug = generateSlug(JSON.parse(req.body), 35, 50);
    }

    let slug = baseSlug;

    let counter = 1;

    while (await TimeLineModel.exists({ urlSlug: slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const timeline = new TimeLineModel({
      mainText: mainText || "",
      photo: photo,
      length: length,
      tags: tags,
      links: links,
      authorId: authorId,
      authorName: authorName,
      urlSlug: slug,
    });

    await timeline.save();

    res.status(200).json(timeline.toJSON());
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
