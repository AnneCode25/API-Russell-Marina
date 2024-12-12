class ReservationsManager {
    constructor() {
        console.log('Initialisation du gestionnaire de réservations');
        this.init();
    }

    init() {
        this.loadReservations();
    }

    async loadReservations() {
        const token = AuthService.checkAuth();
        if (!token) return;

        try {
            const response = await fetch('/api/reservations/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur serveur');
            }

            const reservations = await response.json();
            this.renderReservationsList(reservations);
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors du chargement des réservations');
        }
    }

    renderReservationsList(reservations) {
        const tbody = document.getElementById('reservationsList');
        tbody.innerHTML = reservations.map(reservation => `
            <tr>
                <td>${reservation.catwayNumber}</td>
                <td>${reservation.clientName}</td>
                <td>${reservation.boatName}</td>
                <td>${new Date(reservation.checkIn).toLocaleString('fr-FR')}</td>
                <td>${new Date(reservation.checkOut).toLocaleString('fr-FR')}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="reservationsManager.deleteReservation('${reservation._id}')">
                        Supprimer
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async deleteReservation(id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) return;
        
        const token = AuthService.checkAuth();
        try {
            const response = await fetch(`/api/reservations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                await this.loadReservations();
                alert('Réservation supprimée avec succès');
            } else {
                const error = await response.json();
                alert(error.message || 'Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression');
        }
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    window.reservationsManager = new ReservationsManager();
});