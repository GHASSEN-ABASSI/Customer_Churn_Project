// Note: button moved to App.jsx to mimic exact alignment in the image
export default function ChurnForm({ formData, loading, onInputChange }) {
  return (
    <form className="grid grid-cols-2 gap-x-4 gap-y-3">
      <div>
        <label className="input-label">Gender</label>
        <select name="gender" value={formData.gender} onChange={onInputChange} className="input-field bg-[#1a1c24]" required>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div>
        <label className="input-label">Senior Citizen</label>
        <select name="SeniorCitizen" value={formData.SeniorCitizen} onChange={onInputChange} className="input-field bg-[#1a1c24]" required>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>

      <div>
        <label className="input-label">Partner</label>
        <select name="Partner" value={formData.Partner} onChange={onInputChange} className="input-field bg-[#1a1c24]" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div>
        <label className="input-label">Dependents</label>
        <select name="Dependents" value={formData.Dependents} onChange={onInputChange} className="input-field bg-[#1a1c24]" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div>
        <label className="input-label">Tenure (Months)</label>
        <input type="number" name="tenure" min="0" value={formData.tenure} onChange={onInputChange} className="input-field" required />
      </div>

      <div>
        <label className="input-label">Phone Service</label>
        <select name="PhoneService" value={formData.PhoneService} onChange={onInputChange} className="input-field bg-[#1a1c24]" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div className="col-span-2">
        <label className="input-label">Multiple Lines</label>
        <select name="MultipleLines" value={formData.MultipleLines} onChange={onInputChange} className="input-field bg-[#1a1c24]" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="No phone service">No phone service</option>
        </select>
      </div>

      <div className="col-span-2">
        <label className="input-label">Internet Service</label>
        <select name="InternetService" value={formData.InternetService} onChange={onInputChange} className="input-field bg-[#1a1c24]" required>
          <option value="Fiber optic">Fiber optic</option>
          <option value="DSL">DSL</option>
          <option value="No">No</option>
        </select>
      </div>

      <div>
        <label className="input-label">Online Security</label>
        <select name="OnlineSecurity" value={formData.OnlineSecurity} onChange={onInputChange} className="input-field bg-[#1a1c24]" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="No internet service">No internet service</option>
        </select>
      </div>

      <div>
        <label className="input-label">Online Backup</label>
        <select name="OnlineBackup" value={formData.OnlineBackup} onChange={onInputChange} className="input-field bg-[#1a1c24]" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="No internet service">No internet service</option>
        </select>
      </div>

      <div>
        <label className="input-label">Device Protection</label>
        <select name="DeviceProtection" value={formData.DeviceProtection} onChange={onInputChange} className="input-field bg-[#1a1c24]" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="No internet service">No internet service</option>
        </select>
      </div>

      <div>
        <label className="input-label">Tech Support</label>
        <select name="TechSupport" value={formData.TechSupport} onChange={onInputChange} className="input-field bg-[#1a1c24]" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="No internet service">No internet service</option>
        </select>
      </div>

      <div>
        <label className="input-label">Streaming TV</label>
        <select name="StreamingTV" value={formData.StreamingTV} onChange={onInputChange} className="input-field bg-[#1a1c24]" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="No internet service">No internet service</option>
        </select>
      </div>

      <div>
        <label className="input-label">Streaming Movies</label>
        <select name="StreamingMovies" value={formData.StreamingMovies} onChange={onInputChange} className="input-field bg-[#1a1c24]" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="No internet service">No internet service</option>
        </select>
      </div>

      <div className="col-span-2">
        <label className="input-label">Contract</label>
        <select name="Contract" value={formData.Contract} onChange={onInputChange} className="input-field bg-[#1a1c24]" required>
          <option value="Month-to-month">Month-to-month</option>
          <option value="One year">One year</option>
          <option value="Two year">Two year</option>
        </select>
      </div>

      <div>
        <label className="input-label">Paperless Billing</label>
        <select name="PaperlessBilling" value={formData.PaperlessBilling} onChange={onInputChange} className="input-field bg-[#1a1c24]" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div>
        <label className="input-label">Payment Method</label>
        <select name="PaymentMethod" value={formData.PaymentMethod} onChange={onInputChange} className="input-field bg-[#1a1c24]" required>
          <option value="Electronic check">Electronic check</option>
          <option value="Mailed check">Mailed check</option>
          <option value="Bank transfer (automatic)">Bank transfer (automatic)</option>
          <option value="Credit card (automatic)">Credit card (automatic)</option>
        </select>
      </div>

      <div>
        <label className="input-label">Monthly Charges</label>
        <input type="number" step="0.01" name="MonthlyCharges" value={formData.MonthlyCharges} onChange={onInputChange} className="input-field" required />
      </div>

      <div>
        <label className="input-label">Total Charges</label>
        <input type="number" step="0.01" name="TotalCharges" value={formData.TotalCharges} onChange={onInputChange} className="input-field" required />
      </div>
    </form>
  )
}
