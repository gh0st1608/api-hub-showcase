import { useEffect, useState } from "react";
import Card from "../components/Card";

export default function Home() {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchManifest() {
      try {
        const res = await fetch("https://hub.solutionserj.com/manifest.json"); // dominio CloudFront
        const data = await res.json();
        setApis(data.designs);
      } catch (err) {
        console.error("Error al cargar manifest:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchManifest();
  }, []);

  if (loading) return <p className="text-center py-8">Cargando APIs...</p>;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="section-title">Catálogo de APIs</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {apis.map(api => (
          <Card
            key={api.id}
            title={api.name}
            description={api.description}
            lastUpdated={new Date(api.lastUpdated).toLocaleDateString()}
            link={api.html}
          />
        ))}
      </div>
    </main>
  );
}
