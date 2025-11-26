import { useState } from 'react';
import './App.css';

const START_DATE = new Date('2025-07-14');
const TOTAL_SUPPLY = 1000000000;
const DAILY_POINTS = 1000000;

function App() {
  const [userPoints, setUserPoints] = useState(0);
  const [daysFromNow, setDaysFromNow] = useState(180);
  const [airdropPercent, setAirdropPercent] = useState(10);
  const [fdv, setFdv] = useState(100000000);
  const [customAirdrop, setCustomAirdrop] = useState(false);
  const [customFdv, setCustomFdv] = useState(false);
  const [error, setError] = useState('');

  const calculateResults = () => {
    const today = new Date('2025-11-25');
    const tgeDate = new Date(today);
    tgeDate.setDate(tgeDate.getDate() + daysFromNow);

    if (tgeDate < START_DATE) {
      setError('TGE date must be after July 14, 2025');
      return null;
    }

    setError('');

    const totalDays = Math.floor((tgeDate - START_DATE) / (1000 * 60 * 60 * 24)) + 1;
    const totalPoints = totalDays * DAILY_POINTS;
    const userShare = userPoints / totalPoints;
    const airdropTokens = (airdropPercent / 100) * TOTAL_SUPPLY;
    const userTokens = userShare * airdropTokens;
    const tokenPrice = fdv / TOTAL_SUPPLY;
    const estimatedValue = userTokens * tokenPrice;

    return {
      tgeDate,
      totalDays,
      totalPoints,
      userShare,
      airdropTokens,
      userTokens,
      tokenPrice,
      estimatedValue
    };
  };

  const results = calculateResults();

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(Math.floor(num));
  };

  const formatDecimal = (num, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatPercent = (num) => {
    return (num * 100).toFixed(6);
  };

  const formatFdv = (value) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
    return `$${formatNumber(value)}`;
  };

  const today = new Date('2025-11-25');
  const tgeDate = new Date(today);
  tgeDate.setDate(tgeDate.getDate() + daysFromNow);

  const fdvPresets = [
    { label: '$50M', value: 50000000 },
    { label: '$100M', value: 100000000 },
    { label: '$500M', value: 500000000 },
    { label: '$1B', value: 1000000000 },
    { label: '$2B', value: 2000000000 }
  ];

  const airdropPresets = [5, 10, 15, 20];

  const scenarios = [
    { airdrop: 5, fdv: 50000000 },
    { airdrop: 5, fdv: 100000000 },
    { airdrop: 10, fdv: 100000000 },
    { airdrop: 10, fdv: 500000000 },
    { airdrop: 15, fdv: 500000000 },
    { airdrop: 15, fdv: 1000000000 },
    { airdrop: 20, fdv: 1000000000 },
    { airdrop: 20, fdv: 2000000000 }
  ];

  const calculateScenario = (airdropPercent, fdv) => {
    const totalDays = Math.floor((tgeDate - START_DATE) / (1000 * 60 * 60 * 24)) + 1;
    const totalPoints = totalDays * DAILY_POINTS;
    const userShare = userPoints / totalPoints;
    const airdropTokens = (airdropPercent / 100) * TOTAL_SUPPLY;
    const userTokens = userShare * airdropTokens;
    const tokenPrice = fdv / TOTAL_SUPPLY;
    const estimatedValue = userTokens * tokenPrice;

    return {
      airdropPercent,
      fdv,
      userTokens,
      tokenPrice,
      estimatedValue
    };
  };

  const scenarioResults = scenarios.map(s => calculateScenario(s.airdrop, s.fdv));

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 PRJX Airdrop Estimator</h1>
        <p className="subtitle">Estimate your potential airdrop rewards</p>
      </header>

      <div className="container">
        {/* Input Section */}
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

        {error && <div className="error">{error}</div>}

        {!error && results && (
          <>
            {/* Results Section */}
            <div className="results-section">
              <h2>💰 Your Estimated Airdrop</h2>
              
              <div className="results-grid">
                <div className="result-card highlight">
                  <div className="result-icon">💵</div>
                  <div className="result-label">Estimated Value</div>
                  <div className="result-value big">${formatDecimal(results.estimatedValue, 2)}</div>
                </div>

                <div className="result-card highlight">
                  <div className="result-icon">🪙</div>
                  <div className="result-label">Your Tokens</div>
                  <div className="result-value big">{formatNumber(results.userTokens)}</div>
                </div>

                <div className="result-card">
                  <div className="result-label">Token Price</div>
                  <div className="result-value">${formatDecimal(results.tokenPrice, 6)}</div>
                </div>

                <div className="result-card">
                  <div className="result-label">Your Share</div>
                  <div className="result-value">{formatPercent(results.userShare)}%</div>
                </div>

                <div className="result-card">
                  <div className="result-label">Total Days</div>
                  <div className="result-value">{formatNumber(results.totalDays)}</div>
                </div>

                <div className="result-card">
                  <div className="result-label">Total Points at TGE</div>
                  <div className="result-value">{formatNumber(results.totalPoints)}</div>
                </div>

                <div className="result-card">
                  <div className="result-label">Total Airdrop Tokens</div>
                  <div className="result-value">{formatNumber(results.airdropTokens)}</div>
                </div>

                <div className="result-card">
                  <div className="result-label">TGE Date</div>
                  <div className="result-value small">
                    {results.tgeDate.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario Table */}
            <div className="scenario-section">
              <h2>📈 Multiple Scenarios</h2>
              <p className="scenario-description">
                Compare your potential airdrop value across different allocation percentages and FDV scenarios
              </p>
              
              <div className="table-container">
                <table className="scenario-table">
                  <thead>
                    <tr>
                      <th>Airdrop %</th>
                      <th>FDV</th>
                      <th>Your Tokens</th>
                      <th>Token Price</th>
                      <th>Estimated Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarioResults.map((scenario, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                        <td className="highlight-cell">{scenario.airdropPercent}%</td>
                        <td className="highlight-cell">{formatFdv(scenario.fdv)}</td>
                        <td>{formatNumber(scenario.userTokens)}</td>
                        <td>${formatDecimal(scenario.tokenPrice, 6)}</td>
                        <td className="value-cell">${formatDecimal(scenario.estimatedValue, 2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="footer">
        <p>Point system started: July 14, 2025 | Daily distribution: 1M points</p>
        <p className="disclaimer">⚠️ This is an estimation tool. Actual airdrop amounts may vary.</p>
      </footer>
    </div>
  );
}

export default App;
