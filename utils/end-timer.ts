export const handle = (start: boolean): void => {
  if ("vibrate" in navigator && start) {
    // vibration API supported
    navigator.vibrate([100, 100, 100, 100, 100])
  }
  const alarm = new Audio('/sounds/alarm.mp3');
  alarm.volume = 0.5;
  start ? alarm.play() : alarm.pause();
  setTimeout(() => alarm.pause(), 5000)
}