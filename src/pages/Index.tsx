import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RotateCcw, Newspaper } from "lucide-react";
import { DemographicControls } from "@/components/DemographicControls";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { CalculationBreakdown } from "@/components/CalculationBreakdown";
import { PopularVoteIndicator } from "@/components/PopularVoteIndicator";
import {
  exitPollData,
  renormalizeDistribution,
  applySwing,
  computeResults,
  DemographicGroups,
} from "@/lib/electionSimulator";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string>("gender");
  const [activeGroup, setActiveGroup] = useState<{
    [category: string]: string | null;
  }>({
    gender: null,
    race: null,
    education: null,
  });
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

  const handleGroupSelect = (group: string) => {
    const currentActive = activeGroup[activeCategory];
    
    // If selecting the same group, deselect it
    if (currentActive === group) {
      setActiveGroup((prev) => ({
        ...prev,
        [activeCategory]: null,
      }));
      return;
    }
    
    // Reset previous group's adjustments if there was one
    if (currentActive) {
      setTurnoutShifts((prev) => ({
        ...prev,
        [activeCategory]: {
          ...prev[activeCategory],
          [currentActive]: 0,
        },
      }));
      setSwingShifts((prev) => ({
        ...prev,
        [activeCategory]: {
          ...prev[activeCategory],
          [currentActive]: 0,
        },
      }));
    }
    
    // Set new active group
    setActiveGroup((prev) => ({
      ...prev,
      [activeCategory]: group,
    }));
  };

  const handleReset = () => {
    setActiveGroup({
      gender: null,
      race: null,
      education: null,
    });
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
      <header className="border-b-4 border-foreground bg-card shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Newspaper className="w-12 h-12" strokeWidth={1.5} />
              <div>
                <h1 className="text-5xl font-title font-bold tracking-tight leading-none">
                  THE COUNTERFACTUAL
                </h1>
                <p className="text-sm uppercase tracking-widest text-muted-foreground mt-2 font-serif">
                  An election what-if simulator
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="border-2 border-foreground font-serif font-semibold"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
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
                  activeGroup={activeGroup.gender}
                  turnoutShifts={turnoutShifts.gender || {}}
                  swingShifts={swingShifts.gender || {}}
                  onGroupSelect={handleGroupSelect}
                  onTurnoutChange={handleTurnoutChange}
                  onSwingChange={handleSwingChange}
                />
              </TabsContent>

              <TabsContent value="race" className="mt-0">
                <DemographicControls
                  title="Race"
                  groups={exitPollData.race}
                  activeGroup={activeGroup.race}
                  turnoutShifts={turnoutShifts.race || {}}
                  swingShifts={swingShifts.race || {}}
                  onGroupSelect={handleGroupSelect}
                  onTurnoutChange={handleTurnoutChange}
                  onSwingChange={handleSwingChange}
                />
              </TabsContent>

              <TabsContent value="education" className="mt-0">
                <DemographicControls
                  title="Education"
                  groups={exitPollData.education}
                  activeGroup={activeGroup.education}
                  turnoutShifts={turnoutShifts.education || {}}
                  swingShifts={swingShifts.education || {}}
                  onGroupSelect={handleGroupSelect}
                  onTurnoutChange={handleTurnoutChange}
                  onSwingChange={handleSwingChange}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:sticky lg:top-8 h-fit space-y-6">
            <PopularVoteIndicator results={results} />
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

        <div className="mt-12 p-8 border-2 border-foreground/20 bg-newsprint">
          <h2 className="text-2xl font-display font-bold mb-4 tracking-tight">
            Instructions for Use
          </h2>
          <ul className="space-y-3 text-sm font-serif leading-relaxed">
            <li className="border-l-2 border-foreground/30 pl-4">
              <strong className="font-bold">Turnout Adjustment:</strong> Modify the percentage points by which each demographic group's voter participation increases or decreases from baseline levels.
            </li>
            <li className="border-l-2 border-foreground/30 pl-4">
              <strong className="font-bold">Electoral Swing:</strong> Redistribute candidate support within each demographic cohort. Positive values indicate movement toward Harris; negative values favor Trump.
            </li>
            <li className="border-l-2 border-foreground/30 pl-4">
              <strong className="font-bold">Real-Time Calculation:</strong> All modifications are computed instantaneously, with results updating as parameters are adjusted.
            </li>
            <li className="border-l-2 border-foreground/30 pl-4">
              <strong className="font-bold">Demographic Categories:</strong> Toggle between Gender, Race, and Educational Attainment to examine different voter segments.
            </li>
          </ul>
        </div>
      </main>

      <footer className="border-t-2 border-foreground/20 mt-12 py-8 bg-newsprint">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-serif">
            Interactive Electoral Modeling Instrument
          </div>
          <div className="text-xs text-muted-foreground font-serif mt-1">
            Based on Exit Poll Survey Data • All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
