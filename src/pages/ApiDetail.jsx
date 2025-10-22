import { useParams } from "react-router-dom";
import apis from "../data/apis.json";
import RedocViewer from "../components/RedocViewer";

export default function ApiDetail() {
  const { id } = useParams();
  const api = apis.find((a) => a.id === id);

  if (!api) return <p>API no encontrada.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{api.name}</h2>
      <p className="text-slate-600">{api.description}</p>
      <RedocViewer specUrl={api.specUrl} />
    </div>
  );
}
