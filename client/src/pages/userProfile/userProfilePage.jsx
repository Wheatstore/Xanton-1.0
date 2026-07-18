import UserProfile from "../../components/userProfile/userProfile";
import "./userProfilePage.css";

function UserProfilePage() {
  return (
    <main className="profile-settings-page">
      <div className="profile-settings-page__texture" aria-hidden="true" />
      <div className="profile-settings-page__glow" aria-hidden="true" />
      <UserProfile />
    </main>
  );
}

export default UserProfilePage;
