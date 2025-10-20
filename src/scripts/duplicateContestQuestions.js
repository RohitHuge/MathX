import { Client, Databases, Query, ID } from "node-appwrite";


// Appwrite credentials
const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // e.g. https://cloud.appwrite.io/v1
  .setProject("68adcd200033ee482eba")
  .setKey("standard_e0e0611091dc8517170ed872365de6f3153b6f1ffb63efcfe05f28df695041f95e2ba575053efecdfcb4b0c46eaa2722bb7f456870fac06aebf46b11b763902a485c0363e83bf999030648b8df2c6bf4edbcc8f693f2d34cc0dc791c4ddb1eb45f83e307ca5ab8ae5222a644483a785e9b78fc9affe13d126999675f19c9e0b6"); // requires server key

const databases = new Databases(client);

// Config — replace these IDs
const DATABASE_ID = "68adceb9000bb9b8310b";
const QUESTIONS_COLLECTION_ID = "questions";

const sourceContestId = "68f4fed7e55d44957cc4"; // e.g., "675abc123"
const targetContestId = "68f6448c99155b136f4f"; // e.g., "675xyz789"
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
