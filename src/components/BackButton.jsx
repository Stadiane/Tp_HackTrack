import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} className="btn btn-link mb-3">
      ←
    </button>
  );
}
