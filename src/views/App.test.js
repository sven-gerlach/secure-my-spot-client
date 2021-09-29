import { render, screen } from '@testing-library/react';
// import '@testing-library/jest-dom';
import App from './app';

test('renders the app', () => {
  render(<App />);
  const textElement = screen.getByText(/is a/i);
  expect(textElement).toBeInTheDocument();
});

test('renders a message', () => {
  const {container, getByText} = render(<App />)
  expect(getByText(/is a/i)).toBeInTheDocument()
  expect(container.firstChild).toMatchInlineSnapshot(`
    <p>
      This is a test
    </p>
  `)
})
