// src/lib/auth-utils.ts

export function canPublish(user: any) {
  // Si l'utilisateur est Admin (TOI), il passe direct
  if (user.isAdmin) return true;
  
  // Sinon, il doit être vérifié
  return user.businessVerified;
}