import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { fetchHackathonDetails, createTeam, joinTeam } from "../services/api";
import AuthContext from "../context/AuthContext";
import BackButton from "../components/BackButton";

const Teams = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [hackathon, setHackathon] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const refreshHackathon = async () => {
    const data = await fetchHackathonDetails(id);
    setHackathon(data);
  };

  useEffect(() => {
    const loadHackathon = async () => {
      try {
        const data = await fetchHackathonDetails(id);
        setHackathon(data);
      } catch (error) {
        console.error("Erreur lors du chargement du hackathon", error);
      } finally {
        setLoading(false);
      }
    };
    loadHackathon();
  }, [id]);

  const isInTeam = hackathon?.teams?.some((team) =>
    team.members?.some((member) => member.id === user?.id)
  );

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      setMessage({ type: "error", text: "Le nom de l'équipe est requis." });
      return;
    }
    try {
      await createTeam(id, teamName, localStorage.getItem("token"));
      setMessage({ type: "success", text: "Équipe créée avec succès !" });
      setTeamName("");
      refreshHackathon();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Erreur lors de la création de l'équipe.",
      });
    }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      await joinTeam(teamId, localStorage.getItem("token"));
      setMessage({ type: "success", text: "Vous avez rejoint l'équipe !" });
      refreshHackathon();
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors de la tentative de rejoindre l'équipe.",
      });
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!hackathon) return <p>Hackathon non trouvé.</p>;

  return (
    <div className="container mt-4">
      <BackButton />
      <h2 className="text-primary">Équipes de {hackathon.name}</h2>
      {message && (
        <div
          className={`alert ${
            message.type === "success" ? "alert-success" : "alert-danger"
          }`}
        >
          {message.text}
        </div>
      )}

      <ul className="list-group">
        {hackathon.teams.length > 0 ? (
          hackathon.teams.map((team) => (
            <li
              key={team.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {team.name}
              {user && !isInTeam && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleJoinTeam(team.id)}
                >
                  Rejoindre
                </button>
              )}
            </li>
          ))
        ) : (
          <p>Aucune équipe pour l'instant.</p>
        )}
      </ul>

      {user && !isInTeam && (
        <div className="mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nom de l'équipe"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <button
            className="btn btn-success mt-2"
            disabled={!teamName.trim()}
            onClick={handleCreateTeam}
          >
            Créer une équipe
          </button>
        </div>
      )}
    </div>
  );
};

export default Teams;
