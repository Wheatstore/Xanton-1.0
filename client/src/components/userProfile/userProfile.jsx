import { useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Mail,
  MessageSquareText,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { auth } from "../../firebase";
import "./userProfile.css";

const FALLBACK_AVATAR = "/images/Default_pfp.svg.png";

function formatAccountDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function UserProfile() {
  const [user, loading] = useAuthState(auth);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) setUsername(user.displayName || "");
  }, [user]);

  const originalName = user?.displayName || "";
  const hasChanges = username.trim() !== originalName;
  const providerName = useMemo(() => {
    const providerId = user?.providerData?.[0]?.providerId;
    if (providerId === "google.com") return "Google";
    if (providerId === "password") return "Email and password";
    return providerId ? "Connected account" : "Not available";
  }, [user]);

  const handleUsernameInput = (event) => {
    const value = event.target.value;
    setUsername(value);
    setStatus("");

    if (!value.trim()) {
      setError("Enter a display name.");
    } else if (value.length > 25) {
      setError("Keep your display name to 25 characters or fewer.");
    } else {
      setError("");
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const nextName = username.trim();

    if (!user || !nextName || nextName.length > 25 || !hasChanges) return;

    try {
      setSaving(true);
      setError("");
      setStatus("");
      await updateProfile(user, { displayName: nextName });
      setUsername(nextName);
      setStatus("Your profile has been updated.");
    } catch (saveError) {
      console.error("Unable to update profile:", saveError);
      setError("We could not save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setUsername(originalName);
    setError("");
    setStatus("");
  };

  if (loading) {
    return (
      <div className="profile-settings profile-settings--loading" aria-label="Loading profile">
        <div className="profile-loading-mark" />
        <p>Opening your profile…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-settings profile-settings--empty">
        <span className="profile-kicker">Account unavailable</span>
        <h1>We could not open your profile.</h1>
        <p>Please sign in again to manage your account.</p>
        <button type="button" onClick={() => navigate("/login")}>
          Return to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="profile-settings">
      <header className="profile-settings__topbar">
        <button
          type="button"
          className="profile-back-button"
          onClick={() => navigate("/user")}
          aria-label="Back to the character collection"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Back to collection</span>
        </button>

        <img
          className="profile-brand-mark"
          src="/images/logoTransparent.png"
          alt="Echoes of History"
        />
      </header>

      <div className="profile-settings__intro">
        <div>
          <span className="profile-kicker">Your account</span>
          <h1>Profile settings</h1>
          <p>Choose how your name appears while you explore and converse.</p>
        </div>
        <span className="profile-record-number" aria-hidden="true">01</span>
      </div>

      <div className="profile-settings__layout">
        <aside className="profile-identity-card">
          <div className="profile-portrait-frame">
            <img
              src={user.photoURL || FALLBACK_AVATAR}
              alt="Your profile portrait"
              onError={(event) => {
                event.currentTarget.src = FALLBACK_AVATAR;
              }}
            />
            <span className="profile-portrait-status" aria-label="Signed in">
              <Check size={13} aria-hidden="true" />
            </span>
          </div>

          <span className="profile-card-label">Member profile</span>
          <h2>{originalName || "History explorer"}</h2>
          <p>{user.email}</p>

          <div className="profile-card-rule" />

          <dl className="profile-account-facts">
            <div>
              <dt><CalendarDays size={16} aria-hidden="true" /> Joined</dt>
              <dd>{formatAccountDate(user.metadata?.creationTime)}</dd>
            </div>
            <div>
              <dt><ShieldCheck size={16} aria-hidden="true" /> Sign-in method</dt>
              <dd>{providerName}</dd>
            </div>
          </dl>
        </aside>

        <form className="profile-form-card" onSubmit={handleSave}>
          <section className="profile-form-section">
            <div className="profile-section-heading">
              <span className="profile-section-icon"><UserRound size={18} /></span>
              <div>
                <h2>Public identity</h2>
                <p>This is the name shown throughout Echoes of History.</p>
              </div>
            </div>

            <label className="profile-field" htmlFor="profile-display-name">
              <span>Display name</span>
              <div className={`profile-input-wrap${error ? " profile-input-wrap--error" : ""}`}>
                <input
                  id="profile-display-name"
                  type="text"
                  value={username}
                  onChange={handleUsernameInput}
                  maxLength={26}
                  autoComplete="nickname"
                  aria-describedby="profile-name-help"
                />
                <span>{username.length}/25</span>
              </div>
              <small id="profile-name-help" className={error ? "profile-field-error" : ""}>
                {error || "Use the name you would like historical figures to address you by."}
              </small>
            </label>
          </section>

          <section className="profile-form-section profile-form-section--account">
            <div className="profile-section-heading">
              <span className="profile-section-icon"><Mail size={18} /></span>
              <div>
                <h2>Account details</h2>
                <p>Your sign-in information is kept private.</p>
              </div>
            </div>

            <div className="profile-readonly-field">
              <span>Email address</span>
              <strong>{user.email || "No email available"}</strong>
              <em>Managed through your sign-in provider</em>
            </div>
          </section>

          <button
            type="button"
            className="profile-feedback-link"
            onClick={() => navigate("/feedback")}
          >
            <span className="profile-section-icon"><MessageSquareText size={18} /></span>
            <span>
              <strong>Share feedback</strong>
              <small>Tell us how we can improve your experience.</small>
            </span>
            <ChevronRight size={18} aria-hidden="true" />
          </button>

          <footer className="profile-form-actions">
            <div className="profile-save-message" aria-live="polite">
              {status && <><Check size={15} /> {status}</>}
            </div>
            <button
              type="button"
              className="profile-action profile-action--secondary"
              onClick={handleCancel}
              disabled={!hasChanges || saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="profile-action profile-action--primary"
              disabled={!hasChanges || Boolean(error) || saving}
            >
              <Save size={16} aria-hidden="true" />
              {saving ? "Saving…" : "Save changes"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default UserProfile;
