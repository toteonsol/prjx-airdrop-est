import './InputSection.css';

function InputSection({
  userPoints,
  setUserPoints,
  daysFromNow,
  setDaysFromNow,
  airdropPercent,
  setAirdropPercent,
  fdv,
  setFdv,
  customAirdrop,
  setCustomAirdrop,
  customFdv,
  setCustomFdv
}) {
  const today = new Date('2025-11-25');
  const tgeDate = new Date(today);
  tgeDate.setDate(tgeDate.getDate() + daysFromNow);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatFdv = (value) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
    return `$${formatNumber(value)}`;
  };

  const fdvPresets = [
    { label: '$50M', value: 50000000 },
    { label: '$100M', value: 100000000 },
    { label: '$500M', value: 500000000 },
    { label: '$1B', value: 1000000000 },
    { label: '$2B', value: 2000000000 }
  ];

  const airdropPresets = [5, 10, 15, 20];

  return (
    <div className="input-section">
      <h2>📊 Input Parameters</h2>
      
      <div className="input-group">
        <label>
          Your Current Points
          <span className="tooltip" title="Total points you've earned since July 14, 2025">ℹ️</span>
        </label>
        <input
          type="number"
          value={userPoints}
          onChange={(e) => setUserPoints(Math.max(0, Number(e.target.value)))}
          placeholder="Enter your points"
          className="number-input"
        />
      </div>

      <div className="input-group">
        <label>
          Estimated TGE Date
          <span className="tooltip" title="Expected Token Generation Event / Snapshot date">ℹ️</span>
        </label>
        <div className="date-display">{tgeDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</div>
        <div className="slider-container">
          <span className="slider-label">Days from now: {daysFromNow}</span>
          <input
            type="range"
            min="0"
            max="365"
            value={daysFromNow}
            onChange={(e) => setDaysFromNow(Number(e.target.value))}
            className="slider"
          />
          <div className="slider-range">
            <span>Today</span>
            <span>+365 days</span>
          </div>
        </div>
      </div>

      <div className="input-group">
        <label>
          Airdrop Allocation (% of Total Supply)
          <span className="tooltip" title="Percentage of total token supply allocated to airdrop">ℹ️</span>
        </label>
        <div className="preset-buttons">
          {airdropPresets.map(preset => (
            <button
              key={preset}
              className={`preset-btn ${!customAirdrop && airdropPercent === preset ? 'active' : ''}`}
              onClick={() => {
                setCustomAirdrop(false);
                setAirdropPercent(preset);
              }}
            >
              {preset}%
            </button>
          ))}
          <button
            className={`preset-btn ${customAirdrop ? 'active' : ''}`}
            onClick={() => setCustomAirdrop(true)}
          >
            Custom
          </button>
        </div>
        {customAirdrop && (
          <div className="slider-container">
            <span className="slider-label">{airdropPercent}%</span>
            <input
              type="range"
              min="1"
              max="50"
              step="0.5"
              value={airdropPercent}
              onChange={(e) => setAirdropPercent(Number(e.target.value))}
              className="slider"
            />
          </div>
        )}
      </div>

      <div className="input-group">
        <label>
          Fully Diluted Valuation (FDV)
          <span className="tooltip" title="Total market cap if all tokens were in circulation">ℹ️</span>
        </label>
        <div className="preset-buttons">
          {fdvPresets.map(preset => (
            <button
              key={preset.value}
              className={`preset-btn ${!customFdv && fdv === preset.value ? 'active' : ''}`}
              onClick={() => {
                setCustomFdv(false);
                setFdv(preset.value);
              }}
            >
              {preset.label}
            </button>
          ))}
          <button
            className={`preset-btn ${customFdv ? 'active' : ''}`}
            onClick={() => setCustomFdv(true)}
          >
            Custom
          </button>
        </div>
        {customFdv && (
          <div className="slider-container">
            <span className="slider-label">{formatFdv(fdv)}</span>
            <input
              type="range"
              min="10000000"
              max="5000000000"
              step="10000000"
              value={fdv}
              onChange={(e) => setFdv(Number(e.target.value))}
              className="slider"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default InputSection;
