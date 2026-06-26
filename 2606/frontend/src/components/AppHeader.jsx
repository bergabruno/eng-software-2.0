export default function AppHeader({
  title = 'ConsigFIAP',
  actionLabel,
  onAction,
  disabled = false,
}) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A]">
      <span className="text-[#ED145B] font-bold text-xl">{title}</span>
      {actionLabel && (
        <button
          onClick={onAction}
          className="text-[#B3B3B3] hover:text-[#F5F5F5] text-sm transition-colors"
          disabled={disabled}
        >
          {actionLabel}
        </button>
      )}
    </header>
  )
}
