import { Client, Databases, Query, ID } from "node-appwrite";


// Appwrite credentials
const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // e.g. https://cloud.appwrite.io/v1
  .setProject("")
  .setKey(""); // requires server key

const databases = new Databases(client);

// Config — replace these IDs
const DATABASE_ID = "";
const QUESTIONS_COLLECTION_ID = "questions";

const sourceContestId = ""; // e.g., "675abc123"
const targetContestId = ""; // e.g., "675xyz789"
const setAsDraft = true; // change to false if you want live clone

async function duplicateContestQuestions() {
  try {
    console.log(`Fetching questions from contest: ${sourceContestId}`);
    const srcQuestions = await databases.listDocuments(
      DATABASE_ID,
      QUESTIONS_COLLECTION_ID,
      [Query.equal("contest_id", sourceContestId)]
    );

    if (!srcQuestions.total) {
      console.log("No questions found for this contest.");
      return;
    }

    console.log(`Found ${srcQuestions.total} questions. Duplicating...`);

    for (const q of srcQuestions.documents) {
      const newQuestion = {
        contest_id: targetContestId,
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        answer: q.answer,
        marks: q.marks,
        // status: setAsDraft ? "draft" : q.status || "active",
      };

      await databases.createDocument(
        DATABASE_ID,
        QUESTIONS_COLLECTION_ID,
        ID.unique(),
        newQuestion
      );
    }

    console.log(
      `✅ Successfully duplicated ${srcQuestions.total} questions to contest ${targetContestId}`
    );
  } catch (err) {
    console.error("Error duplicating questions:", err);
  }
}

duplicateContestQuestions();
