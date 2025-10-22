export default function Navbar() {
  return (
    <header className="bg-white shadow-sm py-4">
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold text-blue-600">API Hub</h1>
        <ul className="flex gap-6">
          <li><a href="/" className="text-slate-700 hover:text-blue-600">Inicio</a></li>
          <li><a href="/apis" className="text-slate-700 hover:text-blue-600">APIs</a></li>
          <li><a href="/docs" className="text-slate-700 hover:text-blue-600">Documentación</a></li>
        </ul>
      </nav>
    </header>
  );
}
