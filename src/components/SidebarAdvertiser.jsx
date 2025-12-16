import { Link } from "react-router-dom";

export default function SidebarAdvertiser() {
    const items = [
        { to: "/advertiser", label: "Overview", icon: "📊" },
        { to: "/advertiser/campaigns", label: "Campaigns", icon: "🎯" },
        { to: "/advertiser/media", label: "Media Uploads", icon: "📁" },
        { to: "/advertiser/geo", label: "Geo Targeting", icon: "🗺️" },
        { to: "/advertiser/analytics", label: "Analytics", icon: "📈" },
        { to: "/advertiser/ad-placements", label: "Ad Placements", icon: "📺" },
        { to: "/advertiser/billing", label: "Billing", icon: "💳" },
        { to: "/advertiser/account", label: "Account", icon: "👤" },
    ];

    return (
        <aside className="w-64 bg-slate-900 shadow-lg border border-black min-h-screen text-neutral-50">
            <div className="text-lg font-bold mb-2 flex items-center px-4 h-15 bg-blue-950">Advertiser Panel</div>
            <nav className="flex flex-col gap-2 p-4">
                {items.map((it) => (
                    <Link key={it.to} to={it.to} className="flex items-center gap-3 p-2 rounded hover:bg-sky-400">
                        <span>{it.icon}</span>
                        <span>{it.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
