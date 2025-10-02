import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Info } from "lucide-react";
import { useState } from "react";
import { DemographicGroups } from "@/lib/electionSimulator";

interface CalculationBreakdownProps {
  category: string;
  originalGroups: DemographicGroups;
  adjustedGroups: DemographicGroups;
  finalGroups: DemographicGroups;
  results: {
    Harris: number;
    Trump: number;
    Other: number;
  };
}

export function CalculationBreakdown({
  category,
  originalGroups,
  adjustedGroups,
  finalGroups,
  results,
}: CalculationBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="shadow-[var(--shadow-card)] border-2 border-foreground/20 bg-newsprint">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3 border-b border-foreground/10">
          <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-accent" />
              <CardTitle className="text-lg font-display tracking-tight">Methodology & Calculations</CardTitle>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-6 text-sm">
            <div className="p-4 rounded-lg bg-muted/30 border border-muted">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                  1
                </span>
                Original {category} Distribution
              </h4>
              <div className="space-y-2">
                {Object.entries(originalGroups).map(([group, stats]) => (
                  <div
                    key={group}
                    className="grid grid-cols-[1fr,auto,auto,auto] gap-3 text-xs"
                  >
                    <span className="font-medium">{group}</span>
                    <span className="text-muted-foreground">
                      Share: {stats.share.toFixed(1)}%
                    </span>
                    <span className="text-harris">H: {stats.Harris}%</span>
                    <span className="text-trump">T: {stats.Trump}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-muted">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                  2
                </span>
                After Turnout Adjustments
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Group shares are adjusted based on turnout shifts and renormalized to
                100%
              </p>
              <div className="space-y-2">
                {Object.entries(adjustedGroups).map(([group, stats]) => {
                  const original = originalGroups[group];
                  const changed = Math.abs(stats.share - original.share) > 0.01;
                  return (
                    <div
                      key={group}
                      className={`grid grid-cols-[1fr,auto] gap-3 text-xs ${
                        changed ? "font-medium" : ""
                      }`}
                    >
                      <span>{group}</span>
                      <span className={changed ? "text-accent" : "text-muted-foreground"}>
                        {original.share.toFixed(1)}% → {stats.share.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-muted">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                  3
                </span>
                After Swing Adjustments
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Candidate support within each group shifts based on swing values
              </p>
              <div className="space-y-3">
                {Object.entries(finalGroups).map(([group, stats]) => {
                  const adjusted = adjustedGroups[group];
                  const harrisChanged = Math.abs(stats.Harris - adjusted.Harris) > 0.01;
                  return (
                    <div key={group} className="space-y-1">
                      <div className="font-medium text-xs">{group}</div>
                      <div className="grid grid-cols-2 gap-2 text-xs pl-3">
                        <div
                          className={harrisChanged ? "text-harris font-medium" : "text-muted-foreground"}
                        >
                          Harris: {adjusted.Harris.toFixed(1)}% → {stats.Harris.toFixed(1)}%
                        </div>
                        <div
                          className={harrisChanged ? "text-trump font-medium" : "text-muted-foreground"}
                        >
                          Trump: {adjusted.Trump.toFixed(1)}% → {stats.Trump.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-accent/10 border-2 border-accent">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-white text-xs">
                  4
                </span>
                Final Weighted Results
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Each group's support is weighted by their share of the electorate
              </p>
              <div className="space-y-2 font-mono text-xs">
                {Object.entries(finalGroups).map(([group, stats]) => (
                  <div key={group} className="space-y-1 pl-3">
                    <div className="text-muted-foreground">{group}:</div>
                    <div className="grid grid-cols-3 gap-2 pl-3">
                      <div className="text-harris">
                        {stats.share.toFixed(1)}% × {stats.Harris.toFixed(1)}% ={" "}
                        {((stats.share / 100) * stats.Harris).toFixed(2)}
                      </div>
                      <div className="text-trump">
                        {stats.share.toFixed(1)}% × {stats.Trump.toFixed(1)}% ={" "}
                        {((stats.share / 100) * stats.Trump).toFixed(2)}
                      </div>
                      <div className="text-other">
                        {stats.share.toFixed(1)}% × {stats.Other.toFixed(1)}% ={" "}
                        {((stats.share / 100) * stats.Other).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-3 mt-3 border-t border-accent/30 font-semibold">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-harris">
                      Harris: {results.Harris.toFixed(2)}%
                    </div>
                    <div className="text-trump">Trump: {results.Trump.toFixed(2)}%</div>
                    <div className="text-other">Other: {results.Other.toFixed(2)}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 text-xs text-muted-foreground">
              <strong className="text-foreground">How it works:</strong> Each adjustment
              cascades through the calculation. First, turnout shifts change how many
              voters each group represents. Then, swing adjustments move support between
              candidates within each group. Finally, all groups are weighted by their
              share to produce the national result.
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
