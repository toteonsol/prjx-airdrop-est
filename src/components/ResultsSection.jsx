import './ResultsSection.css';

function ResultsSection({ results }) {
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

  return (
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
  );
}

export default ResultsSection;
