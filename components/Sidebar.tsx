import SidebarNav from "@/components/SidebarNav";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return <SidebarNav isOpen={isOpen} onCloseAction={onClose} />;
}
