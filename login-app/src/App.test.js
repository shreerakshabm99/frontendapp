import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock the Home and Login components
jest.mock('./components/Home', () => () => <div>Home Component</div>);
jest.mock('./components/Login', () => () => <div>Login Component</div>);

describe('App Routing', () => {
  test('renders Login component on default route "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Login Component')).toBeInTheDocument();
  });

  test('renders Home component on "/home" route', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Home Component')).toBeInTheDocument();
  });

  test('renders Login component on "/Login" route', () => {
    render(
      <MemoryRouter initialEntries={['/Login']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Login Component')).toBeInTheDocument();
  });

  // test('shows nothing for unknown route', () => {
  //   render(
  //     <MemoryRouter initialEntries={['/unknown']}>
  //       <App />
  //     </MemoryRouter>
  //   );
  //   expect(screen.queryByText('Login Component')).not.toBeInTheDocument();
  //   expect(screen.queryByText('Home Component')).not.toBeInTheDocument();
  // });
});