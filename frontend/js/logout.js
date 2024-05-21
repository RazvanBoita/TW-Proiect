
async function logout()
{
    var confirmLogout = confirm('Are you sure you want to logout?');
        
        // If the user confirms, perform logout action
        if (confirmLogout) {
            try {
                const response = await fetch('/logout', {
                    method: 'POST'
                });
                if (response.ok) {
                    window.location.href = '/login'
                } else {
                    console.error('Logout failed');
                }
            } catch (error) {
                console.error('Error during logout:', error);
            }
        }
}