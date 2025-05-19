const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
import type { PrescriptionJson, IA3Cotation } from '../../types';

export async function interpreterPrescription(
  texte_prescription: string
): Promise<{
  texte_interprete: string;
  json_structuré: PrescriptionJson;
  cotations_ngap: IA3Cotation[];
}> {
  console.log("📡 Appel à interpreterPrescription");

  let res: Response;

  try {
    res = await fetch(`${API_URL}/interpreter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texte_prescription })
    });
    console.log("📥 Réponse reçue du backend");
  } catch (e) {
    console.error("💥 Erreur réseau :", e);
    throw new Error("Impossible de contacter le serveur.");
  }

  if (!res.ok) {
    const errText = await res.text();
    console.error("💥 Erreur HTTP :", res.status, errText);
    throw new Error(errText || `Erreur HTTP ${res.status}`);
  }

  const contentType = res.headers.get("content-type");
  console.log("🧾 Header content-type :", contentType);

  let rawText = '';
  try {
    rawText = await res.text();
    console.log("📦 Réponse texte brute :", rawText);
  } catch (e) {
    console.error("💥 Échec lors de la lecture du corps réponse :", e);
    throw new Error("Impossible de lire la réponse du serveur");
  }

  let data: unknown;
  try {
    data = JSON.parse(rawText);
    console.log("✅ JSON parsé avec succès");
  } catch (e) {
    console.error("💥 Erreur de parsing JSON :", e);
    throw new Error("Réponse du serveur illisible (non-JSON)");
  }

  const d = data as Record<string, unknown>;

  if (
    typeof d.texte_interprete !== 'string' ||
    typeof d.json_structuré !== 'object' ||
    !Array.isArray(d.cotations_ngap)
  ) {
    console.error("❌ Structure inattendue :", d);
    throw new Error("Données manquantes ou corrompues dans la réponse.");
  }

  const typedData = d as {
    texte_interprete: string;
    json_structuré: PrescriptionJson;
    cotations_ngap: IA3Cotation[];
  };

  return {
    texte_interprete: typedData.texte_interprete,
    json_structuré: typedData.json_structuré,
    cotations_ngap: typedData.cotations_ngap
  };
}
