import Card from "../components/Card";

export default function Home() {
  const apis = [
    {
      id: "telemedicine",
      title: "Telemedicine API",
      description: "Gestión de consultas médicas virtuales y videollamadas.",
      link: "/api/telemedicine",
    },
    {
      id: "claims",
      title: "Claims API",
      description: "Gestión de reclamos e incidencias del sistema.",
      link: "/api/claims",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="section-title">Catálogo de APIs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {apis.map(api => (
          <Card key={api.id} title={api.title} description={api.description} link={api.link} />
        ))}
      </div>
    </main>
  );
}
