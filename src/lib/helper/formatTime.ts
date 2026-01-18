export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}j ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}d`;
  }
  return `${secs}d`;
};

