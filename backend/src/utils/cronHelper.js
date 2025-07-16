const cron = require("node-cron");

/**
 * Cron Helper - Handles cron expression validation and next run calculation
 *
 * Assignment Requirements:
 * - Support cron-like schedules (e.g., "every 5 minutes", "daily at 3 AM")
 * - Calculate next execution times
 * - Validate cron expressions
 */

/**
 * Calculate next run time based on cron expression
 * @param {string} cronExpression - The cron expression
 * @returns {Date} - Next execution time
 */
function calculateNextRun(cronExpression) {
  try {
    const now = new Date();

    // Common cron expressions mapping
    const cronPatterns = {
      // Every minute
      "* * * * *": () => new Date(now.getTime() + 60 * 1000),

      // Every 5 minutes
      "*/5 * * * *": () => new Date(now.getTime() + 5 * 60 * 1000),

      // Every 10 minutes
      "*/10 * * * *": () => new Date(now.getTime() + 10 * 60 * 1000),

      // Every 15 minutes
      "*/15 * * * *": () => new Date(now.getTime() + 15 * 60 * 1000),

      // Every 30 minutes
      "*/30 * * * *": () => new Date(now.getTime() + 30 * 60 * 1000),

      // Every hour
      "0 * * * *": () => new Date(now.getTime() + 60 * 60 * 1000),

      // Every 2 hours
      "0 */2 * * *": () => new Date(now.getTime() + 2 * 60 * 60 * 1000),

      // Every 6 hours
      "0 */6 * * *": () => new Date(now.getTime() + 6 * 60 * 60 * 1000),

      // Every 12 hours
      "0 */12 * * *": () => new Date(now.getTime() + 12 * 60 * 60 * 1000),

      // Daily at midnight
      "0 0 * * *": () => {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
      },

      // Daily at 3 AM
      "0 3 * * *": () => {
        const nextRun = new Date(now);
        nextRun.setHours(3, 0, 0, 0);
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        return nextRun;
      },

      // Daily at 6 AM
      "0 6 * * *": () => {
        const nextRun = new Date(now);
        nextRun.setHours(6, 0, 0, 0);
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        return nextRun;
      },

      // Daily at 9 AM
      "0 9 * * *": () => {
        const nextRun = new Date(now);
        nextRun.setHours(9, 0, 0, 0);
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        return nextRun;
      },

      // Daily at 12 PM (noon)
      "0 12 * * *": () => {
        const nextRun = new Date(now);
        nextRun.setHours(12, 0, 0, 0);
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        return nextRun;
      },

      // Daily at 6 PM
      "0 18 * * *": () => {
        const nextRun = new Date(now);
        nextRun.setHours(18, 0, 0, 0);
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        return nextRun;
      },

      // Weekly on Monday at 9 AM
      "0 9 * * 1": () => {
        const nextRun = new Date(now);
        nextRun.setHours(9, 0, 0, 0);
        const daysUntilMonday = (1 - nextRun.getDay() + 7) % 7;
        if (daysUntilMonday === 0 && nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 7);
        } else {
          nextRun.setDate(nextRun.getDate() + daysUntilMonday);
        }
        return nextRun;
      },

      // Weekly on Friday at 5 PM
      "0 17 * * 5": () => {
        const nextRun = new Date(now);
        nextRun.setHours(17, 0, 0, 0);
        const daysUntilFriday = (5 - nextRun.getDay() + 7) % 7;
        if (daysUntilFriday === 0 && nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 7);
        } else {
          nextRun.setDate(nextRun.getDate() + daysUntilFriday);
        }
        return nextRun;
      },

      // Monthly on 1st at midnight
      "0 0 1 * *": () => {
        const nextRun = new Date(now);
        nextRun.setDate(1);
        nextRun.setHours(0, 0, 0, 0);
        if (nextRun <= now) {
          nextRun.setMonth(nextRun.getMonth() + 1);
        }
        return nextRun;
      },
    };

    // Check if we have a predefined pattern
    if (cronPatterns[cronExpression]) {
      return cronPatterns[cronExpression]();
    }

    // For other expressions, default to 1 minute from now
    console.warn(
      `Cron expression '${cronExpression}' not in predefined patterns, defaulting to 1 minute`
    );
    return new Date(now.getTime() + 60 * 1000);
  } catch (error) {
    console.error("Error calculating next run:", error);
    return new Date(Date.now() + 60 * 1000); // Default to 1 minute
  }
}

/**
 * Validate cron expression format
 * @param {string} cronExpression - The cron expression to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidCronExpression(cronExpression) {
  if (!cronExpression || typeof cronExpression !== "string") {
    return false;
  }

  try {
    // Use node-cron's validation
    return cron.validate(cronExpression);
  } catch (error) {
    console.error("Cron validation error:", error);
    return false;
  }
}

/**
 * Get human-readable description of cron expression
 * @param {string} cronExpression - The cron expression
 * @returns {string} - Human-readable description
 */
function describeCronExpression(cronExpression) {
  const descriptions = {
    "* * * * *": "Every minute",
    "*/5 * * * *": "Every 5 minutes",
    "*/10 * * * *": "Every 10 minutes",
    "*/15 * * * *": "Every 15 minutes",
    "*/30 * * * *": "Every 30 minutes",
    "0 * * * *": "Every hour",
    "0 */2 * * *": "Every 2 hours",
    "0 */6 * * *": "Every 6 hours",
    "0 */12 * * *": "Every 12 hours",
    "0 0 * * *": "Daily at midnight",
    "0 3 * * *": "Daily at 3 AM",
    "0 6 * * *": "Daily at 6 AM",
    "0 9 * * *": "Daily at 9 AM",
    "0 12 * * *": "Daily at 12 PM (noon)",
    "0 18 * * *": "Daily at 6 PM",
    "0 9 * * 1": "Weekly on Monday at 9 AM",
    "0 17 * * 5": "Weekly on Friday at 5 PM",
    "0 0 1 * *": "Monthly on 1st at midnight",
  };

  return descriptions[cronExpression] || `Custom schedule: ${cronExpression}`;
}

module.exports = {
  calculateNextRun,
  isValidCronExpression,
  describeCronExpression,
};
