import Sidebar from "./Sidebar";
import Header from "./Header";
interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 p-10">
          {children}
        </main>
      </div>
    </div>
  );
}