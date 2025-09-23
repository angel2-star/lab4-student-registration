document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const regForm = document.getElementById('regForm');
    const cardsContainer = document.getElementById('cards');
    const summaryTable = document.getElementById('summary').getElementsByTagName('tbody')[0];
    const emptyState = document.getElementById('emptyState');
    const liveRegion = document.getElementById('live');
    const successMessage = document.getElementById('successMessage');
    
    // Validation functions
    function validateRequired(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    }
    
    function validateEmail(value) {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const err = document.getElementById("emailError");
        if (!ok) { 
            err.textContent = "Please enter a valid email."; 
            err.style.display = 'block';
        } else { 
            err.textContent = ""; 
            err.style.display = 'none';
        }
        return ok;
    }
    
    function validateURL(url) {
        if (!url || url.trim() === '') return true; // URL is optional
        try {
            new URL(url);
            document.getElementById("photoURLError").style.display = 'none';
            return true;
        } catch (e) {
            document.getElementById("photoURLError").textContent = "Please enter a valid URL";
            document.getElementById("photoURLError").style.display = 'block';
            return false;
        }
    }
    
    function validateInterests(interests) {
        const hasInterests = interests.length > 0;
        const err = document.getElementById("interestsError");
        if (!hasInterests) {
            err.textContent = "Please select at least one interest";
            err.style.display = 'block';
        } else {
            err.textContent = "";
            err.style.display = 'none';
        }
        return hasInterests;
    }
    
    function validateYear(year) {
        const hasYear = validateRequired(year);
        const err = document.getElementById("yearError");
        if (!hasYear) {
            err.textContent = "Please select a year";
            err.style.display = 'block';
        } else {
            err.textContent = "";
            err.style.display = 'none';
        }
        return hasYear;
    }
    
    function validateProgramme(programme) {
        const hasProgramme = validateRequired(programme);
        const err = document.getElementById("programmeError");
        if (!hasProgramme) {
            err.textContent = "Please select a programme";
            err.style.display = 'block';
        } else {
            err.textContent = "";
            err.style.display = 'none';
        }
        return hasProgramme;
    }
    
    function validateName(name, field) {
        const hasName = validateRequired(name);
        const err = document.getElementById(`${field}Error`);
        if (!hasName) {
            err.textContent = `${field === 'firstName' ? 'First' : 'Last'} name is required`;
            err.style.display = 'block';
        } else {
            err.textContent = "";
            err.style.display = 'none';
        }
        return hasName;
    }
    
    // Create profile card and table row
    function addEntry(data) {
        // Card
        const card = document.createElement("div"); 
        card.className = "card-person";
        card.setAttribute('data-id', data.id);
        
        card.innerHTML = `
            <img src="${data.photoURL || "https://placehold.co/128"}" alt="${data.firstName} ${data.lastName}">
            <div>
                <h3>${data.firstName} ${data.lastName}</h3>
                <p>${data.email}</p>
                <p>
                    <span class="badge">${data.programme}</span> 
                    <span class="badge">Year ${data.year}</span>
                </p>
                <p>${data.interests.join(", ")}</p>
            </div>
            <div class="card-actions">
                <button class="btn-remove" onclick="removeEntry(${data.id})">Remove</button>
            </div>
        `;
        
        document.getElementById("cards").prepend(card);
        
        // Remove empty state if it exists
        if (emptyState.style.display !== 'none') {
            emptyState.style.display = 'none';
        }
        
        // Table
        const tr = document.createElement("tr");
        tr.setAttribute('data-id', data.id);
        tr.innerHTML = `
            <td>${data.firstName} ${data.lastName}</td>
            <td>${data.programme}</td>
            <td>Year ${data.year}</td>
            <td>${data.interests.join(", ")}</td>
            <td><button class="btn-remove" onclick="removeEntry(${data.id})">Remove</button></td>
        `;
        
        // Remove the empty row if it exists
        if (summaryTable.rows.length === 1 && summaryTable.rows[0].cells[0].colSpan === 5) {
            summaryTable.deleteRow(0);
        }
        
        document.querySelector("#summary tbody").prepend(tr);
    }
    
    // Remove entry
    function removeEntry(id) {
        // Remove card
        const card = document.querySelector(`.card-person[data-id="${id}"]`);
        if (card) {
            card.remove();
        }
        
        // Remove table row
        const row = document.querySelector(`#summary tbody tr[data-id="${id}"]`);
        if (row) {
            row.remove();
        }
        
        // Show empty state if no profiles left
        if (cardsContainer.children.length === 1 && cardsContainer.children[0].id === 'emptyState') {
            emptyState.style.display = 'block';
            
            // Add empty row to table
            if (summaryTable.rows.length === 0) {
                const row = summaryTable.insertRow();
                row.innerHTML = '<td colspan="5" style="text-align: center;">No data available</td>';
            }
        }
        
        liveRegion.textContent = `Profile ${id} has been removed.`;
    }
    
    // Form submission handler
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = {
            id: Date.now(), // Generate unique ID
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            programme: document.getElementById('programme').value,
            year: document.querySelector('input[name="year"]:checked')?.value,
            interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value),
            photoURL: document.getElementById('photoURL').value.trim()
        };
        
        // Validate form
        let isValid = true;
        
        if (!validateName(formData.firstName, 'firstName')) isValid = false;
        if (!validateName(formData.lastName, 'lastName')) isValid = false;
        if (!validateEmail(formData.email)) isValid = false;
        if (!validateProgramme(formData.programme)) isValid = false;
        if (!validateYear(formData.year)) isValid = false;
        if (!validateInterests(formData.interests)) isValid = false;
        if (!validateURL(formData.photoURL)) isValid = false;
        
        if (!isValid) {
            liveRegion.textContent = "Fix errors before submitting.";
            return;
        }
        
        // Add entry if valid
        addEntry(formData);
        
        // Show success message
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
        
        // Update live region
        liveRegion.textContent = `Profile for ${formData.firstName} ${formData.lastName} has been created successfully.`;
        
        // Reset form
        regForm.reset();
    });
    
    // Input event listeners for live validation
    document.getElementById('email').addEventListener('blur', function() {
        validateEmail(this.value);
    });
    
    document.getElementById('photoURL').addEventListener('blur', function() {
        validateURL(this.value);
    });
    
    // Make removeEntry function available globally
    window.removeEntry = removeEntry;
});