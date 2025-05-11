import { useState } from "react";
import { sendPrescription } from "../src/assets/services/api";
import "./App.css";

function App() {
  const [texte, setTexte] = useState("");
  const [reponse, setReponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleSubmit = async () => {
    if (!texte.trim()) return;

    setLoading(true);
    setErreur("");
    setReponse("");

    try {
      const result = await sendPrescription(texte);
      setReponse(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErreur(err.message);
      } else {
        setErreur("Erreur inconnue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "1rem" }}>
      <h2>🧠 Interpréteur de prescription NGAP</h2>
      <textarea
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        placeholder="Entrez une prescription ici..."
        style={{ width: "100%", height: "120px", padding: "1rem", fontSize: "1rem" }}
      />

      <button onClick={handleSubmit} disabled={loading || !texte.trim()} style={{ marginTop: "1rem" }}>
        {loading ? "Interprétation en cours..." : "Interpréter"}
      </button>

      {erreur && <p style={{ color: "red", marginTop: "1rem" }}>❌ {erreur}</p>}

      {reponse && (
        <pre style={{ marginTop: "2rem", background: "#f0f0f0", padding: "1rem", whiteSpace: "pre-wrap" }}>
          {reponse}
        </pre>
      )}
    </div>
  );
}

export default App;
