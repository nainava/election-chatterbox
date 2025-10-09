import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown } from "lucide-react";

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
  
  const harrisDiff = results.Harris - results.Trump;
  const winner = results.Harris > results.Trump ? "Harris" : results.Trump > results.Harris ? "Trump" : "Tie";
  const margin = Math.abs(harrisDiff);
  const winnerPosition = results.Harris > results.Trump ? harrisWidth : 100 - trumpWidth;

  return (
    <Card className="shadow-[var(--shadow-card)] border-2 border-foreground/20 bg-newsprint">
      <CardHeader className="border-b-2 border-foreground/20 pb-4">
        <CardTitle className="text-2xl font-display tracking-tight">
          Popular Vote Results
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Winner Indicator */}
        <div className="relative">
          <div className="h-16 border-2 border-foreground/30 relative bg-card">
            {/* Harris section */}
            <div
              className="absolute left-0 top-0 h-full bg-harris/20 border-r-2 border-harris transition-all duration-700"
              style={{ width: `${harrisWidth}%` }}
            />
            {/* Trump section */}
            <div
              className="absolute right-0 top-0 h-full bg-trump/20 border-l-2 border-trump transition-all duration-700"
              style={{ width: `${trumpWidth}%` }}
            />
            {/* 50% marker */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-foreground -translate-x-1/2">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pb-1">
                <div className="text-xs font-bold font-display bg-background px-2 py-0.5 border border-foreground/30">
                  50%
                </div>
              </div>
            </div>
            
            {/* Winner crown */}
            {winner !== "Tie" && (
              <div
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-700"
                style={{
                  left: winner === "Harris" ? `${winnerPosition}%` : `${100 - winnerPosition}%`,
                  transform: `translate(-50%, -50%)`
                }}
              >
                <div className={`flex flex-col items-center ${
                  winner === "Harris" ? "text-harris" : "text-trump"
                }`}>
                  <Crown className="w-6 h-6 fill-current" />
                </div>
              </div>
            )}
          </div>

          {/* Labels */}
          <div className="flex justify-between mt-3 text-sm font-semibold">
            <div className="text-harris">HARRIS</div>
            <div className="text-trump">TRUMP</div>
          </div>
        </div>

        {/* Winner announcement */}
        <div className="text-center p-6 border-2 border-foreground/20 bg-card">
          {winner === "Tie" ? (
            <div className="space-y-2">
              <div className="text-3xl font-display font-bold">
                EXACT TIE
              </div>
              <div className="text-sm text-muted-foreground font-serif">
                Both candidates at {results.Harris.toFixed(2)}%
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-serif">
                Projected Winner
              </div>
              <div className={`text-4xl font-display font-black tracking-tight ${
                winner === "Harris" ? "text-harris" : "text-trump"
              }`}>
                {winner.toUpperCase()}
              </div>
              <div className="text-lg font-display font-semibold">
                +{margin.toFixed(2)} points
              </div>
              <div className="text-xs text-muted-foreground font-serif pt-2">
                {winner === "Harris" 
                  ? `${results.Harris.toFixed(2)}% to ${results.Trump.toFixed(2)}%`
                  : `${results.Trump.toFixed(2)}% to ${results.Harris.toFixed(2)}%`
                }
              </div>
            </div>
          )}
        </div>

        {/* Margin description */}
        <div className="text-center text-xs text-muted-foreground border-t pt-4 font-serif italic">
          {margin === 0 && "A perfect tie — an extraordinarily rare occurrence"}
          {margin > 0 && margin < 1 && "A razor-thin margin within the margin of error"}
          {margin >= 1 && margin < 3 && "A narrow victory, highly competitive race"}
          {margin >= 3 && margin < 5 && "A clear but modest lead"}
          {margin >= 5 && margin < 10 && "A solid and convincing margin"}
          {margin >= 10 && "A commanding and decisive victory"}
        </div>

        {/* Detailed breakdown */}
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
