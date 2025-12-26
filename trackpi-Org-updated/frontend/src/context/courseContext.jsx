import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CourseContext = createContext();

export const CourseProvider = ({ children } ) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllCourse = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/courses');
            setCourses(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllCourse();
    }, []);

    return (
        <CourseContext.Provider value={{ courses, loading }}>
            {children}
        </CourseContext.Provider>
    )
}