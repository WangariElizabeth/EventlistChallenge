
let guests = [];
const MAX_GUESTS = 10;

//  DOM elements
const guestForm = document.getElementById('guestForm');
const guestNameInput = document.getElementById('guestName');
const guestCategorySelect = document.getElementById('guestCategory');
const guestList = document.getElementById('guestList');
const guestCounter = document.getElementById('guestCounter');
const emptyState = document.getElementById('emptyState');

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing guest list manager');
    updateGuestCounter();
    updateEmptyState();
    
    // Add form submit event listener
    guestForm.addEventListener('submit', handleFormSubmit);
});

// Handle form submission
function handleFormSubmit(event) {
    // Prevent default form submission
    event.preventDefault();
    console.log('Form submitted');
    
    const name = guestNameInput.value.trim();
    const category = guestCategorySelect.value;
    
    console.log('Guest name:', name);
    console.log('Guest category:', category);
    
    // Validate inputs
    if (!name || !category) {
        alert('Please fill in all fields!');
        return;
    }
    
    // Check guest limit
    if (guests.length >= MAX_GUESTS) {
        alert(`Sorry! You can only invite up to ${MAX_GUESTS} guests.`);
        return;
    }
    
    // Add guest
    addGuest(name, category);
    
    // Clear form
    guestNameInput.value = '';
    guestCategorySelect.value = '';
    guestNameInput.focus();
}

// Add a new guest
function addGuest(name, category) {
    console.log('Adding guest:', name, category);
    
    // Create guest object
    const guest = {
        id: Date.now(), // Simple ID using timestamp
        name: name,
        category: category,
        rsvp: 'attending', // Default to attending
        addedAt: new Date().toLocaleString()
    };
    
    // Add to guests array
    guests.push(guest);
    console.log('Current guests:', guests);
    
    // Update UI
    renderGuestList();
    updateGuestCounter();
    updateEmptyState();
}

// Render the guest list
function renderGuestList() {
    console.log('Rendering guest list');
    
    // Clear existing list
    guestList.innerHTML = '';
    
    // Add each guest
    guests.forEach(guest => {
        const guestElement = createGuestElement(guest);
        guestList.appendChild(guestElement);
    });
}

// Create HTML element for a guest
function createGuestElement(guest) {
    const guestDiv = document.createElement('div');
    guestDiv.className = `guest-item ${guest.rsvp}`;
    guestDiv.setAttribute('data-id', guest.id);
    
    guestDiv.innerHTML = `
        <div class="guest-info">
            <div class="guest-name-section">
                <span class="guest-name" id="name-${guest.id}">${guest.name}</span>
                <input type="text" class="edit-input" id="edit-${guest.id}" value="${guest.name}" style="display: none;">
            </div>
            <span class="category-tag ${guest.category}">${guest.category}</span>
            <span class="added-time">Added: ${guest.addedAt}</span>
        </div>
        
        <div class="guest-actions">
            <button class="rsvp-btn ${guest.rsvp}" onclick="toggleRSVP(${guest.id})">
                ${guest.rsvp === 'attending' ? '✓ Attending' : '✗ Not Attending'}
            </button>
            <button class="edit-btn" onclick="toggleEdit(${guest.id})">Edit</button>
            <button class="save-btn" onclick="saveEdit(${guest.id})" style="display: none;">Save</button>
            <button class="delete-btn" onclick="removeGuest(${guest.id})">Remove</button>
        </div>
    `;
    
    return guestDiv;
}

// Toggle RSVP status
function toggleRSVP(guestId) {
    console.log('Toggling RSVP for guest:', guestId);
    
    const guest = guests.find(g => g.id === guestId);
    if (guest) {
        guest.rsvp = guest.rsvp === 'attending' ? 'not-attending' : 'attending';
        console.log('New RSVP status:', guest.rsvp);
        renderGuestList();
    }
}

// Toggle edit mode for a guest
function toggleEdit(guestId) {
    console.log('Toggling edit for guest:', guestId);
    
    const nameSpan = document.getElementById(`name-${guestId}`);
    const editInput = document.getElementById(`edit-${guestId}`);
    const editBtn = event.target;
    const saveBtn = editBtn.nextElementSibling;
    
    if (nameSpan.style.display === 'none') {
        // Cancel edit
        nameSpan.style.display = 'inline';
        editInput.style.display = 'none';
        editBtn.textContent = 'Edit';
        saveBtn.style.display = 'none';
    } else {
        // Start edit
        nameSpan.style.display = 'none';
        editInput.style.display = 'inline';
        editInput.focus();
        editBtn.textContent = 'Cancel';
        saveBtn.style.display = 'inline';
    }
}

// Save edited guest name
function saveEdit(guestId) {
    console.log('Saving edit for guest:', guestId);
    
    const editInput = document.getElementById(`edit-${guestId}`);
    const newName = editInput.value.trim();
    
    if (!newName) {
        alert('Name cannot be empty!');
        return;
    }
    
    const guest = guests.find(g => g.id === guestId);
    if (guest) {
        guest.name = newName;
        console.log('Updated guest name:', newName);
        renderGuestList();
    }
}

// Remove a guest
function removeGuest(guestId) {
    console.log('Removing guest:', guestId);
    
    if (confirm('Are you sure you want to remove this guest?')) {
        guests = guests.filter(guest => guest.id !== guestId);
        console.log('Guest removed. Remaining guests:', guests);
        
        renderGuestList();
        updateGuestCounter();
        updateEmptyState();
    }
}

// Update guest counter
function updateGuestCounter() {
    guestCounter.textContent = `Guests: ${guests.length}/${MAX_GUESTS}`;
    console.log('Guest counter updated:', guests.length);
}

// Update empty state visibility
function updateEmptyState() {
    if (guests.length === 0) {
        emptyState.style.display = 'block';
        guestList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        guestList.style.display = 'block';
    }
}

// Log when script is fully loaded
console.log('Guest list manager script loaded successfully!');
