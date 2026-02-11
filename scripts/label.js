
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { Client, Users, Query } from 'node-appwrite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
dotenv.config({ path: join(__dirname, '../.env') });

// Initialize the Appwrite client
const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY); // Needs an API key with users.read and users.write scope

const users = new Users(client);

const LABEL_TO_REMOVE = 'premium';

async function removeLabelFromUsers() {
    try {
        console.log(`Searching for users with label: ${LABEL_TO_REMOVE}...`);

        // List users (Appwrite doesn't always support filtering by label directly in listUsers in older versions, 
        // but we can try Query.equal or list and filter client side if the set is small.
        // For large sets, we might need to iterate.
        // Let's assume we can fetch and filter.)

        // Note: 'labels' might not be a direct queryable attribute in all setups without cloud config.
        // We will fetch batches and filter in code to be safe.

        let hasMore = true;
        let lastId = null;
        let processedCount = 0;

        while (hasMore) {
            const queries = [Query.limit(100)];
            if (lastId) queries.push(Query.cursorAfter(lastId));

            const response = await users.list(queries);

            if (response.users.length === 0) {
                hasMore = false;
                break;
            }

            for (const user of response.users) {
                lastId = user.$id;

                if (user.labels && user.labels.includes(LABEL_TO_REMOVE)) {
                    const newLabels = user.labels.filter(l => l !== LABEL_TO_REMOVE);

                    try {
                        await users.updateLabels(user.$id, newLabels);
                        console.log(`Removed '${LABEL_TO_REMOVE}' from user: ${user.name} (${user.$id})`);
                        processedCount++;
                    } catch (updateErr) {
                        console.error(`Failed to update user ${user.$id}:`, updateErr.message);
                    }
                }
            }
        }

        console.log(`Operation complete. Removed label from ${processedCount} users.`);

    } catch (error) {
        console.error('Error listing users:', error);
    }
}

removeLabelFromUsers();
