import { FormEvent, useState } from "react";
import { IEXEC_API_URL, IEXEC_EXPLORER_URL } from "../utils/constants";

// Signup : Protect email and grant access to web3mail app
async function signup(email: string): Promise<string> {
  console.log("Signing up :", email);

  const url = IEXEC_API_URL;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({email}),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const { data } = await response.json();
      return data.dataset;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

export function SignUpComponent() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resultTxHash, setResultTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const signupResult = await signup(email);
      setResultTxHash(signupResult);
      setError("");
      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);
      if (error instanceof Error) {
        if (
          error.message ===
            "Signup process failed: WorkflowError: Protect data unexpected error" ||
          error.message === "Protect data unexpected error"
        ) {
          setError("You need to connect with Metamask on the iExec chain.");
        } else {
          setError(error.message);
        }
      } else {
        throw new Error(
          "An unexpected error occurred during the signup process."
        );
      }
    }
  };

  return (
    <div>
      {!resultTxHash && (
        <form onSubmit={handleSignUp}>
          <p className="read-the-docs">Be notified if a risk appears</p>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <button onClick={handleSignUp}>
            Sign Up
          </button>
        </form>
      )}
      {loading && <p>loading</p>}
      {error && <p>Error: {error}</p>}
      {resultTxHash && (
        <div>
          <h1>We got you covered ! </h1>
          <img className="covered-img" src="https://uploads-ssl.webflow.com/663c84182f79d7bbfdc5126b/663c84182f79d7bbfdc51291_Verified.png" />
          <h4>Private Signup Successful, if something happens you will instantly get notified</h4>
          <p>
            Your email is keep private and secure by {" "}
            <a target="_blank" href={IEXEC_EXPLORER_URL + resultTxHash}>
              iExec web3mail
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
