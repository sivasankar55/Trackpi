import Contact from '../models/Contact.js';

// Submit a new contact form
export const submitContactForm = async (req, res) => {
    try {
        const { fullName, contactNumber, email, location, hearAboutUs, message } = req.body;

        const newContact = new Contact({
            fullName,
            contactNumber,
            email,
            location,
            hearAboutUs,
            message,
        });

        await newContact.save();

        res.status(201).json({ message: 'Message sent successfully!', contact: newContact });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Get all contact forms (for Admin)
export const getAllContacts = async (req, res) => {
    try {
        // efficient sorting by newest first
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Server error. Failed to fetch contacts.' });
    }
};
