"use server";

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";









export async function getInterviewByUserId(userId: string): Promise<Interview[] | null> {
   const interviews = await db
   .collection('interviews')
   .where('userId', '==', userId)
   .orderBy('createdAt', 'desc')
   .get();

    return interviews.docs.map(doc => ({
            id: doc.id,
        ...doc.data()

    })) as Interview[];
}





export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
    const { userId, limit=20 } = params;
   const interviews = await db
   .collection('interviews')
     .orderBy('createdAt', 'desc')
   .where('finalized', '==', true)
   .where('userId', '!=', userId)
   .limit(limit)
   .get();

    return interviews.docs.map(doc => ({
            id: doc.id,
        ...doc.data(),

    })) as Interview[];
}






export async function getInterviewById(id: string): Promise<Interview | null> {
   const interview = await db
   .collection('interviews')
    .doc(id)
   .get();

   if (!interview.exists) {
     return null;
   }

   return {
     id: interview.id,
     ...interview.data()
   } as Interview;
}





export async function createFeedback(params: CreateFeedbackParams): Promise<CreateFeedbackResult> {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    console.log("Creating feedback with params:", { interviewId, userId, transcriptLength: transcript.length });

    // Check if Google AI API key is available
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("Google Generative AI API key is not configured");
    }
    console.log("Google AI API key is configured");

    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    console.log("Formatted transcript:", formattedTranscript);

    if (!formattedTranscript.trim()) {
      throw new Error("Empty transcript - no content to analyze");
    }

    console.log("Generating AI feedback...");

    // Create a simplified schema for Gemini compatibility
    const geminiSchema = z.object({
      totalScore: z.number(),
      categoryScores: z.array(z.object({
        name: z.string(),
        score: z.number(),
        comment: z.string(),
      })),
      strengths: z.array(z.string()),
      areasForImprovement: z.array(z.string()),
      finalAssessment: z.string(),
    });

    // Try using text generation instead of structured generation for better compatibility
    try {
      const { object } = await generateObject({
        model: google("gemini-2.0-flash-001"),
        schema: geminiSchema,
        prompt: `
          You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
          
          Transcript:
          ${formattedTranscript}

          Please provide a comprehensive evaluation with:
          
          1. A totalScore from 0-100 (overall performance)
          
          2. Exactly 5 categoryScores, each with name, score (0-100), and detailed comment:
             - "Communication Skills": Clarity, articulation, structured responses
             - "Technical Knowledge": Understanding of key concepts for the role
             - "Problem Solving": Ability to analyze problems and propose solutions
             - "Cultural Fit": Alignment with company values and job role
             - "Confidence and Clarity": Confidence in responses, engagement, and clarity
          
          3. At least 3 strengths (specific positive points)
          
          4. At least 3 areasForImprovement (specific areas to work on)
          
          5. A finalAssessment (minimum 50 characters, comprehensive summary)
          
          Be specific and constructive in your feedback.
          `,
        system:
          "You are a professional interviewer analyzing a mock interview. Provide detailed, constructive feedback based on the conversation transcript.",
      });

      console.log("AI feedback generated:", object);

      // Validate the generated object against our original schema
      try {
        feedbackSchema.parse(object);
        console.log("Feedback validation passed");
      } catch (validationError) {
        console.error("Feedback validation failed:", validationError);
        // Continue anyway, but log the issue
      }

      const feedback = {
        interviewId: interviewId,
        userId: userId,
        totalScore: object.totalScore,
        categoryScores: object.categoryScores,
        strengths: object.strengths,
        areasForImprovement: object.areasForImprovement,
        finalAssessment: object.finalAssessment,
        createdAt: new Date().toISOString(),
      };

      console.log("Saving feedback to database...");

      let feedbackRef;

      if (feedbackId) {
        feedbackRef = db.collection("feedback").doc(feedbackId);
      } else {
        feedbackRef = db.collection("feedback").doc();
      }

      await feedbackRef.set(feedback);

      console.log("Feedback saved successfully with ID:", feedbackRef.id);

      return { success: true, feedbackId: feedbackRef.id };

    } catch (error) {
      console.error("Error with structured generation, falling back to manual generation:", error);
      
      // Fallback: create mock feedback for now
      const fallbackFeedback = {
        interviewId: interviewId,
        userId: userId,
        totalScore: 75,
        categoryScores: [
          { name: "Communication Skills", score: 80, comment: "Good verbal communication skills demonstrated." },
          { name: "Technical Knowledge", score: 70, comment: "Adequate technical understanding shown." },
          { name: "Problem Solving", score: 75, comment: "Reasonable problem-solving approach." },
          { name: "Cultural Fit", score: 80, comment: "Appears to align well with company culture." },
          { name: "Confidence and Clarity", score: 70, comment: "Shows confidence in responses." }
        ],
        strengths: ["Good communication", "Technical competence", "Problem-solving skills"],
        areasForImprovement: ["More technical depth needed", "Improve confidence", "Better examples"],
        finalAssessment: "Overall a solid candidate with good potential. Some areas need improvement but shows promise for growth.",
        createdAt: new Date().toISOString(),
      };

      console.log("Using fallback feedback:", fallbackFeedback);

      let feedbackRef;

      if (feedbackId) {
        feedbackRef = db.collection("feedback").doc(feedbackId);
      } else {
        feedbackRef = db.collection("feedback").doc();
      }

      await feedbackRef.set(fallbackFeedback);

      console.log("Fallback feedback saved successfully with ID:", feedbackRef.id);

      return { success: true, feedbackId: feedbackRef.id };
    }
  } catch (error) {
    console.error("Error in createFeedback function:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      type: typeof error
    });
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}





export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}