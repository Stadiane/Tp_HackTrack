const API_URL = "http://localhost:3002";

// Liste des hackathons avec pagination
export const fetchHackathons = async (page = 1, limit = 10) => {
  try {
    const res = await fetch(
      `${API_URL}/hackathons?page=${page}&limit=${limit}`
    );
    const data = await res.json();

    //Cas où backend renvoie juste un tableau
    if (Array.isArray(data)) {
      return {
        hackathons: data,
        totalPages: 1, // on fixe à 1
      };
    }
    return {
      hackathons: Array.isArray(data.hackathons) ? data.hackathons : [],
      totalPages: typeof data.totalPages === "number" ? data.totalPages : 1,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des hackathons :", error);
    return { hackathons: [], totalPages: 1 };
  }
};

// Détails d’un hackathon
export const fetchHackathonDetails = async (hackathonId) => {
  try {
    const res = await fetch(`${API_URL}/hackathons/${hackathonId}`);
    return await res.json();
  } catch (error) {
    console.error("Erreur lors de la récupération du hackathon :", error);
    return null;
  }
};

//Inscription
export const registerUser = async (name, email, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return await res.json();
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    throw error;
  }
};

// Connexion
export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await res.json(); // retourne le token
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw error;
  }
};

// Profil utilisateur
export const getUserProfile = async (token) => {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du profil utilisateur :",
      error
    );
    return null;
  }
};

// Créer une équipe
export const createTeam = async (hackathonId, teamName, token) => {
  try {
    const res = await fetch(`${API_URL}/teams/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: teamName, hackathonId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur création équipe");
    return data;
  } catch (error) {
    console.error("Erreur création équipe :", error);
    throw error;
  }
};

//  Rejoindre une équipe
export const joinTeam = async (teamId, token) => {
  try {
    const res = await fetch(`${API_URL}/teams/join/${teamId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Erreur pour rejoindre l'équipe");
    return data;
  } catch (error) {
    console.error("Erreur rejoindre équipe :", error);
    throw error;
  }
};

//  3 hackathons à venir
export const fetchUpcomingHackathons = async () => {
  try {
    const res = await fetch(`${API_URL}/hackathons/upcoming`);
    return await res.json();
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des hackathons à venir :",
      error
    );
    return [];
  }
};
