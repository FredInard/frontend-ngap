const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function sendPrescription(text: string): Promise<string> {
  const res = await fetch(`${API_URL}/interpreter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ texte_prescription: text })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || `Erreur HTTP ${res.status}`);
  }

  return data.reponse_IA1;
}
