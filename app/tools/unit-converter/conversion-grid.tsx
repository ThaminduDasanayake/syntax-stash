import { useConverter } from "@/app/tools/unit-converter/helpers";
import { UnitDef } from "@/app/tools/unit-converter/types";
import { Card, CardContent } from "@/components/ui/card";
import { InputField } from "@/components/ui/input-field";

const ConversionGrid = ({ units }: { units: UnitDef[] }) => {
  const { values, handleChange } = useConverter(units);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {units.map((unit) => (
        <Card key={unit.id} className="border ring-0">
          <CardContent>
            <div className="flex items-end gap-2">
              <InputField
                label={
                  <>
                    {unit.name}
                    <span className="text-muted-foreground font-mono text-xs">({unit.symbol})</span>
                  </>
                }
                type="number"
                value={values[unit.id]}
                onChange={(e) => handleChange(unit.id, e.target.value)}
                placeholder="0"
                showCopy
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
export default ConversionGrid;
