/**
 * Super Deluxe Softies & Smiles — Deterministic Flavour Rotation Engine
 *
 * Implements identical calendar-day rotation logic in Asia/Kolkata timezone:
 * elapsedDays = daysBetween(today, startDate)
 * dayIndex = ((elapsedDays % 10) + 10) % 10
 * displayDay = dayIndex + 1
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FlavourRotation = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TIMEZONE = 'Asia/Kolkata';
  const CYCLE_LENGTH = 10;

  /**
   * Get current calendar date string (YYYY-MM-DD) in Asia/Kolkata timezone.
   * Does NOT rely on visitor's local timezone.
   */
  function getKolkataDateString(dateObj = new Date()) {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(dateObj);
  }

  /**
   * Parse YYYY-MM-DD date string as UTC midnight timestamp to guarantee
   * exact calendar day math without any DST or local browser offset distortion.
   */
  function dateStringToUtcMs(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return Date.UTC(year, month - 1, day);
  }

  /**
   * Calculate whole calendar days between two YYYY-MM-DD date strings.
   */
  function daysBetweenCalendarDates(targetDateStr, anchorDateStr) {
    const targetMs = dateStringToUtcMs(targetDateStr);
    const anchorMs = dateStringToUtcMs(anchorDateStr);
    const MS_PER_DAY = 86400000;
    return Math.round((targetMs - anchorMs) / MS_PER_DAY);
  }

  /**
   * Core deterministic rotation calculation.
   * Returns: { dayIndex: 0..9, displayDay: 1..10, elapsedDays }
   */
  function calculateRotation(targetDateStr, anchorDateStr, cycleLength = CYCLE_LENGTH) {
    const elapsedDays = daysBetweenCalendarDates(targetDateStr, anchorDateStr);
    // Positive modulo in range [0, cycleLength - 1]
    const dayIndex = ((elapsedDays % cycleLength) + cycleLength) % cycleLength;
    const displayDay = dayIndex + 1;
    return {
      dayIndex,
      displayDay,
      elapsedDays,
      targetDate: targetDateStr,
      anchorDate: anchorDateStr,
      cycleLength
    };
  }

  /**
   * Calculates seconds remaining until midnight in Asia/Kolkata timezone.
   */
  function getSecondsUntilMidnightKolkata() {
    const now = new Date();
    // Get formatted time parts in Asia/Kolkata
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: TIMEZONE,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const parts = formatter.formatToParts(now);
    let hours = 0, minutes = 0, seconds = 0;
    for (const p of parts) {
      if (p.type === 'hour') hours = parseInt(p.value, 10);
      if (p.type === 'minute') minutes = parseInt(p.value, 10);
      if (p.type === 'second') seconds = parseInt(p.value, 10);
    }
    // Handle 24 hours edge case in formatting
    if (hours === 24) hours = 0;
    const elapsedSecondsToday = hours * 3600 + minutes * 60 + seconds;
    const secondsLeft = 86400 - elapsedSecondsToday;
    return Math.max(0, secondsLeft);
  }

  /**
   * Format seconds into HH:MM:SS string.
   */
  function formatCountdown(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  }

  return {
    TIMEZONE,
    CYCLE_LENGTH,
    getKolkataDateString,
    daysBetweenCalendarDates,
    calculateRotation,
    getSecondsUntilMidnightKolkata,
    formatCountdown
  };
});
