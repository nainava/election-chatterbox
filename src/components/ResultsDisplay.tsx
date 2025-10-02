import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultsDisplayProps {
  results: {
    Harris: number;
    Trump: number;
    Other: number;
  };
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const total = results.Harris + results.Trump + results.Other;
  const harrisWidth = (results.Harris / total) * 100;
  const trumpWidth = (results.Trump / total) * 100;
  const otherWidth = (results.Other / total) * 100;

  return (
    <Card className="shadow-[var(--shadow-card)] border-2 border-foreground/20 bg-newsprint">
      <CardHeader className="border-b-2 border-foreground/20">
        <CardTitle className="text-2xl font-display tracking-tight">Detailed Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-foreground/20">
              <span className="font-display font-semibold text-base uppercase tracking-wide">Harris</span>
              <span className="text-3xl font-display font-black text-harris tabular-nums">
                {results.Harris.toFixed(2)}%
              </span>
            </div>
            <div className="h-4 bg-chartBg border border-foreground/20">
              <div
                className="h-full bg-harris transition-all duration-500 ease-out border-r border-harris"
                style={{ width: `${harrisWidth}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-foreground/20">
              <span className="font-display font-semibold text-base uppercase tracking-wide">Trump</span>
              <span className="text-3xl font-display font-black text-trump tabular-nums">
                {results.Trump.toFixed(2)}%
              </span>
            </div>
            <div className="h-4 bg-chartBg border border-foreground/20">
              <div
                className="h-full bg-trump transition-all duration-500 ease-out border-r border-trump"
                style={{ width: `${trumpWidth}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-foreground/20">
              <span className="font-display font-semibold text-base uppercase tracking-wide">Other</span>
              <span className="text-3xl font-display font-black text-other tabular-nums">
                {results.Other.toFixed(2)}%
              </span>
            </div>
            <div className="h-4 bg-chartBg border border-foreground/20">
              <div
                className="h-full bg-other transition-all duration-500 ease-out border-r border-other"
                style={{ width: `${otherWidth}%` }}
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t-2 border-foreground/20">
          <div className="flex gap-0 h-10 border-2 border-foreground/30">
            <div
              className="bg-harris transition-all duration-500 border-r-2 border-foreground/30"
              style={{ width: `${harrisWidth}%` }}
            />
            <div
              className="bg-trump transition-all duration-500 border-r-2 border-foreground/30"
              style={{ width: `${trumpWidth}%` }}
            />
            <div
              className="bg-other transition-all duration-500"
              style={{ width: `${otherWidth}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
