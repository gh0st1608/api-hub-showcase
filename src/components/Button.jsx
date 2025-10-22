export default function Button({ variant = "primary", children, ...props }) {
  return (
    <button {...props} className={`btn ${variant === "primary" ? "btn-primary" : "btn-outline"}`}>
      {children}
    </button>
  );
}
