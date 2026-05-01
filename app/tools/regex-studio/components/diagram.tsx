import { Ref, useImperativeHandle, useRef } from "react";
import type { RootNode } from "regjsparser";

import { RailroadDiagram } from "@/app/tools/regex-studio/components/railroad.tsx";

const Diagram = ({ ast, svgRef }: { ast: RootNode; svgRef: Ref<SVGSVGElement> }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(svgRef, () => containerRef.current?.querySelector("svg") as SVGSVGElement);

  return (
    <div ref={containerRef}>
      <RailroadDiagram ast={ast} />
    </div>
  );
};
export default Diagram;
