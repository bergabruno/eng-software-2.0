export default function InfoRow({
  label,
  value,
  valueClassName = 'text-[#F5F5F5] text-right font-medium',
}) {
  return (
    <tr>
      <td className="py-3 text-[#B3B3B3]">{label}</td>
      <td className={`py-3 ${valueClassName}`}>{value}</td>
    </tr>
  )
}
