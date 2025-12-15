import { Routes, Route } from "react-router-dom";
import AdvertiserLayout from "../layout/AdvertiserLayout";
import AdvertiserDashboardHome from "../pages/Dashboard/AdvertiserDashboardHome";
import CampaignsPage from "../pages/Campaigns/CampaignsPage";
import MediaUploadPage from "../pages/Media/MediaUploadPage";
import GeoTargetingPage from "../pages/Geo/GeoTargetingPage";
import AnalyticsPage from "../pages/Analytics/AnalyticsPage";
import AccountPage from "../pages/Account/AccountPage";
import BillingPage from "../pages/Billing/BillingPage";

export default function AdvertiserRoutes({ user, onLogout }) {
    return (
        <AdvertiserLayout user={user} onLogout={onLogout}>
            <Routes>
                <Route path="/advertiser" element={<AdvertiserDashboardHome />} />
                <Route path="/advertiser/campaigns" element={<CampaignsPage />} />
                <Route path="/advertiser/media" element={<MediaUploadPage />} />
                <Route path="/advertiser/geo" element={<GeoTargetingPage />} />
                <Route path="/advertiser/analytics" element={<AnalyticsPage />} />
                <Route path="/advertiser/account" element={<AccountPage />} />
                <Route path="/advertiser/billing" element={<BillingPage />} />
            </Routes>
        </AdvertiserLayout>
    );
}
