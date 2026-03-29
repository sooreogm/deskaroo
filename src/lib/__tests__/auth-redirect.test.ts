import { getSafeRedirectTarget } from '@/lib/auth-redirect';

describe('getSafeRedirectTarget', () => {
  it('returns the fallback when no redirect target is provided', () => {
    expect(getSafeRedirectTarget(null)).toBe('/dashboard');
  });

  it('keeps safe in-app paths intact', () => {
    expect(getSafeRedirectTarget('/checkin?desk=desk-1')).toBe('/checkin?desk=desk-1');
  });

  it('rejects absolute external URLs', () => {
    expect(getSafeRedirectTarget('https://example.com/checkin')).toBe('/dashboard');
  });

  it('rejects protocol-relative URLs', () => {
    expect(getSafeRedirectTarget('//example.com/checkin')).toBe('/dashboard');
  });
});
