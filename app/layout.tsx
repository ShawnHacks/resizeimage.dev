import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// Root layout for non-localized routes and fallback handling
export default function RootLayout({ children }: Props) {
  return children;
}
