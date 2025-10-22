import { RedocStandalone } from "redoc";

export default function RedocViewer({ specUrl }) {
  return (
    <div className="border rounded-2xl bg-white shadow-sm">
      <RedocStandalone
        specUrl={specUrl}
        options={{
          theme: { colors: { primary: { main: "#38bdf8" } } },
          hideDownloadButton: false,
          nativeScrollbars: true,
        }}
      />
    </div>
  );
}
