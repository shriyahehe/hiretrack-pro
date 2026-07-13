import Sidebar from "./Sidebar";
import Header from "./Header";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
  return (
    <div
      className="h-screen overflow-hidden bg-slate-950 text-white"
      style={{
        display: "grid",
        gridTemplateColumns: "256px minmax(0, 1fr)",
      }}
    >
      <div className="h-screen overflow-hidden">
        <Sidebar />
      </div>

      <div
        className="h-screen min-w-0 overflow-hidden bg-slate-950"
        style={{
          display: "grid",
          gridTemplateRows: "80px minmax(0, 1fr)",
        }}
      >
        <Header />

        <main className="min-h-0 overflow-y-auto bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}