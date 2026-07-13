import { Card, CardContent } from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function AuthCard({
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-lg border-slate-800 bg-slate-900 shadow-[0_20px_80px_rgba(37,99,235,0.15)]">
      <CardContent className="space-y-6 p-10">
        <div className="space-y-2 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-2xl font-bold text-white">
            HT
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-white">
            {title}
          </h1>

          <p className="text-slate-400">
            {description}
          </p>
        </div>

        {children}
      </CardContent>
    </Card>
  );
}