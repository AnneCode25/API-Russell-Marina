class UserManager {
        constructor() {
            this.usersList = document.getElementById('usersList');
            this.editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            this.bindEvents();
            this.loadUsers();
        }
    
        bindEvents() {
            // Gestionnaire pour le bouton de sauvegarde dans le modal
            document.getElementById('saveUserBtn').addEventListener('click', () => this.saveUser());
        }
    
        async loadUsers() {
            try {
                const response = await fetch('/api/users', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des utilisateurs');
                }
                
                const users = await response.json();
                this.renderUsers(users);
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors du chargement des utilisateurs');
            }
        }
    
        renderUsers(users) {
            this.usersList.innerHTML = users.map(user => `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="userManager.showEditModal('${user._id}', '${user.name}', '${user.email}')">
                            Modifier
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="userManager.deleteUser('${user._id}')">
                            Supprimer
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    
        showEditModal(id, name, email) {
            document.getElementById('editUserId').value = id;
            document.getElementById('editUserName').value = name;
            document.getElementById('editUserEmail').value = email;
            this.editModal.show();
        }
    
        async saveUser() {
            const id = document.getElementById('editUserId').value;
            const userData = {
                name: document.getElementById('editUserName').value,
                email: document.getElementById('editUserEmail').value
            };
    
            try {
                const response = await fetch(`/api/users/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(userData)
                });
    
                if (!response.ok) {
                    throw new Error('Erreur lors de la modification');
                }
    
                this.editModal.hide();
                this.loadUsers();
                alert('Utilisateur modifié avec succès');
            } catch (error) {
                console.error('Erreur:', error);
                alert(error.message);
            }
        }
    
        async deleteUser(id) {
            if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                return;
            }
    
            try {
                const response = await fetch(`/api/users/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
    
                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression');
                }
    
                this.loadUsers();
                alert('Utilisateur supprimé avec succès');
            } catch (error) {
                console.error('Erreur:', error);
                alert(error.message);
            }
        }
    }