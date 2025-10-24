export default function Card({ title, description, link, lastUpdated }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-desc">{description}</p>
      {lastUpdated && <p className="card-date">Última actualización: {lastUpdated}</p>}
      <a href={link} className="btn btn-primary">
        Ver documentación →
      </a>
    </div>
  );
}
