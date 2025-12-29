// Mock authentication for Milestone 0 demo
// In production, this would integrate with Zitadel OIDC

export const useAuth = () => {
  return {
    isAuthenticated: false,
    user: null,
    login: () => {
      console.log('Login with Zitadel would be implemented here');
      // In production: redirect to Zitadel OIDC
      alert('For Milestone 0 demo: Zitadel OIDC integration is ready to be implemented.\\n\\nIn production, this would redirect to: ' + import.meta.env.VITE_PUBLIC_ZITADEL_ISSUER);
    },
    logout: () => {
      console.log('Logout would be implemented here');
    }
  };
};