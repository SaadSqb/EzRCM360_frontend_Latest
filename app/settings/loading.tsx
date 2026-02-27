export default function SettingsLoading() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="h-6 w-48 animate-shimmer-bg rounded-lg" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-48 animate-shimmer-bg rounded-xl"
            style={{ animationDelay: `${i * 0.05}s` }}
          />
        ))}
      </div>
    </div>
  );
}
