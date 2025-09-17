import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Home from './Home';
import { Router } from 'react-router-dom';

// Mock the group image import
jest.mock('../assets/group.png', () => 'group.png');

describe('Home Component', () => {
  test('renders initial logged-in message', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/Successfully logged in/i)).toBeInTheDocument();
  });

  test('shows content after 2 seconds', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Wait for 2 seconds + a little buffer
    await waitFor(() => {
      expect(screen.getByText(/Welcome to sony!!!/i)).toBeInTheDocument();
      expect(screen.getByText(/Congratulations/i)).toBeInTheDocument();
      expect(screen.getByText(/We have successfully completed our first GIT Collab project/i)).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', 'group.png');
    }, { timeout: 3000 });
  });

  test('renders logout button after content is shown', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('navigates to login page on logout button click', async () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <Home />
      </Router>
    );

    // Wait for content to show
    await waitFor(() => {
      expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    fireEvent.click(screen.getByText(/Logout/i));
    expect(history.location.pathname).toBe('/Login');
  });
});
