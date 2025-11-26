import './ScenarioTable.css';

const START_DATE = new Date('2025-07-14');
const TOTAL_SUPPLY = 1000000000;
const DAILY_POINTS = 1000000;

function ScenarioTable({ userPoints, daysFromNow, scenarios }) {
  const today = new Date('2025-11-25');
  const tgeDate = new Date(today);
  tgeDate.setDate(tgeDate.getDate() + daysFromNow);
  
  const totalDays = Math.floor((tgeDate - START_DATE) / (1000 * 60 * 60 * 24)) + 1;
  const totalPoints = totalDays * DAILY_POINTS;
  const userShare = userPoints / totalPoints;

  const calculateScenario = (airdropPercent, fdv) => {
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

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(Math.floor(num));
  };

  const formatFdv = (value) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
    return `$${formatNumber(value)}`;
  };

  const formatDecimal = (num, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const scenarioResults = scenarios.map(s => calculateScenario(s.airdrop, s.fdv));

  return (
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
  );
}

export default ScenarioTable;
