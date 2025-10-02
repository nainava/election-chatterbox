import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { DemographicControls } from "@/components/DemographicControls";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { CalculationBreakdown } from "@/components/CalculationBreakdown";
import {
  exitPollData,
  renormalizeDistribution,
  applySwing,
  computeResults,
  DemographicGroups,
} from "@/lib/electionSimulator";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string>("gender");
  const [turnoutShifts, setTurnoutShifts] = useState<{
    [category: string]: { [group: string]: number };
  }>({
    gender: {},
    race: {},
    education: {},
  });
  const [swingShifts, setSwingShifts] = useState<{
    [category: string]: { [group: string]: number };
  }>({
    gender: {},
    race: {},
    education: {},
  });

  const { results, adjustedTurnout, finalGroups } = useMemo(() => {
    const original = exitPollData[activeCategory];
    let afterTurnout = renormalizeDistribution(
      original,
      turnoutShifts[activeCategory] || {}
    );
    let afterSwing = applySwing(afterTurnout, swingShifts[activeCategory] || {});
    const finalResults = computeResults(afterSwing);
    
    return {
      results: finalResults,
      adjustedTurnout: afterTurnout,
      finalGroups: afterSwing,
    };
  }, [activeCategory, turnoutShifts, swingShifts]);

  const handleTurnoutChange = (group: string, value: number) => {
    setTurnoutShifts((prev) => ({
      ...prev,
      [activeCategory]: {
        ...prev[activeCategory],
        [group]: value,
      },
    }));
  };

  const handleSwingChange = (group: string, value: number) => {
    setSwingShifts((prev) => ({
      ...prev,
      [activeCategory]: {
        ...prev[activeCategory],
        [group]: value,
      },
    }));
  };

  const handleReset = () => {
    setTurnoutShifts({
      gender: {},
      race: {},
      education: {},
    });
    setSwingShifts({
      gender: {},
      race: {},
      education: {},
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Election Simulator
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Explore how demographic shifts affect election outcomes
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr,400px] gap-6">
          <div>
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="gender">Gender</TabsTrigger>
                <TabsTrigger value="race">Race</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>

              <TabsContent value="gender" className="mt-0">
                <DemographicControls
                  title="Gender"
                  groups={exitPollData.gender}
                  turnoutShifts={turnoutShifts.gender || {}}
                  swingShifts={swingShifts.gender || {}}
                  onTurnoutChange={handleTurnoutChange}
                  onSwingChange={handleSwingChange}
                />
              </TabsContent>

              <TabsContent value="race" className="mt-0">
                <DemographicControls
                  title="Race"
                  groups={exitPollData.race}
                  turnoutShifts={turnoutShifts.race || {}}
                  swingShifts={swingShifts.race || {}}
                  onTurnoutChange={handleTurnoutChange}
                  onSwingChange={handleSwingChange}
                />
              </TabsContent>

              <TabsContent value="education" className="mt-0">
                <DemographicControls
                  title="Education"
                  groups={exitPollData.education}
                  turnoutShifts={turnoutShifts.education || {}}
                  swingShifts={swingShifts.education || {}}
                  onTurnoutChange={handleTurnoutChange}
                  onSwingChange={handleSwingChange}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:sticky lg:top-8 h-fit space-y-6">
            <ResultsDisplay results={results} />
            <CalculationBreakdown
              category={activeCategory}
              originalGroups={exitPollData[activeCategory]}
              adjustedGroups={adjustedTurnout}
              finalGroups={finalGroups}
              results={results}
            />
          </div>
        </div>

        <div className="mt-12 p-6 rounded-lg bg-muted/30 border">
          <h2 className="text-lg font-semibold mb-3">How to Use</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Turnout Shift:</strong> Adjust how much more or less each group
              votes (in percentage points)
            </li>
            <li>
              <strong>Swing to Harris:</strong> Move support between candidates within
              each group (positive = more Harris support)
            </li>
            <li>
              <strong>Live Results:</strong> See real-time calculations as you adjust the
              sliders
            </li>
            <li>
              <strong>Categories:</strong> Switch between Gender, Race, and Education
              demographics
            </li>
          </ul>
        </div>
      </main>

      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Interactive election modeling tool • Based on exit poll data
        </div>
      </footer>
    </div>
  );
};

export default Index;
