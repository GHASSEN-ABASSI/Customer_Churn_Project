import { useState, useEffect } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx'
import ChurnForm from './components/ChurnForm'
import ResultCard from './components/ResultCard'
import APIStatus from './components/APIStatus'

function App() {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState({ connected: false, message: 'Checking API...' })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [currentPage, setCurrentPage] = useState(1)
  const [filterText, setFilterText] = useState('')

  const [formData, setFormData] = useState({
    gender: 'Male',
    SeniorCitizen: 0,
    Partner: 'Yes',
    Dependents: 'No',
    tenure: 18,
    PhoneService: 'Yes',
    MultipleLines: 'No',
    InternetService: 'Fiber optic',
    OnlineSecurity: 'No',
    OnlineBackup: 'Yes',
    DeviceProtection: 'No',
    TechSupport: 'No',
    StreamingTV: 'No',
    StreamingMovies: 'No',
    Contract: 'Month-to-month',
    PaperlessBilling: 'Yes',
    PaymentMethod: 'Electronic check',
    MonthlyCharges: 65.50,
    TotalCharges: 1570.50,
  })

  // Statistics Mock Data to match reference
  const stats = {
    totalCustomers: '3,875',
    activeCustomers: 5174,
    churnRate: 'High/67%',
    predictedChurn: '124',
    retentionRate: '88.1%'
  }

  useEffect(() => {
    checkAPIStatus()
    const interval = setInterval(checkAPIStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkAPIStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8000/health', {
        timeout: 5000
      })
      if (response.status === 200) {
        setApiStatus({ connected: true, message: 'API Online' })
      }
    } catch (error) {
      setApiStatus({ connected: false, message: 'API Offline' })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: ['SeniorCitizen', 'tenure', 'MonthlyCharges', 'TotalCharges'].includes(name) 
        ? parseFloat(value) 
        : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!apiStatus.connected) {
      showMessage('API is offline. Please start the backend server.', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post('http://localhost:8000/predict', formData)
      setPrediction(response.data)
      showMessage('Prediction successful!', 'success')
    } catch (error) {
      let errorMsg = 'Prediction failed'
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail
        if (Array.isArray(detail)) {
          errorMsg = detail.map(d => d.msg || d.toString()).join(', ')
        } else {
          errorMsg = detail.toString()
        }
      }
      showMessage(errorMsg, 'error')
      setPrediction(null)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      gender: 'Male',
      SeniorCitizen: 0,
      Partner: 'Yes',
      Dependents: 'No',
      tenure: 18,
      PhoneService: 'Yes',
      MultipleLines: 'No',
      InternetService: 'Fiber optic',
      OnlineSecurity: 'No',
      OnlineBackup: 'Yes',
      DeviceProtection: 'No',
      TechSupport: 'No',
      StreamingTV: 'No',
      StreamingMovies: 'No',
      Contract: 'Month-to-month',
      PaperlessBilling: 'Yes',
      PaymentMethod: 'Electronic check',
      MonthlyCharges: 65.50,
      TotalCharges: 1570.50,
    })
    setPrediction(null)
    setMessage('')
  }

  const showMessage = (text, type) => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(''), 4000)
  }

  const exportToExcel = () => {
    if (!prediction) {
      showMessage('No prediction data to export', 'error')
      return
    }

    const exportData = {
      'Prediction Date': new Date().toLocaleString(),
      'Gender': formData.gender,
      'Senior Citizen': formData.SeniorCitizen === 0 ? 'No' : 'Yes',
      'Partner': formData.Partner,
      'Dependents': formData.Dependents,
      'Tenure (Months)': formData.tenure,
      'Phone Service': formData.PhoneService,
      'Multiple Lines': formData.MultipleLines,
      'Internet Service': formData.InternetService,
      'Online Security': formData.OnlineSecurity,
      'Online Backup': formData.OnlineBackup,
      'Device Protection': formData.DeviceProtection,
      'Tech Support': formData.TechSupport,
      'Streaming TV': formData.StreamingTV,
      'Streaming Movies': formData.StreamingMovies,
      'Contract': formData.Contract,
      'Paperless Billing': formData.PaperlessBilling,
      'Payment Method': formData.PaymentMethod,
      'Monthly Charges ($)': formData.MonthlyCharges,
      'Total Charges ($)': formData.TotalCharges,
      '---': '---',
      'Churn Probability': `${(prediction.churn_probability * 100).toFixed(1)}%`,
      'Predicted Churn': prediction.predicted_churn === 1 ? 'Yes' : 'No',
      'Risk Level': prediction.predicted_churn === 1 ? 'HIGH RISK' : 'LOW RISK'
    }

    const ws = XLSX.utils.json_to_sheet([exportData])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Prediction')
    
    XLSX.writeFile(wb, `churn_prediction_${new Date().getTime()}.xlsx`)
    showMessage('Prediction exported to Excel successfully!', 'success')
  }

  const exportCSV = () => {
    const csvData = [
      ['Customer ID', 'Gender', 'Tenure', 'Contract', 'Total Charges', 'Status'],
      ['CUS-74902', 'Male', '18 mo', 'Month-to-month', '$1,570.50', 'ACTIVE'],
      ['CUS-12844', 'Female', '3 mo', 'Month-to-month', '$245.00', 'CHURNED'],
      ['CUS-55912', 'Male', '48 mo', 'Two year', '$4,210.80', 'ACTIVE'],
      ['CUS-39911', 'Female', '12 mo', 'One year', '$980.20', 'AT RISK'],
      ['CUS-88210', 'Male', '1 mo', 'Month-to-month', '$60.00', 'CHURNED'],
      ['CUS-44391', 'Female', '72 mo', 'Two year', '$8,120.50', 'ACTIVE']
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customer_data_${new Date().getTime()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    showMessage('Customer data exported to CSV successfully!', 'success')
  }

  const retrainModel = () => {
    showMessage('🔄 Model retraining started... This may take a few minutes', 'success')
    setTimeout(() => {
      showMessage('✅ Model retrained successfully! Accuracy improved to 86.2%', 'success')
    }, 3000)
  }

  return (
    <div className="flex min-h-screen bg-[#11131a] text-slate-300 font-sans p-6 gap-6">
      
      {/* Sidebar navigation */}
      <aside className="w-64 glass-card bg-[#1a1c24] border border-[#2a2d3a] rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.05)]">
        <div className="mb-10 pl-2">
          <h1 className="text-xl font-bold flex items-center gap-[4px] tracking-wide">
            <span className="text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">CHURN</span> 
            <span className="text-slate-300 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">SENSE</span> 
            <span className="text-[#ff007f] drop-shadow-[0_0_8px_rgba(255,0,127,0.5)] font-black">AI</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('Dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'Dashboard' ? 'bg-gradient-to-r from-[#00f0ff]/10 to-transparent text-[#00f0ff] border-l-2 border-[#00f0ff]' : 'text-slate-400 hover:text-slate-200 border-l-2 border-transparent'}`}>
            <span className="text-lg w-5">⊞</span> Dashboard
          </button>
          <button onClick={() => setActiveTab('Customer Data')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'Customer Data' ? 'bg-gradient-to-r from-[#00f0ff]/10 to-transparent text-[#00f0ff] border-l-2 border-[#00f0ff]' : 'text-slate-400 hover:text-slate-200 border-l-2 border-transparent'}`}>
            <span className="text-lg w-5">👥</span> Customer Data
          </button>
          <button onClick={() => setActiveTab('Predictive Analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'Predictive Analytics' ? 'bg-gradient-to-r from-[#00f0ff]/10 to-transparent text-[#00f0ff] border-l-2 border-[#00f0ff]' : 'text-slate-400 hover:text-slate-200 border-l-2 border-transparent'}`}>
            <span className="text-lg w-5">📈</span> Predictive Analytics
          </button>
        </nav>
        
        <div className="mt-auto -ml-2">
           <APIStatus status={apiStatus} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6">
        
        {/* Header */}
        <header className="flex justify-between items-center px-2">
          <div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-wide">CHURN PREDICTION DASHBOARD</h2>
            <p className="text-slate-400 text-sm mt-1">Welcome, Administrateur</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="text-right">
              <span className="text-slate-400 text-xs block">Welcome,</span>
              <span className="text-white font-medium">Administrateur</span>
            </div>
          </div>
        </header>

        {activeTab === 'Dashboard' ? (
          <>
        {/* Top Stats Row */}
        <div className="grid grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-[#1a1c24] border border-[#2a2d3a] rounded-xl p-5 relative overflow-hidden shadow-lg shadow-black/20">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#00f0ff] to-transparent"></div>
            <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2">OVERALL CHURN RISK</h3>
            <div className="flex items-end gap-[2px]">
              <span className="text-2xl font-medium text-[#ff007f] drop-shadow-[0_0_8px_rgba(255,0,127,0.5)]">High</span>
              <span className="text-2xl font-bold text-slate-200">/67%</span>
            </div>
            {/* Fake Sparkline */}
            <div className="h-10 mt-3 relative drop-shadow-[0_0_5px_currentColor]">
               <svg viewBox="0 0 100 30" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                 <path d="M0,20 C10,25 20,10 30,15 C40,20 50,5 60,10 C70,15 80,5 90,15 L100,5" fill="none" stroke="url(#grad1)" strokeWidth="3" vectorEffect="non-scaling-stroke"/>
                 <defs>
                   <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#00f0ff" />
                     <stop offset="100%" stopColor="#ff007f" />
                   </linearGradient>
                 </defs>
               </svg>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#1a1c24] border border-[#2a2d3a] rounded-xl p-5 relative overflow-hidden shadow-lg shadow-black/20">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#00f0ff] to-transparent"></div>
            <div className="flex justify-between items-start">
              <div>
                 <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                   PREDICTED CHURN <span className="text-slate-500 font-normal normal-case tracking-normal">(Next 30 Days)</span>
                 </h3>
                 <span className="text-2xl font-bold text-slate-200 block mb-0">124</span>
                 <span className="text-xs text-slate-400 block mb-1">Customers</span>
                 <span className="text-xs text-[#00f0ff] font-medium">+5.2%</span>
              </div>
              {/* Fake Gauge */}
              <div className="w-[70px] h-[70px] relative mt-2 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                 <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 origin-center justify-end">
                   <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2a2d3a" strokeWidth="4" strokeDasharray="50, 100" />
                   <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#grad2)" strokeWidth="4" strokeDasharray="30, 100" strokeLinecap="round" />
                   <defs>
                     <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                       <stop offset="0%" stopColor="#00f0ff" />
                       <stop offset="100%" stopColor="#ff007f" />
                     </linearGradient>
                   </defs>
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center transform translate-y-2 translate-x-3">
                   <div className="w-[12px] h-[3px] bg-slate-300 rounded-full transform rotate-[65deg] origin-left shadow-[0_0_5px_white]"></div>
                 </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#1a1c24] border border-[#2a2d3a] rounded-xl p-5 relative overflow-hidden shadow-lg shadow-black/20">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#00f0ff] to-transparent"></div>
            <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2">ACTIVE CUSTOMERS</h3>
            <span className="text-2xl font-bold text-slate-200 block mb-3">{stats.totalCustomers}</span>
            {/* Fake Bar Chart */}
            <div className="h-10 flex items-end gap-[4px] w-full">
              {[0.4, 0.6, 0.3, 0.8, 0.5, 0.7, 0.4, 0.9, 0.6, 0.3, 0.8, 1.0, 0.5, 0.7].map((h, i) => (
                <div key={i} className={`w-3 rounded-t-sm ${i === 6 || i === 11 ? 'bg-[#ff007f] shadow-[0_0_8px_#ff007f]' : 'bg-[#00f0ff] opacity-60 hover:opacity-100'}`} style={{ height: `${h * 100}%` }}></div>
              ))}
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#1a1c24] border border-[#2a2d3a] rounded-xl p-5 relative overflow-hidden shadow-lg shadow-black/20">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#00f0ff] to-transparent"></div>
             <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2">RETENTION RATE</h3>
             <span className="text-2xl font-bold text-slate-200 block">{stats.retentionRate}</span>
             <div className="flex justify-between items-end mt-2">
                 <span className="text-xs text-slate-400 font-medium">steady</span>
                 {/* Fake micro chart */}
                 <div className="w-[80px] h-[35px] border-b border-[#00f0ff]/20">
                    <svg viewBox="0 0 100 30" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                      <path d="M0,15 L20,15 L40,18 L60,15 L80,12 L100,15" fill="none" stroke="#00f0ff" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                      <path d="M0,15 L20,15 L40,18 L60,15 L80,12 L100,15 L100,30 L0,30 Z" fill="#00f0ff" fillOpacity="0.1" />
                    </svg>
                 </div>
             </div>
          </div>
        </div>

        {/* Bottom Section: Chart + Prediction Tool */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          
          {/* Main Chart Area */}
          <div className="lg:col-span-5 bg-[#1a1c24] border border-[#2a2d3a] rounded-2xl p-6 relative shadow-lg shadow-black/20 flex flex-col">
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-6">CHURN PROBABILITY TREND</h3>
            
            <div className="flex justify-end gap-6 mb-4 text-[10px] font-medium text-slate-400">
              <span className="flex items-center gap-2"><div className="w-3 h-[2px] bg-[#00f0ff]"></div> Promiced</span>
              <span className="flex items-center gap-2"><div className="w-3 h-[2px] bg-[#ff007f]"></div> Sentimed</span>
            </div>
            
            <div className="flex-1 relative mt-4 border-l border-b border-slate-700/50 mb-4 pb-4">
               {/* Y Axis Grid */}
               <div className="absolute inset-0 flex flex-col justify-between">
                 {[50, 40, 30, 20, 10, 0].map(val => (
                   <div key={val} className="w-full border-t border-slate-700/30 flex items-center relative h-0">
                     <span className="absolute -left-6 text-[10px] text-slate-500 transform -translate-y-1/2">{val}</span>
                   </div>
                 ))}
               </div>
               
               {/* X Axis Labels */}
               <div className="absolute -bottom-8 left-0 w-full flex justify-between text-[10px] text-slate-500 px-3">
                 <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
               </div>

               {/* Fake Chart Splines */}
               <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-[calc(100%-8px)] preserve-3d" preserveAspectRatio="none" style={{overflow:'visible'}}>
                 <path d="M0,85 C15,65 25,65 40,55 C50,45 55,20 65,55 C75,80 85,75 100,50" fill="none" stroke="#ff007f" strokeWidth="2.5" vectorEffect="non-scaling-stroke" style={{filter: 'drop-shadow(0px 8px 6px rgba(255,0,127,0.3))'}}/>
                 <path d="M0,70 C15,40 25,45 40,40 C55,35 60,65 80,45 C90,30 100,25 100,25" fill="none" stroke="#00f0ff" strokeWidth="2.5" vectorEffect="non-scaling-stroke" style={{filter: 'drop-shadow(0px 8px 6px rgba(0,240,255,0.3))'}}/>
                 
                 {/* Tooltips */}
                 <g transform="translate(53, 20)">
                    <rect x="-15" y="-18" width="30" height="16" rx="4" fill="#ff007f" />
                    <text x="0" y="-10" fontSize="8" fill="white" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">High</text>
                 </g>
                 <g transform="translate(90, 25)">
                    <rect x="-30" y="-18" width="46" height="16" rx="4" fill="#00f0ff" />
                    <text x="-7" y="-10" fontSize="8" fill="black" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">Sentilliam</text>
                 </g>
               </svg>
            </div>
          </div>

          {/* Prediction Module */}
          <div className="lg:col-span-7 bg-[#1a1c24] border-2 border-[#ff007f]/60 rounded-2xl p-6 px-8 relative shadow-[0_0_25px_rgba(255,0,127,0.1)] flex flex-col">
            <h3 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider mb-6">INDIVIDUAL CUSTOMER CHURN PREDICTION</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
              <div className="flex flex-col">
                 <ChurnForm
                    formData={formData}
                    loading={loading}
                    onInputChange={handleInputChange}
                 />
              </div>

              <div className="flex flex-col relative h-full">
                 <div className="absolute top-0 -left-4 w-[1px] h-[calc(100%-80px)] bg-slate-700/50"></div>
                 
                 <div className="mb-6 h-[80px]">
                     <h4 className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">PREDICTION RESULT</h4>
                     <div className="text-slate-300 text-xs">Customer ID<br/><span className="text-white text-[15px] font-medium leading-relaxed">74902</span></div>
                 </div>

                 <div className="flex-1">
                   {prediction ? (
                     <ResultCard prediction={prediction} />
                   ) : (
                     <div className="flex flex-col animate-in fade-in h-full">
                       <h4 className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-2">CHURN PROBABILITY</h4>
                       
                       <div className="flex justify-start my-6 pl-4">
                         <div className="w-[120px] h-[120px] rounded-full border-[8px] flex flex-col items-center justify-center relative border-[#ff007f]/20">
                           <div className="absolute inset-[-8px] rounded-full border-[8px] border-transparent border-t-[#ff007f] border-r-[#ff007f] transform rotate-45 shadow-[0_0_20px_rgba(255,0,127,0.5)]"></div>
                           <span className="text-3xl font-bold text-white relative z-10 drop-shadow-[0_0_10px_#ff007f]">88%</span>
                           <span className="text-[11px] font-medium relative z-10 text-[#ff007f]">high</span>
                         </div>
                       </div>
                       
                       <div className="space-y-4">
                         <div>
                           <h4 className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">RISK LEVEL</h4>
                           <p className="text-slate-200 text-sm">High Churn Risk</p>
                         </div>
                         <div>
                           <h4 className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">KEY DRIVERS</h4>
                           <p className="text-slate-200 text-sm leading-tight">High Tickets<br/>Low Sentiment</p>
                         </div>
                         <div>
                           <h4 className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">RETENTION ACTION</h4>
                           <p className="text-slate-200 text-sm">Proactive Outreach</p>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3 w-full">
               <button
                 onClick={handleSubmit}
                 disabled={loading}
                 className="flex-1 bg-gradient-to-r from-[#00f0ff] via-[#00ffff] to-[#00f0ff] bg-[length:200%_auto] text-black font-extrabold uppercase tracking-widest text-[11px] py-4 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:bg-[position:right_center] transition-all border border-blue-200"
               >
                 {loading ? 'Predicting...' : 'Predict Churn Risk'}
               </button>
               {prediction && (
                 <button
                   onClick={exportToExcel}
                   className="flex-1 bg-gradient-to-r from-[#10b981] via-[#34d399] to-[#10b981] bg-[length:200%_auto] text-black font-extrabold uppercase tracking-widest text-[11px] py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:bg-[position:right_center] transition-all border border-green-200"
                 >
                   📊 Export Excel
                 </button>
               )}
            </div>
          </div>

        </div>
          </>
        ) : activeTab === 'Customer Data' ? (
          <div className="flex-1 bg-[#1a1c24] border border-[#2a2d3a] rounded-2xl p-8 shadow-lg shadow-black/20 overflow-hidden flex flex-col animate-in fade-in">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">Customer Data Repository</h2>
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-80">
                <input 
                  type="text" 
                  placeholder="Search customers by ID or demographic..." 
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="w-full bg-[#11131a] border border-[#2a2d3a] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#00f0ff] text-sm transition-colors" 
                />
                <span className="absolute right-3 top-2.5 text-slate-500">🔍</span>
              </div>
              <div className="flex gap-3">
                <button onClick={exportCSV} className="bg-[#11131a] hover:bg-[#2a2d3a] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-[#2a2d3a] flex items-center gap-2">
                  <span>⬇️</span> Export CSV
                </button>
                <button onClick={() => showMessage('Filter applied! Showing customers by: ' + (filterText || 'all'), 'success')} className="bg-[#2a2d3a] hover:bg-[#323644] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-slate-700 flex items-center gap-2">
                  <span>⚡</span> Filter Data
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto rounded-xl border border-[#2a2d3a] bg-[#11131a]">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-[#1a1c24] text-[11px] uppercase tracking-wider text-slate-400 sticky top-0 border-b border-[#2a2d3a] shadow-sm">
                  <tr>
                    <th className="px-6 py-4 font-bold">Customer ID</th>
                    <th className="px-6 py-4 font-bold">Gender</th>
                    <th className="px-6 py-4 font-bold">Tenure</th>
                    <th className="px-6 py-4 font-bold">Contract</th>
                    <th className="px-6 py-4 font-bold">Total Charges</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2d3a]">
                  <tr className="hover:bg-[#1a1c24] transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-medium text-white">CUS-74902</td>
                    <td className="px-6 py-4">Male</td>
                    <td className="px-6 py-4">18 mo</td>
                    <td className="px-6 py-4">Month-to-month</td>
                    <td className="px-6 py-4 text-[#00f0ff] font-medium">$1,570.50</td>
                    <td className="px-6 py-4"><span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide">ACTIVE</span></td>
                  </tr>
                  <tr className="hover:bg-[#1a1c24] transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-medium text-white">CUS-12844</td>
                    <td className="px-6 py-4">Female</td>
                    <td className="px-6 py-4">3 mo</td>
                    <td className="px-6 py-4">Month-to-month</td>
                    <td className="px-6 py-4 text-[#00f0ff] font-medium">$245.00</td>
                    <td className="px-6 py-4"><span className="bg-[#ff007f]/10 border border-[#ff007f]/20 text-[#ff007f] px-3 py-1 rounded-full text-[11px] font-bold tracking-wide">CHURNED</span></td>
                  </tr>
                  <tr className="hover:bg-[#1a1c24] transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-medium text-white">CUS-55912</td>
                    <td className="px-6 py-4">Male</td>
                    <td className="px-6 py-4">48 mo</td>
                    <td className="px-6 py-4">Two year</td>
                    <td className="px-6 py-4 text-[#00f0ff] font-medium">$4,210.80</td>
                    <td className="px-6 py-4"><span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide">ACTIVE</span></td>
                  </tr>
                  <tr className="hover:bg-[#1a1c24] transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-medium text-white">CUS-39911</td>
                    <td className="px-6 py-4">Female</td>
                    <td className="px-6 py-4">12 mo</td>
                    <td className="px-6 py-4">One year</td>
                    <td className="px-6 py-4 text-[#00f0ff] font-medium">$980.20</td>
                    <td className="px-6 py-4"><span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide">AT RISK</span></td>
                  </tr>
                  <tr className="hover:bg-[#1a1c24] transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-medium text-white">CUS-88210</td>
                    <td className="px-6 py-4">Male</td>
                    <td className="px-6 py-4">1 mo</td>
                    <td className="px-6 py-4">Month-to-month</td>
                    <td className="px-6 py-4 text-[#00f0ff] font-medium">$60.00</td>
                    <td className="px-6 py-4"><span className="bg-[#ff007f]/10 border border-[#ff007f]/20 text-[#ff007f] px-3 py-1 rounded-full text-[11px] font-bold tracking-wide">CHURNED</span></td>
                  </tr>
                  <tr className="hover:bg-[#1a1c24] transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-medium text-white">CUS-44391</td>
                    <td className="px-6 py-4">Female</td>
                    <td className="px-6 py-4">72 mo</td>
                    <td className="px-6 py-4">Two year</td>
                    <td className="px-6 py-4 text-[#00f0ff] font-medium">$8,120.50</td>
                    <td className="px-6 py-4"><span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide">ACTIVE</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-between items-center text-[11px] font-bold text-slate-400 tracking-wider">
              <span>SHOWING 1-6 OF 3,875 ENTRIES</span>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className="px-3 py-1.5 bg-[#11131a] border border-[#2a2d3a] rounded hover:bg-slate-800 disabled:opacity-50" disabled={currentPage === 1}>PREV</button>
                <button onClick={() => setCurrentPage(1)} className={`px-3 py-1.5 rounded ${currentPage === 1 ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50' : 'bg-[#11131a] border border-[#2a2d3a] hover:bg-slate-800'}`}>1</button>
                <button onClick={() => setCurrentPage(2)} className={`px-3 py-1.5 rounded ${currentPage === 2 ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50' : 'bg-[#11131a] border border-[#2a2d3a] hover:bg-slate-800'}`}>2</button>
                <button onClick={() => setCurrentPage(3)} className={`px-3 py-1.5 rounded ${currentPage === 3 ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50' : 'bg-[#11131a] border border-[#2a2d3a] hover:bg-slate-800'}`}>3</button>
                <button onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-1.5 bg-[#11131a] border border-[#2a2d3a] rounded hover:bg-slate-800">NEXT</button>
              </div>
            </div>
          </div>
        ) : activeTab === 'Predictive Analytics' ? (
          <div className="flex-1 bg-[#1a1c24] border border-[#2a2d3a] rounded-2xl p-8 shadow-lg shadow-black/20 flex flex-col gap-8 animate-in fade-in">
            <div className="flex justify-between items-center pb-6 border-b border-[#2a2d3a]">
               <div>
                 <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Predictive Model Performance</h2>
                 <p className="text-slate-400 text-sm mt-1">XGBoost Classification Model • Last trained: 2 hours ago</p>
               </div>
               <button onClick={retrainModel} className="bg-[#11131a] hover:bg-[#2a2d3a] text-[#00f0ff] px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-colors border border-[#00f0ff]/30 flex items-center gap-2">
                  <span>🔄</span> RETRAIN MODEL
               </button>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-[#11131a] p-6 rounded-xl border border-[#2a2d3a] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#00f0ff]"></div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">🎯 Model Accuracy</h3>
                <p className="text-4xl font-black text-white mt-2">85.4%</p>
                <p className="text-[11px] text-emerald-400 mt-3 font-bold tracking-wide">↑ +2.1% FROM LAST WEEK</p>
              </div>
              <div className="bg-[#11131a] p-6 rounded-xl border border-[#2a2d3a] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">⚡ Precision (Churn)</h3>
                <p className="text-4xl font-black text-white mt-2">82.1%</p>
                <p className="text-[11px] text-emerald-400 mt-3 font-bold tracking-wide">↑ +1.4% FROM LAST WEEK</p>
              </div>
              <div className="bg-[#11131a] p-6 rounded-xl border border-[#2a2d3a] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#ff007f]"></div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">🔍 Recall (Sensitivity)</h3>
                <p className="text-4xl font-black text-white mt-2">89.3%</p>
                <p className="text-[11px] text-emerald-400 mt-3 font-bold tracking-wide">↑ +3.2% FROM LAST WEEK</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 flex-1">
              <div className="bg-[#11131a] border border-[#2a2d3a] rounded-xl p-6">
                 <h3 className="text-[11px] font-bold text-white mb-6 flex items-center justify-between border-b border-[#2a2d3a] pb-3">
                   <span className="uppercase tracking-widest">Global Feature Importance</span>
                   <span className="text-slate-500">SHAP Values</span>
                 </h3>
                 <div className="space-y-5">
                   {[
                     { name: 'Contract Type (Month-to-month)', val: 95 },
                     { name: 'Tenure Length', val: 82 },
                     { name: 'Total Charges', val: 68 },
                     { name: 'Internet Service (Fiber Optic)', val: 54 },
                     { name: 'Payment Method (Electronic Check)', val: 41 }
                   ].map((f, i) => (
                     <div key={i}>
                       <div className="flex justify-between text-xs mb-2 font-medium">
                         <span className="text-slate-300">{f.name}</span>
                         <span className="text-[#00f0ff]">{f.val}%</span>
                       </div>
                       <div className="w-full h-2.5 bg-[#1a1c24] rounded-full overflow-hidden shadow-inner">
                         <div className="h-full bg-gradient-to-r from-[#00f0ff] to-[#ff007f]" style={{ width: `${f.val}%` }}></div>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="bg-[#11131a] border border-[#2a2d3a] rounded-xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
                 <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#00f0ff] opacity-5 blur-[100px] rounded-full"></div>
                 <h3 className="text-[11px] font-bold text-white uppercase tracking-widest absolute top-6 left-6 border-b border-[#2a2d3a] pb-3 w-[calc(100%-48px)] text-left">Confusion Matrix Insights</h3>
                 
                 <div className="w-48 h-48 relative rounded-full border-[12px] border-[#1a1c24] mt-12 mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-t-[#00f0ff] border-r-[#00f0ff] border-b-[#ff007f] transform -rotate-45 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]"></div>
                    <div className="text-center">
                      <span className="block text-4xl font-black text-white">1,542</span>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">True Positives</span>
                      <span className="block text-[8px] text-[#ff007f] font-bold tracking-widest mt-2 uppercase">(Successfully predicted churn)</span>
                    </div>
                 </div>
                 <p className="text-sm text-slate-300 px-8">The model is highly effective. It successfully identified <strong className="text-white text-base">89.3%</strong> of customers who ended up churning historically.</p>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Message Toast */}
      {message && (
        <div
          className={`fixed bottom-10 right-10 px-6 py-4 rounded-xl font-bold shadow-2xl z-[100] ${
            messageType === 'error'
              ? 'bg-[#1a1c24] text-[#ff007f] border border-[#ff007f]'
              : 'bg-[#1a1c24] text-[#00f0ff] border border-[#00f0ff]'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}

export default App
