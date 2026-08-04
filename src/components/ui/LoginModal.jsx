import AuthPage from '@/pages/AuthPage.jsx'

export default function LoginModal({ open, onClose }) {
  if (!open) return null
  return <AuthPage mode="modal" onClose={onClose} />
}
