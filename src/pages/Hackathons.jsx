import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";

const API_URL = "http://localhost:3002";

export default function Hackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const limit = 3;

  const fetchHackathons = async (pageNumber) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_URL}/hackathons?page=${pageNumber}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      if (res.status === 200) {
        setHackathons(data);
        setHasNextPage(data.length === limit);
      } else {
        setError("Erreur lors du chargement des hackathons.");
      }
    } catch (err) {
      console.error("Erreur API :", err);
      setError("Erreur de connexion avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons(page);
  }, [page]);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => hasNextPage && setPage(page + 1);

  return (
    <div className="container mt-5">
      <BackButton />
      <h1 className="text-primary text-center">Hackathons disponibles</h1>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {loading ? (
        <p className="text-center mt-5">Chargement...</p>
      ) : hackathons.length === 0 ? (
        <p className="text-muted text-center">Aucun hackathon disponible.</p>
      ) : (
        hackathons.map((hackathon) => (
          <div className="mb-4" key={hackathon.id}>
            <div className="card shadow-sm w-100">
              <div className="card-body">
                <h5 className="card-title">{hackathon.name}</h5>
                <p className="card-text">
                  <strong>Date :</strong> {formatDate(hackathon.startDate)} →{" "}
                  {formatDate(hackathon.endDate)}
                </p>
                <p className="card-text">
                  <strong>Thème :</strong> {hackathon.theme}
                </p>
                <Link
                  to={`/hackathons/${hackathon.id}`}
                  className="btn btn-primary"
                >
                  Voir Détails
                </Link>
              </div>
            </div>
          </div>
        ))
      )}

      <div className="d-flex justify-content-center gap-3 mt-4">
        <button
          onClick={handlePrev}
          disabled={page <= 1}
          className="btn btn-outline-secondary"
        >
          ⬅️ Précédent
        </button>
        <span>Page {page}</span>
        <button
          onClick={handleNext}
          disabled={!hasNextPage}
          className="btn btn-outline-secondary"
        >
          Suivant ➡️
        </button>
      </div>
    </div>
  );
}
