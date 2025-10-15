/**
 * auth.js - Authentication Logic for LogTrace
 * Handles login, logout, and session management (Phase 1: Hardcoded users)
 */

// Hardcoded users for Phase 1 (no database)
const USERS = {
    'admin': 'password123',
    'analyst': 'soc2024'
};

/**
 * Initialize authentication on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Check if we're on a protected page (upload or results)
    if (window.location.pathname.includes('upload.html') || 
        window.location.pathname.includes('results.html')) {
        checkAuth();
        displayUsername();
    }
});

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Clear previous error
    errorMessage.textContent = '';
    
    // Check credentials
    if (USERS[username] && USERS[username] === password) {
        // Success! Save session
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('loginTime', new Date().toISOString());
        
        // Redirect to upload page
        window.location.href = 'upload.html';
    } else {
        // Failed login
        errorMessage.textContent = '❌ Invalid username or password';
        
        // Clear password field
        document.getElementById('password').value = '';
    }
}

/**
 * Check if user is authenticated
 * Redirects to login page if not logged in
 */
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('loggedIn');
    const username = sessionStorage.getItem('username');
    
    if (!isLoggedIn || !username) {
        // Not logged in - redirect to login page
        window.location.href = 'index.html';
    }
}

/**
 * Display current username in navbar
 */
function displayUsername() {
    const username = sessionStorage.getItem('username');
    const userElement = document.getElementById('currentUser');
    
    if (userElement && username) {
        userElement.textContent = `👤 ${username}`;
    }
}

/**
 * Logout user and clear session
 */
function logout() {
    // Clear all session data
    sessionStorage.clear();
    
    // Redirect to login page
    window.location.href = 'index.html';
}

/**
 * Get current logged in username
 * @returns {string|null} Username or null if not logged in
 */
function getCurrentUsername() {
    return sessionStorage.getItem('username');
}

