import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextRequest, NextResponse } from "next/server";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function GET() {
  return NextResponse.json(
    { success: true, message: "THANK YOU" },
    { status: 200 }
  );
}
export async function POST(request: NextRequest) {
  const { type, role, level, techStack, amount, userid } = await request.json();

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
      The job role is ${role}.
      The job experience level is ${level}.
      The tech stack used in job is ${techStack}.
      The focus between behavioural and technical questions should lean towards: ${type}.
      The amount of questions required is ${amount}.
      Please return only the questions, without any additional text.
      The questions are going to read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
      Return the questions formatted like this:
      ["Question 1","Question 2","Question 3",]
      
      Thank you!.`,
    });

    const techstack = techStack?.trim()
      ? techStack.split(",").map((tech: any) => tech.trim())
      : [];

    const interview = {
      role,
      type,
      level,
      techStack: techstack,
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
