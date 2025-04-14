function formatNickname(format, data) {
  const placeholders = {
    '{username}': data.username,
    '{networkRank}': data.networkRank,
    '{sbLevel}': data.sbLevel
    // Add more placeholders here if needed
  };

  let formatted = format;
  for (const [key, value] of Object.entries(placeholders)) {
    formatted = formatted.replaceAll(key, value ?? '');
  }

  return formatted.trim();
}

module.exports = formatNickname;