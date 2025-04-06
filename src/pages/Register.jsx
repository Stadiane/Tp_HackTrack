import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3002";

const schema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
});

export default function Register() {
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
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Erreur côté serveur");
      }

      const responseData = await res.json();
      console.log("Inscription réussie :", responseData);

      navigate("/login");
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      setErrorMessage("Une erreur est survenue. Vérifiez vos informations.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">Créer un compte</h2>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input type="text" className="form-control" {...register("name")} />
          <small className="text-danger">{errors.name?.message}</small>
        </div>

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
          {isSubmitting ? "Inscription..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}
