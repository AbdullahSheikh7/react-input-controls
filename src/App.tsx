import { SetStateAction, useEffect, useRef, useState } from "react";
import "./css/input.css";
import "./css/submit.css";

const InputEmail = ({
  placeholder,
  name,
  validated,
  setValidated,
  email,
  setEmail,
}: {
  placeholder: string;
  name: string;
  validated: boolean,
  setValidated: React.Dispatch<SetStateAction<boolean>>,
  email: string,
  setEmail: React.Dispatch<SetStateAction<string>>,
}) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const inputEmail = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetch("/users.json")
        .then(async (res) => await res.json())
        .then((data) => setEmails(data));
      setLoading(false);
    })();
  }, []);

  const incorrect = (error: string) => {
    setError(error);
    setLoading(true);
    setValidated(false);
  };

  const correct = () => {
    setError("");
    setLoading(false);
    setValidated(true);
  };

  const handleChange = (e: any) => {
    setEmail(e.target.value);

    if (
      !e.target.value.match(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      ) &&
      e.target.value !== "@" &&
      e.target.value !== ""
    ) {
      incorrect("Enter a valid email");
      return;
    } else if (emails.includes(e.target.value.toLowerCase())) {
      incorrect("Username already exists");
      return;
    } else {
      correct();
    }
  };

  const handleClick = (e: any) => {
    if (email.match(/^@/)) {
      e.target.setSelectionRange(0, 0);
    }
  };

  if (inputEmail.current) inputEmail.current.onfocus = (e: any) => {
    if (email.match(/^@/)) {
      e.target.setSelectionRange(0, 0);
    }
  }

  if (inputEmail.current) inputEmail.current.onselectionchange = () => {};

  const handleKeyDown = (e: any) => {
    if (inputEmail.current?.selectionStart !== inputEmail.current?.selectionEnd) {
      const text = email.slice(inputEmail.current?.selectionStart || 0, inputEmail.current?.selectionEnd || 0)
      if (text.includes("@")) {
        e.preventDefault();
        if (inputEmail.current) inputEmail.current.value = email.replace(text, "@");
      }
    }

    if (e.key === "@") {
      if (inputEmail.current?.selectionEnd === email.indexOf("@")) {
        inputEmail.current?.setSelectionRange(
          inputEmail.current?.value.indexOf("@") + 1,
          inputEmail.current?.value.indexOf("@") + 1
        );
      }
      e.preventDefault();
    }

    if (
      email.charAt(inputEmail.current?.selectionEnd || 0) === "@" &&
      e.key === "Delete"
    ) {
      e.preventDefault();
      inputEmail.current?.setSelectionRange(
        inputEmail.current?.value.indexOf("@") + 1,
        inputEmail.current?.value.indexOf("@") + 1
      );
    } else if (
      email.charAt((inputEmail.current?.selectionEnd || 1) - 1) === "@" &&
      e.key === "Backspace"
    ) {
      e.preventDefault();
      inputEmail.current?.setSelectionRange(
        inputEmail.current?.value.indexOf("@"),
        inputEmail.current?.value.indexOf("@")
      );
    }
  };

  return (
    <>
      <div
        className={`textfield ${loading ? "progress" : ""} ${
          email !== "@" && email !== ""
            ? validated
              ? "correct filled"
              : "incorrect filled"
            : ""
        }`}
      >
        <input
          ref={inputEmail}
          type="text"
          name={name}
          id="input-text"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          value={email}
        />

        <span className="element icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            viewBox="0 -960 960 960"
            width="30px"
          >
            <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
          </svg>
        </span>

        <p className="element placeholder">{placeholder}</p>

        <span className="element loader"></span>

        <p className={`element error ${error && "visible"}`}>{error}</p>
      </div>
    </>
  );
};

const Submit = ({ validated, email }: { validated: boolean, email: string }) => {
  const submit = () => {
    if (validated && email !== "" && email !== "@") alert(email)
  }

  return (
    <button onClick={submit} className={`submit ${validated && email !== "" && email !== "@" ? "enabled" : "disabled"}`}>Submit →</button>
  )
}

const App = () => {
  const [email, setEmail] = useState<string>("");

  const [validated, setValidated] = useState<boolean>(false);

  return (
    <>
      <div className="container">
        <InputEmail email={email} setEmail={setEmail} validated={validated} setValidated={setValidated} placeholder="Email" name="email" />
        <Submit validated={validated} email={email} />
      </div>
    </>
  );
};

export default App;
