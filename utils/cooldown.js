const cooldowns = new Map();

function checkCooldown(commandName, userId, cooldownMs = 5 * 1000) { // 5 seconds default
  const key = `${commandName}_${userId}`;
  const now = Date.now();

  if (cooldowns.has(key)) {
    const expiration = cooldowns.get(key);
    if (now < expiration) {
      return { allowed: false, remainingTime: Math.ceil((expiration - now) / 1000) };
    }
  }

  cooldowns.set(key, now + cooldownMs);
  setTimeout(() => cooldowns.delete(key), cooldownMs);
  return { allowed: true, remainingTime: 0 };
}

module.exports = { checkCooldown };
