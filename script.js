// 1. Data Initialization
let residents = JSON.parse(localStorage.getItem('barangay_db')) || [];

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    renderTable();
    updateDashboard();
});

// 2. Navigation
function switchView(view) {
    document.getElementById('view-dashboard').classList.toggle('hidden', view !== 'dashboard');
    document.getElementById('view-records').classList.toggle('hidden', view !== 'records');
    document.getElementById('nav-dashboard').classList.toggle('active', view === 'dashboard');
    document.getElementById('nav-records').classList.toggle('active', view === 'records');
    lucide.createIcons();
}

function openModal() { document.getElementById('modal-overlay').classList.remove('hidden'); }
function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }

// 3. Save Logic
document.getElementById('resident-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newEntry = {
        id: String(Date.now()), // Unique timestamp ID
        name: document.getElementById('form-name').value.toUpperCase(),
        email: document.getElementById('form-email').value.toLowerCase(),
        gender: document.getElementById('form-gender').value,
        dob: document.getElementById('form-dob').value,
        status: document.getElementById('form-status').value,
        occupation: document.getElementById('form-occupation').value.toUpperCase(),
        voter: document.getElementById('form-voter').value,
        contact: document.getElementById('form-contact').value,
        barangay: document.getElementById('form-barangay').value.toUpperCase(),
        purok: document.getElementById('form-purok').value.toUpperCase(),
        street: document.getElementById('form-street').value.toUpperCase()
    };

    residents.push(newEntry);
    localStorage.setItem('barangay_db', JSON.stringify(residents));
    
    renderTable();
    updateDashboard();
    closeModal();
    e.target.reset();
    
    // CRITICAL FIX: Automatically show the records table after saving
    switchView('records'); 
});

// 4. Delete Logic
function deleteResident(id) {
    if(confirm('Delete this record permanently?')) {
        residents = residents.filter(r => r.id !== id);
        localStorage.setItem('barangay_db', JSON.stringify(residents));
        renderTable();
        updateDashboard();
    }
}

// 5. Render Table
function renderTable() {
    const tbody = document.getElementById('resident-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    residents.forEach(res => {
        const initials = res.name.split(' ').map(n => n[0]).join('').substring(0,2);
        
        const row = `
            <tr class="hover:bg-slate-50 transition-colors border-b border-slate-100">
                <td class="p-4 font-bold text-slate-400 text-xs">#${res.id.slice(-4)}</td>
                <td class="p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">${initials}</div>
                        <div>
                            <div class="text-sm font-bold text-slate-800">${res.name}</div>
                            <div class="text-[10px] text-slate-400">${res.email}</div>
                        </div>
                    </div>
                </td>
                <td class="p-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold ${res.gender === 'MALE' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}">${res.gender}</span>
                    <div class="text-[10px] text-slate-500 mt-1">${res.dob}</div>
                </td>
                <td class="p-4"><span class="text-xs font-medium text-slate-600">${res.status}</span></td>
                <td class="p-4 text-xs font-bold text-blue-700">${res.occupation}</td>
                <td class="p-4">
                    <span class="text-[10px] font-bold ${res.voter === 'REGISTERED' ? 'text-green-600' : 'text-red-500'}">
                        ● ${res.voter}
                    </span>
                </td>
                <td class="p-4">
                    <div class="text-xs font-bold text-slate-700">${res.barangay}</div>
                    <div class="text-[10px] text-slate-400">${res.purok}, ${res.street}</div>
                </td>
                <td class="p-4 text-xs text-slate-600">${res.contact}</td>
                <td class="p-4 text-center">
                    <button onclick="deleteResident('${res.id}')" class="text-slate-300 hover:text-red-600 transition-colors">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
    
    lucide.createIcons();
}

function updateDashboard() {
    const totalEl = document.getElementById('dash-total-residents');
    if(totalEl) totalEl.innerText = residents.length;
}
