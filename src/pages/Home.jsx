import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3002";

export default function Home() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHackathons = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/hackathons`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        if (res.status === 200 && Array.isArray(data)) {
          const today = new Date();
          const upcoming = data
            .filter((item) => new Date(item.startDate) > today) //filtrer pour ne garder que les hackathons à venir
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate)) //trier par date de début croissante
            .slice(0, 3); //on garde les 3 prémiers
          setHackathons(upcoming);
        } else {
          throw new Error("Réponse inattendue de l'API.");
        }
      } catch (err) {
        console.error("Erreur API :", err);
        setError("Une erreur est survenue lors du chargement.");
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <>
      <div className="container mt-5">
        <h1 className="text-center text-primary">Bienvenue sur HackTrack</h1>
        <p className="text-center text-muted">
          Participez aux meilleurs hackathons en un clic !
        </p>

        <div className="my-4 p-4 bg-light rounded shadow-sm">
          <h3 className="text-dark">À propos</h3>
          <p>
            HackTrack est une plateforme pour découvrir, suivre et participer
            aux hackathons. Créez ou rejoignez une équipe et relevez des défis
            technologiques passionnants !
          </p>
        </div>

        <h4 className="mt-5 mb-3 text-primary">Prochains hackathons</h4>

        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : hackathons.length === 0 ? (
          <p className="text-muted text-center">
            Aucun hackathon à venir pour le moment.
          </p>
        ) : (
          <div className="row">
            {hackathons.map((hackathon) => (
              <div key={hackathon.id} className="col-md-4 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">{hackathon.name}</h5>
                    <p className="card-text">
                      <strong>Date :</strong> {formatDate(hackathon.startDate)}{" "}
                      → {formatDate(hackathon.endDate)}
                    </p>
                    <p className="card-text">
                      <strong>Thème :</strong> {hackathon.theme}
                    </p>
                    <button
                      onClick={() => navigate(`/hackathons/${hackathon.id}`)}
                      className="btn btn-sm btn-primary"
                    >
                      Voir plus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-4">
          <Link to="/hackathons" className="btn btn-outline-primary">
            Voir tous les hackathons
          </Link>
        </div>
      </div>
    </>
  );
}
