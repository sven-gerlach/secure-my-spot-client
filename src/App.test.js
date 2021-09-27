import { render, screen } from '@testing-library/react';
import App from './app/app';

test('renders the app', () => {
  render(<App />);
  const textElement = screen.getByText(/is a/i);
  expect(textElement).toBeInTheDocument();
});
