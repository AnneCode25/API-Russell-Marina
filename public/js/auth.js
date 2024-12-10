// public/js/auth.js
class AuthService {
        static checkAuth() {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('Auth: No token found');
                window.location.href = '/';
                return null;
            }
    
            try {
                const tokenData = JSON.parse(atob(token.split('.')[1]));
                if (tokenData.exp && tokenData.exp < Math.floor(Date.now() / 1000)) {
                    this.logout();
                    return null;
                }
                return token;
            } catch (error) {
                console.error('Erreur de décodage du token:', error);
                this.logout();
                return null;
            }
        }
    
        static logout() {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
    }