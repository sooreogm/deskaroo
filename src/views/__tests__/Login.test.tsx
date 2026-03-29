import type { AnchorHTMLAttributes } from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { render } from '@/test-utils/test-helpers';
import Login from '@/views/Login';
import { useAuth } from '@/contexts/AuthContext';

const replace = jest.fn();
const push = jest.fn();
const signIn = jest.fn();
const toastSuccess = jest.fn();
const toastError = jest.fn();
let searchParams = new URLSearchParams('redirectTo=%2Fcheckin%3Fdesk%3Ddesk-1');

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/components/navbar/Logo', () => ({
  __esModule: true,
  default: () => <div>Logo</div>,
}));

jest.mock('@/utils/users', () => ({
  resendEmailVerification: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace,
    push,
  }),
  useSearchParams: () => searchParams,
}));

describe('Login', () => {
  beforeEach(() => {
    replace.mockReset();
    push.mockReset();
    signIn.mockReset();
    toastSuccess.mockReset();
    toastError.mockReset();
    searchParams = new URLSearchParams('redirectTo=%2Fcheckin%3Fdesk%3Ddesk-1');

    (useAuth as jest.Mock).mockReturnValue({
      signIn,
      user: null,
    });
  });

  it('redirects to the preserved path after a successful sign-in', async () => {
    signIn.mockResolvedValue({ error: null });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/work email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('user@example.com', 'password123');
    });

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('/checkin?desk=desk-1');
    });

    expect(toastSuccess).toHaveBeenCalledWith('Welcome back!');
  });

  it('redirects an already authenticated user to the preserved path', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      signIn,
      user: { id: 'user-1' },
    });

    render(<Login />);

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('/checkin?desk=desk-1');
    });
  });
});
