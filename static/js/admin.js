/**
 * Super Deluxe Softies & Smiles — Administrator Controls & Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const adminModal = document.getElementById('adminModal');
  const btnOpenAdmin = document.getElementById('btnOpenAdmin');
  const btnCloseAdmin = document.getElementById('btnCloseAdmin');
  const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
  const adminSections = document.querySelectorAll('.admin-panel-section');

  // Sequence Reordering Elements
  const adminSequenceList = document.getElementById('adminSequenceList');
  const btnSaveSequence = document.getElementById('btnSaveSequence');
  const policySelect = document.getElementById('reorderPolicySelect');

  // Edit Flavour Form Elements
  const editFlavourSelect = document.getElementById('editFlavourSelect');
  const editFlavourForm = document.getElementById('editFlavourForm');
  const editName = document.getElementById('editName');
  const editTagline = document.getElementById('editTagline');
  const editDesc = document.getElementById('editDesc');
  const editImageUrl = document.getElementById('editImageUrl');
  const editAvailability = document.getElementById('editAvailability');
  const editCalories = document.getElementById('editCalories');
  const editTastingNotes = document.getElementById('editTastingNotes');

  // Config Elements
  const configAnchorDate = document.getElementById('configAnchorDate');
  const configTimezone = document.getElementById('configTimezone');
  const btnSaveConfig = document.getElementById('btnSaveConfig');
  const btnResetDefaults = document.getElementById('btnResetDefaults');

  let currentFlavours = [];
  let currentConfig = null;

  initAdmin();

  function initAdmin() {
    setupAdminEvents();
  }

  function setupAdminEvents() {
    if (btnOpenAdmin) {
      btnOpenAdmin.addEventListener('click', openAdminPanel);
    }
    if (btnCloseAdmin) {
      btnCloseAdmin.addEventListener('click', closeAdminPanel);
    }

    // Tabs
    adminTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabTarget = btn.getAttribute('data-tab');
        adminTabBtns.forEach(b => b.classList.remove('active'));
        adminSections.forEach(s => s.classList.remove('active'));

        btn.classList.add('active');
        const targetSection = document.getElementById(`adminTab-${tabTarget}`);
        if (targetSection) targetSection.classList.add('active');
      });
    });

    // Save Reordered Sequence
    if (btnSaveSequence) {
      btnSaveSequence.addEventListener('click', saveReorderedSequence);
    }

    // Flavour Selection to Edit
    if (editFlavourSelect) {
      editFlavourSelect.addEventListener('change', () => {
        populateEditForm(editFlavourSelect.value);
      });
    }

    // Save Flavour Details Form
    if (editFlavourForm) {
      editFlavourForm.addEventListener('submit', handleSaveFlavourDetails);
    }

    // Save Config
    if (btnSaveConfig) {
      btnSaveConfig.addEventListener('click', handleSaveConfig);
    }

    // Reset Defaults
    if (btnResetDefaults) {
      btnResetDefaults.addEventListener('click', handleResetDefaults);
    }
  }

  function showToast(message, type = 'info') {
    let toast = document.getElementById('adminToastMessage');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'adminToastMessage';
      toast.style.position = 'fixed';
      toast.style.bottom = '24px';
      toast.style.right = '24px';
      toast.style.padding = '14px 22px';
      toast.style.borderRadius = '12px';
      toast.style.fontWeight = '800';
      toast.style.fontSize = '0.9rem';
      toast.style.zIndex = '9999';
      toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)';
      toast.style.transition = 'all 0.3s ease';
      document.body.appendChild(toast);
    }
    if (type === 'error') {
      toast.style.background = '#d1222a';
      toast.style.color = '#fff';
    } else {
      toast.style.background = '#071d3a';
      toast.style.color = '#f3bd3f';
    }
    toast.textContent = message;
    toast.style.display = 'block';
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 4000);
  }

  async function openAdminPanel() {
    await fetchAdminData();
    if (adminModal) {
      adminModal.classList.add('is-open');
      adminModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAdminPanel() {
    if (adminModal) {
      adminModal.classList.remove('is-open');
      adminModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  async function fetchAdminData() {
    try {
      const [seqRes, confRes] = await Promise.all([
        fetch('/api/flavours'),
        fetch('/api/rotation-config')
      ]);

      if (seqRes.ok && confRes.ok) {
        const seqData = await seqRes.json();
        currentFlavours = seqData.flavours;
        currentConfig = await confRes.json();

        renderSequenceRows();
        populateFlavourSelectOptions();
        populateConfigForm();
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showToast('Error loading administrative data', 'error');
    }
  }

  // --------------------------------------------------------------------------
  // Sequence Reordering
  // --------------------------------------------------------------------------
  function renderSequenceRows() {
    if (!adminSequenceList) return;
    adminSequenceList.innerHTML = '';

    currentFlavours.forEach((f, idx) => {
      const row = document.createElement('div');
      row.className = 'admin-flavour-row';
      row.setAttribute('data-id', f.id);

      row.innerHTML = `
        <div class="admin-day-number">Day ${idx + 1}</div>
        <img class="admin-row-thumb" src="${f.image_url}" alt="${f.name}" />
        <div class="admin-row-info">
          <h4>${f.name}</h4>
          <p>${f.tagline || 'Artisanal Recipe'}</p>
        </div>
        <div class="admin-row-status">
          <span class="tasting-chip" style="font-size:0.75rem;">${f.is_active ? 'Active' : 'Inactive'}</span>
        </div>
        <div class="admin-reorder-btns">
          <button type="button" class="btn-move btn-move-up" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''} title="Move Up">↑</button>
          <button type="button" class="btn-move btn-move-down" data-idx="${idx}" ${idx === currentFlavours.length - 1 ? 'disabled' : ''} title="Move Down">↓</button>
          <button type="button" class="btn-edit-row" data-id="${f.id}">Edit</button>
        </div>
      `;

      // Up button
      row.querySelector('.btn-move-up').addEventListener('click', () => moveFlavour(idx, -1));
      // Down button
      row.querySelector('.btn-move-down').addEventListener('click', () => moveFlavour(idx, 1));
      // Edit button
      row.querySelector('.btn-edit-row').addEventListener('click', () => {
        const tabBtn = document.querySelector('[data-tab="edit"]');
        if (tabBtn) tabBtn.click();
        if (editFlavourSelect) {
          editFlavourSelect.value = f.id;
          populateEditForm(f.id);
        }
      });

      adminSequenceList.appendChild(row);
    });

    if (policySelect && currentConfig) {
      policySelect.value = currentConfig.reorder_policy || 'immediate';
    }
  }

  function moveFlavour(fromIdx, direction) {
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= currentFlavours.length) return;

    const item = currentFlavours.splice(fromIdx, 1)[0];
    currentFlavours.splice(toIdx, 0, item);
    renderSequenceRows();
  }

  async function saveReorderedSequence() {
    try {
      const sequenceIds = currentFlavours.map(f => f.id);
      const policy = policySelect ? policySelect.value : 'immediate';

      // Validation: must have exactly 10 flavours
      if (sequenceIds.length !== 10) {
        showToast('Validation Error: Sequence must contain exactly 10 flavours.', 'error');
        return;
      }

      btnSaveSequence.disabled = true;
      btnSaveSequence.textContent = 'Saving...';

      const res = await fetch('/api/admin/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sequence: sequenceIds, policy: policy })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Sequence updated successfully!', 'success');
        if (window.reloadRotationData) await window.reloadRotationData();
        await fetchAdminData();
      } else {
        showToast(`Error: ${data.detail || 'Validation failed'}`, 'error');
      }
    } catch (err) {
      showToast(`Network error: ${err.message}`, 'error');
    } finally {
      btnSaveSequence.disabled = false;
      btnSaveSequence.textContent = 'Publish Reordered Sequence';
    }
  }

  // --------------------------------------------------------------------------
  // Edit Flavour Form
  // --------------------------------------------------------------------------
  function populateFlavourSelectOptions() {
    if (!editFlavourSelect) return;
    editFlavourSelect.innerHTML = '';

    currentFlavours.forEach((f, i) => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = `Day ${i + 1}: ${f.name} (${f.id})`;
      editFlavourSelect.appendChild(opt);
    });

    if (currentFlavours.length > 0) {
      populateEditForm(currentFlavours[0].id);
    }
  }

  function populateEditForm(flavourId) {
    const f = currentFlavours.find(x => x.id === flavourId);
    if (!f) return;

    if (editName) editName.value = f.name;
    if (editTagline) editTagline.value = f.tagline || '';
    if (editDesc) editDesc.value = f.description;
    if (editImageUrl) editImageUrl.value = f.image_url;
    if (editAvailability) editAvailability.value = f.availability || '';
    if (editCalories) editCalories.value = f.calories || '';
    if (editTastingNotes) editTastingNotes.value = (f.tasting_notes || []).join(', ');
  }

  async function handleSaveFlavourDetails(e) {
    e.preventDefault();
    const flavourId = editFlavourSelect ? editFlavourSelect.value : null;
    if (!flavourId) return;

    const payload = {
      name: editName.value.trim(),
      tagline: editTagline.value.trim(),
      description: editDesc.value.trim(),
      image_url: editImageUrl.value.trim(),
      availability: editAvailability.value.trim(),
      calories: editCalories.value.trim(),
      tasting_notes: editTastingNotes.value.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (!payload.name || !payload.description || !payload.image_url) {
      showToast('Name, Description, and Image URL cannot be empty.', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/admin/flavour/${flavourId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Flavour "${payload.name}" updated successfully!`, 'success');
        if (window.reloadRotationData) await window.reloadRotationData();
        await fetchAdminData();
      } else {
        showToast(`Error: ${data.detail || 'Failed to update'}`, 'error');
      }
    } catch (err) {
      showToast(`Network error: ${err.message}`, 'error');
    }
  }

  // --------------------------------------------------------------------------
  // Anchor Date & Configuration
  // --------------------------------------------------------------------------
  function populateConfigForm() {
    if (!currentConfig) return;
    if (configAnchorDate) configAnchorDate.value = currentConfig.anchor_date;
    if (configTimezone) configTimezone.value = currentConfig.timezone;
  }

  async function handleSaveConfig() {
    const newAnchor = configAnchorDate ? configAnchorDate.value.trim() : null;
    if (!newAnchor) {
      showToast('Anchor date cannot be empty.', 'error');
      return;
    }

    try {
      btnSaveConfig.disabled = true;
      btnSaveConfig.textContent = 'Saving...';

      const res = await fetch('/api/admin/rotation-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anchor_date: newAnchor })
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Rotation anchor date updated! Rotation recalculated.', 'success');
        if (window.reloadRotationData) await window.reloadRotationData();
        await fetchAdminData();
      } else {
        showToast(`Error: ${data.detail || 'Invalid date'}`, 'error');
      }
    } catch (err) {
      showToast(`Network error: ${err.message}`, 'error');
    } finally {
      btnSaveConfig.disabled = false;
      btnSaveConfig.textContent = 'Save Configuration';
    }
  }

  async function handleResetDefaults() {
    if (!confirm('Are you sure you want to restore the default 10 flavours and anchor date (2026-10-21)?')) {
      return;
    }

    try {
      const res = await fetch('/api/admin/reset-defaults', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Defaults restored successfully!', 'success');
        if (window.reloadRotationData) await window.reloadRotationData();
        await fetchAdminData();
      } else {
        showToast('Error resetting defaults.', 'error');
      }
    } catch (err) {
      showToast(`Network error: ${err.message}`, 'error');
    }
  }
});
