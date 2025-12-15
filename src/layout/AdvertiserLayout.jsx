import SidebarAdvertiser from "../components/SidebarAdvertiser";
import TopbarAdvertiser from "../components/TopbarAdvertiser";

export default function AdvertiserLayout({ children, user, onLogout }) {
  return (
    <div className="flex min-h-screen">
      <SidebarAdvertiser />
      <div className="flex-1 bg-slate-900 min-h-screen">
        <TopbarAdvertiser user={user} onLogout={onLogout} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
