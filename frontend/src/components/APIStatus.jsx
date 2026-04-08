export default function APIStatus({ status }) {
  const isOnline = status.connected
  
  return (
    <div className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-[#11131a] rounded-lg border border-[#2a2d3a] mx-2">
        <div className="relative flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#00f0ff] shadow-[0_0_5px_#00f0ff]' : 'bg-[#ff007f] shadow-[0_0_5px_#ff007f]'}`}></div>
            {isOnline && <div className={`absolute inset-0 w-2 h-2 rounded-full bg-[#00f0ff] animate-ping opacity-50`}></div>}
        </div>
        <span className={isOnline ? 'text-slate-300' : 'text-[#ff007f]'}>{status.message}</span>
    </div>
  )
}
