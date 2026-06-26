export default function ErrorMessage({ children }) {
  if (!children) return null

  return <p className="text-[#EF4444] text-sm">{children}</p>
}
