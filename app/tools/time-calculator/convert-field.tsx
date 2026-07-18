import { ConvertFieldProps } from "@/app/tools/time-calculator/types";
import { Card, CardContent } from "@/components/ui/card";
import { InputField } from "@/components/ui/input-field";

const ConvertField = ({ label, onChange, placeholder, value }: ConvertFieldProps) => {
  return (
    <Card className="focus-within:border-primary/50 transition-colors">
      <CardContent className="w-full justify-between p-4">
        <InputField
          label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full"
          showCopy
        />
      </CardContent>
    </Card>
  );
};

export default ConvertField;
