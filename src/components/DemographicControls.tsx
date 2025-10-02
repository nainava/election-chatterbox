import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { DemographicGroups } from "@/lib/electionSimulator";

interface DemographicControlsProps {
  title: string;
  groups: DemographicGroups;
  turnoutShifts: { [key: string]: number };
  swingShifts: { [key: string]: number };
  onTurnoutChange: (group: string, value: number) => void;
  onSwingChange: (group: string, value: number) => void;
}

export function DemographicControls({
  title,
  groups,
  turnoutShifts,
  swingShifts,
  onTurnoutChange,
  onSwingChange,
}: DemographicControlsProps) {
  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle>{title} Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groups).map(([group, stats]) => (
          <div key={group} className="space-y-4 p-4 rounded-lg bg-muted/30">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-sm">{group}</h4>
              <div className="text-xs text-muted-foreground space-x-3">
                <span>Share: {stats.share.toFixed(1)}%</span>
                <span className="text-harris">H: {stats.Harris}%</span>
                <span className="text-trump">T: {stats.Trump}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Turnout Shift</Label>
                  <span className="text-xs font-mono text-muted-foreground">
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
                  <Label className="text-xs">Swing to Harris</Label>
                  <span className="text-xs font-mono text-muted-foreground">
                    {swingShifts[group] > 0 ? "+" : ""}
                    {swingShifts[group]?.toFixed(1) || 0}pp
                  </span>
                </div>
                <Slider
                  value={[swingShifts[group] || 0]}
                  onValueChange={([value]) => onSwingChange(group, value)}
                  min={-20}
                  max={20}
                  step={0.5}
                  className="py-2"
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
