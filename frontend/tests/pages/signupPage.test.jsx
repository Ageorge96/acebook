import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { useNavigate } from "react-router-dom";
import { signup } from "../../src/services/authentication";

import { SignupPage } from "../../src/pages/Signup/SignupPage";

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

// Mocking the signup service
vi.mock("../../src/services/authentication", () => {
  const signupMock = vi.fn();
  return { signup: signupMock };
});

// Reusable function for filling out signup form
const completeSignupForm = async () => {
  const user = userEvent.setup();

  const usernameInputEl = screen.getByLabelText("Username:");
  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const pictureInputEl = screen.getByLabelText("Add Profile Picture:")
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(usernameInputEl, "Ang");
  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "1234");
  const file = new File(["profile_picture"], "profile_picture.png", {
    type: "img",
  });
  await user.upload(pictureInputEl, file);
  await user.click(submitButtonEl);
};

describe("Signup Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("allows a user to signup", async () => {
    render(<SignupPage />);

    await completeSignupForm();

    expect(signup).toHaveBeenCalledWith("Ang", "test@email.com", "1234", `C:\\fakepath\\profile_picture.png`);
  });

  test("navigates to /login on successful signup", async () => {
    render(<SignupPage />);

    const navigateMock = useNavigate();

    await completeSignupForm();

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  test("navigates to /signup on unsuccessful signup", async () => {
    render(<SignupPage />);

    signup.mockRejectedValue(new Error("Error signing up"));
    const navigateMock = useNavigate();

    await completeSignupForm();

    expect(navigateMock).toHaveBeenCalledWith("/signup");
  });
});