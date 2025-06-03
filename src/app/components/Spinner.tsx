export default function Spinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}
