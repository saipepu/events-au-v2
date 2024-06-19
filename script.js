function validateTime(time) {
  const timeRegex = /^$|^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

// Test cases
console.log(validateTime(""));         // true
console.log(validateTime(null));       // false (you might want to handle null separately)
console.log(validateTime("12:34"));