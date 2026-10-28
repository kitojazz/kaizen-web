export default function AdminNotice({
  notice,
  message,
}: {
  notice?: string;
  message?: string;
}) {
  if (!notice || !message) return null;
  const success = notice === "success";

  return (
    <div
      role="status"
      className={`rounded-2xl border px-4 py-3 text-[12.5px] font-semibold ${
        success
          ? "border-[#bfe3cd] bg-[#f0fbf4] text-[#166534]"
          : "border-[#f0c6c6] bg-[#fff6f6] text-[#9d2323]"
      }`}
    >
      {message}
    </div>
  );
}
