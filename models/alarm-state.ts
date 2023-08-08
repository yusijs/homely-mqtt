/**
 * Valid alarm states from Homely
 */
export type AlarmState =
  | 'DISARMED'
  | 'ARMED_AWAY'
  | 'ARMED_NIGHT'
  | 'ARMED_PARTLY'
  | 'BREACHED'
  | 'ALARM_PENDING'
  | 'ALARM_STAY_PENDING'
  | 'ARMED_NIGHT_PENDING'
  | 'ARMED_AWAY_PENDING';

/**
 * Valid alarm states for Home Assistant
 */
export type HomeAssistantAlarmState =
  | 'disarmed'
  | 'armed_home'
  | 'armed_away'
  | 'armed_night'
  | 'armed_vacation'
  | 'armed_custom_bypass'
  | 'pending'
  | 'triggered'
  | 'arming'
  | 'disarming';

/**
 * Map Homely alarm states to Home Assistant alarm states
 */
export const HomelyAlarmStateToHomeAssistant: Record<
  AlarmState,
  HomeAssistantAlarmState
> = {
  DISARMED: 'disarmed',
  ARMED_AWAY: 'armed_away',
  ARMED_NIGHT: 'armed_night',
  ARMED_PARTLY: 'armed_home',
  BREACHED: 'triggered',
  ALARM_PENDING: 'pending',
  ALARM_STAY_PENDING: 'pending',
  ARMED_NIGHT_PENDING: 'pending',
  ARMED_AWAY_PENDING: 'pending',
};
