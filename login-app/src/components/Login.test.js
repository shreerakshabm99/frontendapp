import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import axios from "axios";

// Mock axios
jest.mock("axios");

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock MessageBox
jest.mock("./MessageBox", () => ({ type, message }) => (
  <div data-testid="message-box">{message}</div>
));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders landing screen initially", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText("Welcome to our Website")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("opens login form when login button is clicked", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enter your password/i)).toBeInTheDocument();
  });

  test("allows user to type into email and password fields", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    const emailInput = screen.getByLabelText(/enter your email/i);
    const passwordInput = screen.getByLabelText(/enter your password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("submits form successfully and navigates to /home", async () => {
    axios.post.mockResolvedValueOnce({ status: 200 });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    fireEvent.change(screen.getByLabelText(/enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/enter your password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    // Wait for success message
    await waitFor(() =>
      expect(screen.getByTestId("message-box")).toHaveTextContent(
        "Login Successful!"
      )
    );

    // Navigation called
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/home"));
  });

  test("shows error message on invalid credentials (401)", async () => {
    axios.post.mockRejectedValueOnce({
      response: { status: 401 },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    fireEvent.change(screen.getByLabelText(/enter your email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/enter your password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() =>
      expect(screen.getByTestId("message-box")).toHaveTextContent(
        "Invalid email or password"
      )
    );
  });

  test("shows generic error message on server error", async () => {
    axios.post.mockRejectedValueOnce(new Error("Server down"));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    fireEvent.change(screen.getByLabelText(/enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/enter your password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() =>
      expect(screen.getByTestId("message-box")).toHaveTextContent(
        "Server error. Please try again later."
      )
    );
  });

  test("cancel button closes the form and clears message", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.queryByText("Login")).not.toBeInTheDocument();
    expect(screen.queryByTestId("message-box")).not.toHaveTextContent();
  });
});
