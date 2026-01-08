import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import connectDB from './config/mongodb.js';

dotenv.config();

const cleanup = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        const count = await Question.countDocuments();
        console.log(`Found ${count} questions in the Question collection.`);

        const result = await Question.deleteMany({});
        console.log(`Deleted ${result.deletedCount} questions.`);

        console.log('Cleanup completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
};

cleanup();
