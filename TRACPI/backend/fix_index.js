import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const fixIndex = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/test';
        console.log('Connecting to:', uri);
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;

        // List all collections
        const collections = await db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        const collectionName = 'users';
        if (!collections.some(c => c.name === collectionName)) {
            console.error(`Collection ${collectionName} not found!`);
            process.exit(1);
        }

        const collection = db.collection(collectionName);

        // Check indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', JSON.stringify(indexes, null, 2));

        // Drop googleId index if it exists
        const targetIndex = indexes.find(idx => idx.name === 'googleId_1' || (idx.key && idx.key.googleId));
        if (targetIndex) {
            console.log(`Dropping ${targetIndex.name} index...`);
            await collection.dropIndex(targetIndex.name);
            console.log(`Dropped ${targetIndex.name} index`);
        } else {
            console.log('googleId index not found');
        }

        console.log('Operation completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing index:', error);
        process.exit(1);
    }
};

fixIndex();
