import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import BackButton from "../components/BackButton";

const API_URL = "http://localhost:3002";

export default function HackathonDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadHackathon = async () => {
      try {
        const res = await fetch(`${API_URL}/hackathons/${id}`);
        const data = await res.json();
        setHackathon(data);
      } catch (error) {
        console.error("Erreur lors du chargement du hackathon :", error);
      } finally {
        setLoading(false);
      }
    };

    loadHackathon();
  }, [id]);

  const handleJoinTeam = async (teamId) => {
    if (!user) {
      alert("Connectez-vous pour rejoindre une équipe.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/teams/join/${teamId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage({ type: "success", text: "Équipe rejointe avec succès !" });

      // Refresh les données
      const refresh = await fetch(`${API_URL}/hackathons/${id}`);
      const updated = await refresh.json();
      setHackathon(updated);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Erreur." });
    }
  };

  const handleCreateTeam = async () => {
    if (!user || !teamName.trim()) {
      setMessage({ type: "error", text: "Nom d'équipe obligatoire." });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/teams/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: teamName,
          hackathonId: parseInt(id),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage({ type: "success", text: "Équipe créée avec succès." });
      setTeamName("");

      // Refresh les données
      const refresh = await fetch(`${API_URL}/hackathons/${id}`);
      const updated = await refresh.json();
      setHackathon(updated);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Erreur." });
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  if (loading) return <p className="text-center mt-5">Chargement...</p>;
  if (!hackathon)
    return <p className="text-center mt-5">Hackathon introuvable.</p>;

  return (
    <div className="container mt-4">
      <BackButton />
      <h1 className="text-primary">{hackathon.name}</h1>
      <p>
        <strong>Date :</strong> {formatDate(hackathon.startDate)} →{" "}
        {formatDate(hackathon.endDate)}
      </p>
      <p>
        <strong>Thème :</strong> {hackathon.theme}
      </p>
      <p>
        <strong>Description:</strong> {hackathon.description}
      </p>

      {message && (
        <div
          className={`alert alert-${
            message.type === "success" ? "success" : "danger"
          }`}
        >
          {message.text}
        </div>
      )}

      <h3 className="mt-4">Équipes inscrites</h3>
      {hackathon.teams?.length === 0 ? (
        <p>Aucune équipe pour l’instant.</p>
      ) : (
        <ul className="list-group">
          {hackathon.teams.map((team) => (
            <li
              key={team.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                {team.name}{" "}
                <span className="badge bg-secondary">
                  {team.users.length} membre{team.users.length > 1 ? "s" : ""}
                </span>
              </div>
              {user && (
                <button
                  onClick={() => handleJoinTeam(team.id)}
                  className="btn btn-sm btn-outline-success"
                >
                  Rejoindre
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {user && (
        <div className="mt-4">
          <h4>Créer une équipe</h4>
          <input
            type="text"
            className="form-control my-2"
            placeholder="Nom de l'équipe"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <button onClick={handleCreateTeam} className="btn btn-primary">
            Créer l’équipe
          </button>
        </div>
      )}
    </div>
  );
}
