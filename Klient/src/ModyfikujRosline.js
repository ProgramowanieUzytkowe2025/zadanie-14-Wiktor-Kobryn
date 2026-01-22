import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Komunikat from "./Komunikat";

const ModyfikujRosline = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gatunek, setGatunek] = useState("");
  const [cena, setCena] = useState("");
  const [dostepnosc, setDostepnosc] = useState(false);
  const [error, setError] = useState("");
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8000/rosliny/${id}`)
      .then(res => res.json())
      .then(data => {
        setGatunek(data.gatunek);
        setCena(data.cena);
        setDostepnosc(data.dostepnosc);
      });
  }, [id]);

  const showToast = (message, type, callback) => {
    const toastId = Date.now();
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
    if (callback) {
      setTimeout(callback, 3000);
    }
  };

  const zapiszZmiany = (e) => {
    e.preventDefault();
    setError("");

    const url = id
      ? `http://localhost:8000/rosliny/${id}`
      : "http://localhost:8000/rosliny";

    const method = id ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gatunek,
        cena: Number(cena),
        dostepnosc
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || "Błąd serwera");
        }
        showToast("Poprawnie zapisano zmiany", "success", () => {
          navigate("/rosliny");
        });
      })
      .catch(err => {
        showToast("Wystąpił błąd", "error");
        setError(err.message);
      });
  };

  return (
    <div>
      <div>
        <h2>{id ? `Modyfikuj roślinę (ID: ${id})` : "Dodaj nową roślinę"}</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={zapiszZmiany}>
          <div>
            <label>Gatunek</label>
            <input value={gatunek} onChange={(e) => setGatunek(e.target.value)}/>
          </div>

          <div>
            <label>Cena</label>
            <input type="number" value={cena} onChange={(e) => setCena(e.target.value)}/>
          </div>

          <div>
            <label>
              <input type="checkbox" checked={dostepnosc} onChange={(e) => setDostepnosc(e.target.checked)}/>
              Dostępność
            </label>
          </div>

          <button type="submit">
            {id ? "Potwierdź modyfikacje" : "Dodaj roślinę"}
          </button>
        </form>
      </div>

      {toasts.map((t) => (
        <Komunikat
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() => setToasts((prev) => prev.filter(toast => toast.id !== t.id))}
        />
      ))}
    </div>
  );
};

export default ModyfikujRosline;
