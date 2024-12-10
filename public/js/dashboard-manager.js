// public/js/dashboard-manager.js
class DashboardManager {
        constructor() {
            this.init();
            this.initEventListeners();
        }
    
        init() {
            this.loadCatwayOptions();
        }
    
        initEventListeners() {
            // Gestion du formulaire Catway
            document.getElementById('catwayForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.createCatway(e.target);
            });
    
            // Gestion du formulaire Réservation
            document.getElementById('reservationForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.createReservation(e.target);
            });
        }
    
        async loadCatwayOptions() {
            const token = AuthService.checkAuth();
            try {
                const response = await fetch('/api/catways', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const catways = await response.json();
                
                const select = document.getElementById('catwaySelect');
                select.innerHTML = catways.map(catway => `
                    <option value="${catway.catwayNumber}">
                        Catway ${catway.catwayNumber} (${catway.type})
                    </option>
                `).join('');
            } catch (error) {
                console.error('Erreur lors du chargement des catways:', error);
                alert('Erreur lors du chargement des catways');
            }
        }
    
        async createCatway(form) {
            const token = AuthService.checkAuth();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('/api/catways', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    alert('Catway créé avec succès');
                    form.reset();
                    await this.loadCatwayOptions(); // Recharger la liste des catways
                } else {
                    const error = await response.json();
                    alert(error.message || 'Erreur lors de la création du catway');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la création du catway');
            }
        }
    
        async createReservation(form) {
            const token = AuthService.checkAuth();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('/api/reservations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...data,
                        catwayNumber: parseInt(data.catwayNumber)
                    })
                });
                
                if (response.ok) {
                    alert('Réservation créée avec succès');
                    form.reset();
                } else {
                    const error = await response.json();
                    alert(error.message || 'Erreur lors de la création de la réservation');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la création de la réservation');
            }
        }
    }