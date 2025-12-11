import SidebarAdvertiser from "../components/SidebarAdvertiser";
import TopbarAdvertiser from "../components/TopbarAdvertiser";

export default function AdvertiserLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            <SidebarAdvertiser />
            <div className="flex-1 bg-slate-900 min-h-screen">
                <TopbarAdvertiser />
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
