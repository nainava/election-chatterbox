import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { DemographicGroups } from "@/lib/electionSimulator";

interface DemographicControlsProps {
  title: string;
  groups: DemographicGroups;
  activeGroup: string | null;
  turnoutShifts: { [key: string]: number };
  swingShifts: { [key: string]: number };
  onGroupSelect: (group: string) => void;
  onTurnoutChange: (group: string, value: number) => void;
  onSwingChange: (group: string, value: number) => void;
}

export function DemographicControls({
  title,
  groups,
  activeGroup,
  turnoutShifts,
  swingShifts,
  onGroupSelect,
  onTurnoutChange,
  onSwingChange,
}: DemographicControlsProps) {
  return (
    <Card className="shadow-[var(--shadow-card)] border-2 border-foreground/20 bg-newsprint">
      <CardHeader className="border-b-2 border-foreground/20">
        <CardTitle className="font-display text-2xl tracking-tight">{title} Demographics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groups).map(([group, stats]) => {
          const isActive = activeGroup === group;
          
          return (
            <div 
              key={group} 
              className={`space-y-4 p-5 border-2 transition-all ${
                isActive 
                  ? 'border-foreground/40 bg-card shadow-md' 
                  : 'border-foreground/20 bg-card/50 hover:border-foreground/30 cursor-pointer'
              }`}
              onClick={() => !isActive && onGroupSelect(group)}
            >
              <div className="flex justify-between items-center pb-3 border-b border-foreground/10">
                <h4 className="font-display font-semibold text-base">{group}</h4>
                <div className="text-xs font-serif space-x-3 tabular-nums">
                  <span className="text-muted-foreground">Share: {stats.share.toFixed(1)}%</span>
                  <span className="text-harris font-semibold">H: {stats.Harris}%</span>
                  <span className="text-trump font-semibold">T: {stats.Trump}%</span>
                </div>
              </div>

              {isActive && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs font-serif uppercase tracking-wider">Turnout Adjustment</Label>
                      <span className="text-xs font-display font-bold text-muted-foreground tabular-nums">
                        {turnoutShifts[group] > 0 ? "+" : ""}
                        {turnoutShifts[group]?.toFixed(1) || 0}pp
                      </span>
                    </div>
                    <Slider
                      value={[turnoutShifts[group] || 0]}
                      onValueChange={([value]) => onTurnoutChange(group, value)}
                      min={-10}
                      max={10}
                      step={0.5}
                      className="py-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs font-serif uppercase tracking-wider">Electoral Swing</Label>
                      <span className="text-xs font-display font-bold text-muted-foreground tabular-nums">
                        {swingShifts[group] > 0 ? "+" : ""}
                        {swingShifts[group]?.toFixed(1) || 0}pp
                      </span>
                    </div>
                    <div className="relative">
                      <Slider
                        value={[swingShifts[group] || 0]}
                        onValueChange={([value]) => onSwingChange(group, value)}
                        min={-20}
                        max={20}
                        step={0.5}
                        className="py-2"
                      />
                      <div className="flex justify-between items-center mt-1 text-[10px] font-serif uppercase tracking-wider">
                        <span className="text-harris font-semibold">← To Harris</span>
                        <span className="text-muted-foreground">Neutral</span>
                        <span className="text-trump font-semibold">To Trump →</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
