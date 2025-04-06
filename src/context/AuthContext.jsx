import { createContext, useState, useEffect } from "react";

const API_URL = "http://localhost:3002";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier l'utilisateur au chargement
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) throw new Error("Token invalide");

          const data = await res.json();
          setUser(data);
        } catch (error) {
          console.error(
            "Erreur lors de la vérification de l'utilisateur :",
            error
          );
          localStorage.removeItem("token");
          setUser(null);
        }
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  // S'inscrire
  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erreur d'inscription");
      }

      return {
        success: true,
        message: "Inscription réussie ! Connectez-vous.",
      };
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      return {
        success: false,
        message: error.message || "Erreur lors de l'inscription",
      };
    }
  };

  // Se connecter
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Connexion échouée");
      }

      const { token } = await res.json();
      localStorage.setItem("token", token);

      const userRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userRes.ok) throw new Error("Échec récupération profil");

      const userData = await userRes.json();
      setUser(userData);

      return { success: true, message: "Connexion réussie !" };
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      return {
        success: false,
        message: error.message || "Email ou mot de passe incorrect",
      };
    }
  };

  // Se déconnecter
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
