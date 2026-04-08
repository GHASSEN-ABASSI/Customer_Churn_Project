export default function ResultCard({ prediction }) {
  const { churn_probability, churn_prediction } = prediction
  const probabilityPercent = (churn_probability * 100).toFixed(0)
  const isHighRisk = churn_prediction === 1 || churn_probability > 0.5
  
  const accentColor = isHighRisk ? '#ff007f' : '#00f0ff'
  const severityText = isHighRisk ? 'high' : 'low'
  const actionText = isHighRisk ? 'Proactive Outreach' : 'Standard Monitoring'

  return (
    <div className="h-full flex flex-col pt-0 animate-in fade-in">
       <h4 className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-2">CHURN PROBABILITY</h4>
       
       <div className="flex justify-start my-6 pl-4">
         <div className={`w-[120px] h-[120px] rounded-full border-[8px] flex flex-col items-center justify-center relative ${isHighRisk ? 'border-[#ff007f]/20' : 'border-[#00f0ff]/20'}`}>
           <div className={`absolute inset-[-8px] rounded-full border-[8px] border-transparent transform rotate-45 ${isHighRisk ? 'border-t-[#ff007f] border-r-[#ff007f] shadow-[0_0_20px_rgba(255,0,127,0.5)]' : 'border-t-[#00f0ff] border-r-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.5)]'}`}></div>
           <span className={`text-3xl font-bold text-white relative z-10 ${isHighRisk ? 'drop-shadow-[0_0_10px_#ff007f]' : 'drop-shadow-[0_0_10px_#00f0ff]'}`}>{probabilityPercent}%</span>
           <span className="text-[11px] font-medium relative z-10 uppercase mt-1" style={{color: accentColor}}>{severityText}</span>
         </div>
       </div>
       
       <div className="space-y-4">
         <div>
           <h4 className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">RISK LEVEL</h4>
           <p className="text-slate-200 text-sm">{isHighRisk ? 'High Churn Risk' : 'Low Churn Risk'}</p>
         </div>
         <div>
           <h4 className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">KEY DRIVERS</h4>
           <p className="text-slate-200 text-sm leading-tight" dangerouslySetInnerHTML={{__html: isHighRisk ? 'High Tickets<br/>Low Sentiment' : 'Stable Usage<br/>Positive Sentiment'}} />
         </div>
         <div>
           <h4 className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">RETENTION ACTION</h4>
           <p className="text-slate-200 text-sm">{actionText}</p>
         </div>
       </div>
    </div>
  )
}
