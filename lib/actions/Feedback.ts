import { NextApiRequest, NextApiResponse } from "next";
import { createFeedback } from "@/lib/actions/general.actions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { interviewId, userId, transcript } = req.body;

  try {
    const { success, feedbackId } = await createFeedback({
      interviewId,
      userId,
      transcript,
    });

    if (success && feedbackId) {
      return res.status(200).json({ success: true, feedbackId });
    } else {
      return res.status(500).json({ success: false });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
