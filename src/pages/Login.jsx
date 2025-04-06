import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const API_URL = "http://localhost:3002";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe incorrect"),
});

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setErrorMessage(null);
    try {
      // 1. Envoyer les identifiants
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!loginResponse.ok) {
        throw new Error("Échec de la connexion");
      }

      const { token } = await loginResponse.json();

      // 2. Stocker le token
      localStorage.setItem("token", token);

      // 3. Récupérer l'utilisateur
      const userResponse = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userResponse.ok) {
        throw new Error("Impossible de récupérer l'utilisateur");
      }

      const userData = await userResponse.json();
      setUser(userData);

      // 4. Redirection
      navigate("/hackathons");
    } catch (error) {
      setErrorMessage("Identifiants incorrects. Réessayez.");
      console.error("Erreur de connexion :", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">Connexion</h2>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" {...register("email")} />
          <small className="text-danger">{errors.email?.message}</small>
        </div>

        <div className="mb-3">
          <label className="form-label">Mot de passe</label>
          <input
            type="password"
            className="form-control"
            {...register("password")}
          />
          <small className="text-danger">{errors.password?.message}</small>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
