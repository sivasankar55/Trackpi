import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import Admin from './models/Admin.js';

dotenv.config();

const createSuperAdmin = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Check if a super admin already exists
        const existingAdmin = await Admin.findOne({ adminType: 'super admin' });

        if (existingAdmin) {
            console.log('❌ Super admin already exists');
            process.exit(0);
        }

        // Create super admin
        const superAdmin = new Admin({
            username: 'superadmin',
            fullname: 'Super Admin',          // ✅ matches schema
            email: 'admin@trackpi.com',
            password: 'Admin@123',            // ✅ will be hashed by pre-save hook
            adminType: 'super admin'           // ✅ matches enum
        });

        await superAdmin.save();

        console.log('✅ Super admin created successfully');
        console.log('👉 Username: superadmin');
        console.log('👉 Password: Admin@123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating super admin:', error.message);
        process.exit(1);
    }
};

createSuperAdmin();