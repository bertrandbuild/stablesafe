import { useState } from "react";
import { EXPLORER_URL } from "../constants";
import { IExecDataProtectorManager } from "../services/iExecDataProtector";

// Signup : Protect email and grant access to web3mail app
async function signup(email: string): Promise<string> {
  console.log("Signing up :", email);
  const dataProtector = new IExecDataProtectorManager();
  if (!dataProtector) {
    throw new Error("Data protector is not available.");
  }
  try {
    const tx = dataProtector.protectEmailAndGrantAccess(email);
    return tx;
  } catch (error) {
    throw new Error("Signup process failed: " + error);
  }
}

export function SignUpComponent() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resultTxHash, setResultTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSignUp = async () => {
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
          "Signup process failed: WorkflowError: Protect data unexpected error"
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
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <button onClick={handleSignUp}>Sign Up</button>
      {loading && <p>loading</p>}
      {error && <p>Error: {error}</p>}
      {resultTxHash && (
        <div>
          <h4>Private Signup Successful</h4>
          <p>
            You can check the transaction proof on the{" "}
            <a target="_blank" href={EXPLORER_URL + resultTxHash}>
              iExec chain explorer
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
