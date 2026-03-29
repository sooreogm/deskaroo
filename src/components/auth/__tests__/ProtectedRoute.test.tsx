import { screen } from '@testing-library/react';
import { render } from '@/test-utils/test-helpers';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const replace = jest.fn();
let pathname = '/checkin';
let searchParams = new URLSearchParams('desk=desk-1');

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace,
  }),
  usePathname: () => pathname,
  useSearchParams: () => searchParams,
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    replace.mockReset();
    pathname = '/checkin';
    searchParams = new URLSearchParams('desk=desk-1');
  });

  it('redirects unauthenticated users to login with their current URL preserved', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      isAdmin: false,
    });

    render(
      <ProtectedRoute>
        <div>Hidden</div>
      </ProtectedRoute>
    );

    expect(replace).toHaveBeenCalledWith('/login?redirectTo=%2Fcheckin%3Fdesk%3Ddesk-1');
  });

  it('renders children for authenticated users', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user-1' },
      loading: false,
      isAdmin: false,
    });

    render(
      <ProtectedRoute>
        <div>Allowed</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Allowed')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
