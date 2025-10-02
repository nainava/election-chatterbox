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
    <Card className="shadow-[var(--shadow-elevated)]">
      <CardHeader>
        <CardTitle className="text-2xl">Election Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Harris</span>
              <span className="text-2xl font-bold text-harris">
                {results.Harris.toFixed(2)}%
              </span>
            </div>
            <div className="h-3 bg-chartBg rounded-full overflow-hidden">
              <div
                className="h-full bg-harris transition-all duration-500 ease-out"
                style={{ width: `${harrisWidth}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Trump</span>
              <span className="text-2xl font-bold text-trump">
                {results.Trump.toFixed(2)}%
              </span>
            </div>
            <div className="h-3 bg-chartBg rounded-full overflow-hidden">
              <div
                className="h-full bg-trump transition-all duration-500 ease-out"
                style={{ width: `${trumpWidth}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Other</span>
              <span className="text-2xl font-bold text-other">
                {results.Other.toFixed(2)}%
              </span>
            </div>
            <div className="h-3 bg-chartBg rounded-full overflow-hidden">
              <div
                className="h-full bg-other transition-all duration-500 ease-out"
                style={{ width: `${otherWidth}%` }}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex gap-2 h-8 rounded-lg overflow-hidden">
            <div
              className="bg-harris transition-all duration-500"
              style={{ width: `${harrisWidth}%` }}
            />
            <div
              className="bg-trump transition-all duration-500"
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
