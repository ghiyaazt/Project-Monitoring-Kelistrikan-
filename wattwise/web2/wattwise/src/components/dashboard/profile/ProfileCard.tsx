import { wattwiseIcon } from "../../../assets/logos";

interface ProfileCardProps {
  profil: {
    nama: string;
    email: string;
  };
  isEditing: boolean;
}

export default function ProfileCard({ profil, isEditing }: ProfileCardProps) {
  return (
    <div className="profile-card">
      <div className="profile-card-inner">
        <div className="profile-avatar-container">
          <img src={wattwiseIcon} alt="avatar" className="profile-avatar" />
          {isEditing && (
            <button className="profile-avatar-edit-btn">
              <svg className="profile-avatar-edit-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{profil.nama}</h2>
          <p className="profile-location">{profil.email}</p>
          <div className="profile-badges">
            <span className="profile-badge-active">User Aktif</span>
            <span className="profile-badge-admin">WattWise Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
