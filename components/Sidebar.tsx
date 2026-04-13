import SidebarNav from "@/components/SidebarNav";
import { SidebarProps } from "@/types";

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return <SidebarNav isOpen={isOpen} onCloseAction={onClose} />;
}
