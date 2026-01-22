import React, { useEffect, useState } from "react";
import "./Rosliny.css";
import { useNavigate } from "react-router-dom";
import Komunikat from "./Komunikat";

const Rosliny = () => {
  const [rosliny, setRosliny] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtr, setFiltr] = useState("all");
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/rosliny")
      .then((response) => response.json())
      .then((data) => {
        setRosliny(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Błąd pobierania danych:", error);
        setLoading(false);
        showToast("Wystąpił błąd", "error");
      });
  }, []);

  const showToast = (message, type) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const usunRosline = (id) => {
    const potwierdz = window.confirm("Czy na pewno chcesz usunąć rekord?");

    if (!potwierdz) {
      return;
    }

    fetch(`http://localhost:8000/rosliny/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        setRosliny((prev) => prev.filter((r) => r.id !== id));
        showToast("Poprawnie zapisano zmiany", "success");
      })
      .catch(() => {
        showToast("Wystąpił błąd", "error");
      });
  };

  const modyfikujRosline = (id) => {
    navigate(`/rosliny/${id}`);
  };

  if (loading) {
    return <p>Ładowanie danych...</p>;
  }

  const filtrowaneRoslin = rosliny.filter((r) => {
    if (filtr === "-") return true;
    if (filtr === "true") return r.dostepnosc === true;
    if (filtr === "false") return r.dostepnosc === false;
    return true;
  });

  return (
    <div>
      <select value={filtr} onChange={(e) => setFiltr(e.target.value)}>
        <option value="-">Wszystkie</option>
        <option value="true">Dostępne</option>
        <option value="false">Niedostępne</option>
      </select>

      <div className="kafelki-container">
        {filtrowaneRoslin.map((roslina) => (
          <div className="kafelek" key={roslina.id}>
            <h3>Gatunek</h3>
            <p>{roslina.gatunek}</p>

            <h3>Cena</h3>
            <p>{roslina.cena} zł</p>

            <h3>Dostępność</h3>
            <p>{roslina.dostepnosc ? "Tak" : "Nie"}</p>

            <button onClick={() => usunRosline(roslina.id)}>Usuń</button>
            <button onClick={() => modyfikujRosline(roslina.id)}>Modyfikuj</button>
          </div>
        ))}
      </div>

      <div className="kafelki-container">
        <div className="kafelek">
          <button onClick={() => navigate("/rosliny/dodaj")}>Dodaj</button>
        </div>
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

export default Rosliny;
