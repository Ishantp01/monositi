export function FeaturePill({ label, value }) {
  return (
    <div className="table-cell px-7 py-3 border border-gray-200 align-top">
      <p className="text-[10px] uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

