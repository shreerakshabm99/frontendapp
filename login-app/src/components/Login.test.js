import axios from "axios";
jest.mock("axios", () => ({
  post: jest.fn(),
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("./MessageBox", () => ({ type, message }) => (
  <div data-testid="message-box">{message}</div>
));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows landing page with Login button", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText("Welcome to our Website")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("opens login form when Login button is clicked", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText("Login")).toBeInTheDocument();

    const usernameInput = screen.getByLabelText(/enter your username/i);
    // fireEvent.change(usernameInput, { target: { value: 'Hello, World!' } });
    // expect(usernameInput.value).toBe('Hello, World!');

    const passwordInput = screen.getByLabelText(/enter your password/i);
    // fireEvent.change(passwordInput, { target: { value: 'Shree@123' } });
    // expect(passwordInput.value).toBe('Shree@123');
  });

  test("allows user to type into fields", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    const usernameInput = screen.getByLabelText(/enter your username/i);
    const passwordInput = screen.getByLabelText(/enter your password/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("password123");
  });

  test("submits successfully and navigates to /home", async () => {
    jest.useFakeTimers();

    axios.post.mockResolvedValueOnce({ status: 200 });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    fireEvent.change(screen.getByLabelText(/enter your username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/enter your password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    

    await waitFor(() =>
      expect(screen.getByTestId("message-box")).toHaveTextContent("Login Successful!"       
      )
    );
    jest.runAllTimers();
    screen.debug();

    expect(mockNavigate).toHaveBeenCalledWith("/home");

    jest.useRealTimers();
  });

  test("shows error message on invalid credentials", async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 401 } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    const usernameInput = screen.getByLabelText(/enter your username/i);
    const passwordInput = screen.getByLabelText(/enter your password/i);

    fireEvent.change(usernameInput, { target: { value: "wronguser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() =>
      expect(screen.getByTestId("message-box")).toHaveTextContent(
        "Invalid email or password"
      )
    );
  });

  test("shows server error on unexpected failure", async () => {
    axios.post.mockRejectedValueOnce(new Error("Server down"));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    const usernameInput = screen.getByLabelText(/enter your username/i);
    const passwordInput = screen.getByLabelText(/enter your password/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() =>
      expect(screen.getByTestId("message-box")).toHaveTextContent(
        "Server error. Please try again later."
      )
    );
  });

  test("cancel button closes form and clears message", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.queryByRole("button", { name: /log in/i })).not.toBeInTheDocument();

    const messageBox = screen.queryByTestId("message-box");
    if (messageBox) {
      expect(messageBox).toHaveTextContent("");
    }
  });
});
