export type FigletFont = "Standard" | "Slant" | "Block" | "Money";

export type TreeNode = {
  name: string;
  children: TreeNode[];
  isFolder: boolean;
};
