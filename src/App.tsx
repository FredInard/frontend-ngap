import { useState } from 'react';
import { interpreterPrescription } from './assets/services/api';
import type { PrescriptionJson, IA3Cotation } from './types';
import "./app.css"


function App() {
  const [texte, setTexte] = useState('');
  const [loading, setLoading] = useState(false);
  const [texteIA1, setTexteIA1] = useState('');
  const [jsonIA2, setJsonIA2] = useState<PrescriptionJson | null>(null);
  const [error, setError] = useState('');
  const [cotationsIA3, setCotationsIA3] = useState<IA3Cotation[] | null>(null);


  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setTexteIA1('');
    setJsonIA2(null);
    setCotationsIA3(null);

    try {
      console.log("🚀 Appel API en cours");
      setTimeout(() => {
        setLoading(false);
        setError("⏳ Timeout détecté (backend bloqué ?)");
        console.log("⏱️ Forçage timeout après 5s");
      }, 5000);

      const { texte_interprete, json_structuré, cotations_ngap } = await interpreterPrescription(texte);
        console.log("🧾 Cotations NGAP reçues :", cotations_ngap);  
        console.log("✔ Rendu après appel"); 
        console.log("✅ API OK", { texte_interprete, json_structuré, cotations_ngap });
        setTexteIA1(texte_interprete);
        setJsonIA2(json_structuré);
        setCotationsIA3(cotations_ngap);
    } catch (err: unknown) {
      console.error("💥 Erreur frontend :", err);
      if (err instanceof Error) setError(err.message);
    } finally {
      console.log("🔁 Fin d'exécution");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1> 🤔 Interprétation de prescription</h1>
      <textarea
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        rows={10}
        style={{ width: '100%', marginBottom: '1rem' }}
        placeholder="Colle ici la prescription à analyser..."
      />
      <button onClick={handleSubmit} disabled={loading || !texte.trim()}>
        {loading ? 'Analyse en cours...' : 'Envoyer'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {texteIA1 && (
        <>
          <h2>🧠 Texte interprété (IA1)</h2>
          <pre style={{ background: '#eee', padding: '1rem' }}>{texteIA1}</pre>
        </>
      )}

      {jsonIA2 && (
  <>
    <h2>📦 JSON structuré (IA2)</h2>
    <pre style={{ background: '#f0f0f0', padding: '1rem', textAlign: 'left' }}>
      {JSON.stringify(jsonIA2, null, 2)}
    </pre>
  </>
)}
{Array.isArray(cotationsIA3) && cotationsIA3.length > 0 && (

  <>
    <h2>🧾 Cotations NGAP (IA3)</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Acte</th>
          <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>ID</th>
          <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Cotation</th>
        </tr>
      </thead>
      <tbody>
        {cotationsIA3.map(({ acte, id, cotation }, index) => (
          <tr key={index}>
            <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{acte}</td>
            <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{id ?? '❌'}</td>
            <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{cotation ?? '❌'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
)}



    </div>
  );
}

export default App;
