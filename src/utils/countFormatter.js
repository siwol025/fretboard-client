const countFormatter = (count) => {
  const format = [
    { unit: 1e3, abbreviation: 'K' },
    { unit: 1e6, abbreviation: 'M' },
    { unit: 1e9, abbreviation: 'B' },
    { unit: 1e12, abbreviation: 'T' },
    { unit: 1e15, abbreviation: 'P' },
    { unit: 1e18, abbreviation: 'E' },
  ];

  if (count < 1000) {
    return String(count);
  }

  const item = [...format].reverse().find(f => count >= f.unit);

  return (count / item.unit).toFixed(2) + item.abbreviation;
};

export default countFormatter;
