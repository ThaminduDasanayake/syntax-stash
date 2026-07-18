import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Instruction {
  text: string;
  code?: string[];
}

interface InstructionCardProps {
  instructions: Instruction[];
}

export function InstructionCard({ instructions }: InstructionCardProps) {
  return (
    <Card className="bg-sky-500/10 ring-sky-500/30">
      <CardHeader className="font-bold tracking-wider text-sky-400 uppercase">
        Instructions
      </CardHeader>
      <CardContent className="text-sky-200">
        {instructions.map(({ code, text }, idx) => (
          <div key={idx}>
            <p>{text}</p>

            {code && (
              <ul className="ml-5 rounded-md px-3 py-2 font-mono">
                {code.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
