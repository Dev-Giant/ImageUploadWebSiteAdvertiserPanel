export default function TopbarAdvertiser({ user, onLogout }) {
  return (
    <div className="flex items-center justify-between p-4 bg-blue-950 text-neutral-50">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">Advertiser Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm">
          {user?.email || "Advertiser"}
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="bg-sky-500 hover:bg-sky-600 text-white text-sm px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
