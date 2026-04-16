import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const SetupCopyButton = () => {
  const { copied, copy } = useCopyToClipboard();

  return <div>SetupCopyButton</div>;
};
export default SetupCopyButton;
