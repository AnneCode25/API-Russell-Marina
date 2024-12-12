class CatwayManager {
    constructor() {
        this.currentCatway = null;
        this.init();
    }

    init() {
        const catwayId = new URLSearchParams(window.location.search).get('id');
        if (!catwayId) {
            window.location.href = '/catways';
            return;
        }
        this.loadCatwayDetails(catwayId);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    async loadCatwayDetails(catwayId) {
        const token = AuthService.checkAuth();
        
        try {
            const response = await fetch(`/api/catways/${catwayId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des détails du catway');
            }
            
            this.currentCatway = await response.json();
            
            // Mise à jour du numéro dans le titre
            document.getElementById('catwayNumber').textContent = `#${this.currentCatway.catwayNumber}`;
            
            // Charger les réservations en utilisant l'ID du catway
            await this.loadReservations(catwayId);
            
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors du chargement des informations');
            window.location.href = '/catways';
        }
    }

    async loadReservations(catwayId) {
        const token = AuthService.checkAuth();
        try {
            console.log('Chargement des réservations pour le catway ID:', catwayId);
            
            // Utilisation de l'ID du catway plutôt que du numéro
            const response = await fetch(`/api/catways/${catwayId}/reservations`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des réservations');
            }
            
            const reservations = await response.json();
            this.updateReservationsView(reservations);
            
        } catch (error) {
            console.error('Erreur détaillée:', error);
            document.getElementById('reservationsList').innerHTML = `
                <div class="alert alert-warning">
                    <h5>Aucune réservation trouvée</h5>
                    <p>Il n'y a actuellement aucune réservation pour ce catway.</p>
                </div>`;
        }
    }

    updateReservationsView(reservations) {
        const container = document.getElementById('reservationsList');
        
        if (!Array.isArray(reservations) || reservations.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <h5>Aucune réservation</h5>
                    <p>Ce catway n'a pas encore de réservations enregistrées.</p>
                </div>`;
            return;
        }

        // Trier les réservations par date de début
        reservations.sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));

        container.innerHTML = `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>Client</th>
                            <th>Bateau</th>
                            <th>Arrivée</th>
                            <th>Départ</th>
                            <th>Durée</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reservations.map(reservation => this.createReservationRow(reservation)).join('')}
                    </tbody>
                </table>
            </div>`;
    }

    createReservationRow(reservation) {
        const now = new Date();
        const checkIn = new Date(reservation.checkIn);
        const checkOut = new Date(reservation.checkOut);
        
        let status, statusClass;
        if (checkOut < now) {
            status = "Terminée";
            statusClass = "text-secondary";
        } else if (checkIn <= now && checkOut >= now) {
            status = "En cours";
            statusClass = "text-success";
        } else {
            status = "À venir";
            statusClass = "text-primary";
        }

        return `
            <tr>
                <td>${reservation.clientName}</td>
                <td>${reservation.boatName}</td>
                <td>${this.formatDate(reservation.checkIn)}</td>
                <td>${this.formatDate(reservation.checkOut)}</td>
                <td>${this.calculateDuration(reservation.checkIn, reservation.checkOut)}</td>
                <td><span class="badge ${statusClass}">${status}</span></td>
            </tr>`;
    }

    calculateDuration(checkIn, checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return `${days} jour${days > 1 ? 's' : ''}`;
    }
}

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new CatwayManager();
});