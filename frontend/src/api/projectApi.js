const BASE_URL = "http://localhost:5000/api/projects";

export const fetchUserProjects = async (userId) => {
    try {
        const res = await fetch(`${BASE_URL}?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch projects");
        return await res.json();
    } catch (err) {
        console.error("Error fetching projects:", err);
        return { projects: [] };
    }
};
