// Load data from LocalStorage or use defaults from the image provided
let residents = JSON.parse(localStorage.getItem('barangay_db')) || [
    {
        id: "1",
        name: "RHONEVIE FREJOLES",
        gender: "MALE",
        dob: "2005-01-09",
        status: "MARRIED",
        email: "rlfrejoles.student@asiancollege.edu.ph",
        occupation: "DEVELOPER",
        voter: "REGISTERED",
        contact: "09123456789",
        barangay: "POBLACION 4",
        purok: "PUROK 2",
        street: "RIZAL BOULEVARD"
    },
    {
        id: "2",
        name: "NOVEM AMBER BASIAO",
        gender: "FEMALE",
        dob: "2006-11-05",
        status: "MARRIED",
        email: "ntbasiao.student@asiancollege.edu.ph",
        occupation: "TEACHER",
        voter: "NOT REGISTERED",
        contact: "09234567890",
        barangay: "BAGACAY",
        purok: "PUROK 1",
        street: "WEST DRIVE"
    },
    {
        id: "3",
        name: "HANNAH BENDANILLO",
        gender: "FEMALE",
        dob: "2005-03-03",
        status: "SINGLE",
        email: "hbendanillo.student@asiancollege.edu.ph",
        occupation: "ENGINEER",
        voter: "REGISTERED",
        contact: "09345678901",
        barangay: "PIAPI",
        purok: "PUROK 3",
        street: "E.J. BLANCO DRIVE"
    },
    {
        id: "4",
        name: "KATE MACABINGUIL",
        gender: "FEMALE",
        dob: "2004-10-25",
        status: "SINGLE",
        email: "kamacabinguil.student@asiancollege.edu.ph",
        occupation: "TEACHER",
        voter: "REGISTERED",
        contact: "09456789012",
        barangay: "DARO",
        purok: "PUROK 5",
        street: "REAL STREET"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    renderTable();
    updateDashboard();
});

// Navigation logic
function switchView(view) {
    document.getElementById('view-dashboard').classList.toggle('hidden', view !== 'dashboard');
    document.getElementById('view-records').classList.toggle('hidden', view !== 'records');
    document.getElementById('nav-dashboard').classList.toggle('active', view === 'dashboard');
    document.getElementById('nav-records').classList.toggle('active', view === 'records');
    lucide.createIcons();
}

// Modal handling
function openModal() { document.getElementById('modal-overlay').classList.remove('hidden'); }
function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }

// Save Data (Handles all attributes)
document.getElementById('resident-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newEntry = {
        id: String(residents.length + 1),
        name: document.getElementById('form-name').value.toUpperCase(),
        email: document.getElementById('form-email').value.toLowerCase(),
        gender: document.getElementById('form-gender').value,
        dob: document.getElementById('form-dob').value,
        status: document.getElementById('form-status').value,
        occupation: document.getElementById('form-occupation').value.toUpperCase(),
        voter: document.getElementById('form-voter').value,
        barangay: document.getElementById('form-barangay').value.toUpperCase(),
        contact: document.getElementById('form-contact').value
    };

    residents.push(newEntry);
    localStorage.setItem('barangay_db', JSON.stringify(residents));
    
    renderTable();
    updateDashboard();
    closeModal();
    e.target.reset();
});

// Delete Resident
function deleteResident(id) {
    if(confirm('Are you sure you want to delete this record?')) {
        residents = residents.filter(r => r.id !== id);
        localStorage.setItem('barangay_db', JSON.stringify(residents));
        renderTable();
        updateDashboard();
    }
}

// Render the Records Table with All Attributes
function renderTable() {
    const tbody = document.getElementById('resident-table-body');
    const countText = document.getElementById('record-count-subtitle');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    residents.forEach(res => {
        const initials = res.name.split(' ').map(n => n[0]).join('').substring(0,2);
        
        const row = `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="id-link">#${res.id}</td>
                <td>
                    <div class="flex items-center gap-3">
                        <div class="avatar blue">${initials.toUpperCase()}</div>
                        <div>
                            <span class="name-text">${res.name}</span>
                            <span class="email-subtext">${res.email || 'no-email@college.edu.ph'}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="text-xs">
                        <span class="pill ${res.gender === 'MALE' ? 'blue' : 'pink'}">${res.gender}</span>
                        <div class="mt-1 text-slate-500 font-medium">${res.dob}</div>
                    </div>
                </td>
                <td><span class="pill blue">${res.status}</span></td>
                <td class="occupation-text">${res.occupation || 'N/A'}</td>
                <td>
                    <span class="${res.voter === 'REGISTERED' ? 'voter-reg' : 'voter-not'}">
                        ${res.voter}
                    </span>
                </td>
                <td>
                    <span class="address-main">${res.barangay || 'BARANGAY'}</span>
                    <span class="address-sub">${res.purok || 'PUROK'}, ${res.street || 'STREET'}</span>
                </td>
                <td class="text-slate-600 font-medium">${res.contact}</td>
                <td>
                    <div class="flex gap-2 justify-center">
                        <button onclick="deleteResident('${res.id}')" class="text-slate-400 hover:text-red-600 transition-colors">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
    
    if(countText) countText.innerText = `${residents.length} active members across the community`;
    lucide.createIcons();
}

function updateDashboard() {
    const totalEl = document.getElementById('dash-total-residents');
    if(totalEl) totalEl.innerText = residents.length.toLocaleString();
}
