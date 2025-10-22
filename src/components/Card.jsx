export default function Card({ title, description, link }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-desc">{description}</p>
      <a href={link} className="btn btn-primary">
        Ver documentación →
      </a>
    </div>
  );
}
