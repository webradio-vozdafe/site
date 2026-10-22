import { describe, it, expect } from 'vitest';
import { requestNotificationPermission } from './notifications';

describe('Notifications Utility', () => {
  it('should be defined', () => {
    expect(requestNotificationPermission).toBeDefined();
  });
});
