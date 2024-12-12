console.log('Le fichier catways-manager.js est chargé avec succès!');

class CatwaysManager {
        constructor() {
            // Initialiser les propriétés
            this.currentEditCatway = null;
            
            // Démarrer l'application
            this.init();
        }
    
        init() {
            console.log('CatwaysManager: Init started');
            const token = AuthService.checkAuth();
            
            // Si pas de token, on arrête l'initialisation
            if (!token) {
                console.log('CatwaysManager: No token available');
                return;
            }
            
            console.log('CatwaysManager: Token found, continuing initialization');
            this.initEventListeners();
            this.loadCatways();
        }
    
        initEventListeners() {
            // Écouteur pour le formulaire d'édition
            document.getElementById('editForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.updateCatway(e.target);
            });
        }
    
        async loadCatways() {
            const token = AuthService.checkAuth();
            try {
                const response = await fetch('/api/catways', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const catways = await response.json();
                this.renderCatwaysList(catways);
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors du chargement des catways');
            }
        }
    
        renderCatwaysList(catways) {
            const tbody = document.getElementById('catwaysList');
            tbody.innerHTML = catways.map(catway => this.createCatwayRow(catway)).join('');
        }
    
        createCatwayRow(catway) {
            return `
                <tr>
                    <td>${catway.catwayNumber}</td>
                    <td>${catway.type}</td>
                    <td>${catway.catwayState}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="catwaysManager.navigateToDetails('${catway._id}')">
                            Détails
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="catwaysManager.showEditForm('${catway._id}')">
                            Modifier
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="catwaysManager.deleteCatway('${catway._id}')">
                            Supprimer
                        </button>
                    </td>
                </tr>
            `;
        }
    
        navigateToDetails(catwayId) {
            window.location.href = `/catway?id=${catwayId}`;
        }
    
        async showEditForm(catwayId) {
            const token = AuthService.checkAuth();
            try {
                const response = await fetch(`/api/catways/${catwayId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                this.currentEditCatway = await response.json();
                
                // Remplir le formulaire
                this.populateEditForm(this.currentEditCatway);
                
                // Afficher la modal
                new bootstrap.Modal(document.getElementById('editModal')).show();
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors du chargement des données');
            }
        }
    
        populateEditForm(catway) {
            document.querySelector('#editForm select[name="type"]').value = catway.type;
            document.querySelector('#editForm textarea[name="catwayState"]').value = catway.catwayState;
            document.getElementById('editCatwayId').value = catway._id;
        }
    
        async updateCatway(form) {
            const token = AuthService.checkAuth();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch(`/api/catways/${this.currentEditCatway._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        type: data.type,
                        catwayState: data.catwayState
                    })
                });
                
                if (response.ok) {
                    bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
                    await this.loadCatways();
                    alert('Catway modifié avec succès');
                } else {
                    const error = await response.json();
                    alert(error.message || 'Erreur lors de la modification');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la modification');
            }
        }
    
        async deleteCatway(catwayId) {
            if (!confirm('Êtes-vous sûr de vouloir supprimer ce catway ?')) return;
    
            const token = AuthService.checkAuth();
            try {
                const response = await fetch(`/api/catways/${catwayId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    await this.loadCatways();
                    alert('Catway supprimé avec succès');
                } else {
                    const error = await response.json();
                    if (response.status === 400 && error.reservationsCount) {
                        alert(`Ce catway ne peut pas être supprimé car il possède ${error.reservationsCount} réservation(s) active(s) ou à venir. Veuillez d'abord annuler ou déplacer ces réservations.`);
                    } else {
                        alert(error.message || 'Erreur lors de la suppression');
                    }                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la suppression');
            }
        }
    }
    
    // Initialiser le gestionnaire
    const catwaysManager = new CatwaysManager();