document.getElementById('addSite').addEventListener('click', addSite);

// Initial load
loadBlockedList();

async function addSite() {
  const siteInput = document.getElementById('siteInput');
  const site = siteInput.value.trim().toLowerCase();
  if (!site) return;

  try {
    const { blockedSites = [] } = await chrome.storage.local.get('blockedSites');
    
    if (!blockedSites.includes(site)) {
      const newList = [...blockedSites, site];
      await chrome.storage.local.set({ blockedSites: newList });
      await loadBlockedList();
      siteInput.value = ''; // Clear input only after successful add
    }
  } catch (error) {
    console.error('Error adding site:', error);
  }
}

async function loadBlockedList() {
  try {
    const { blockedSites = [] } = await chrome.storage.local.get('blockedSites');
    const listDiv = document.getElementById('blockedList');
    
    // Clear existing list
    listDiv.innerHTML = '<strong>Blocked Sites:</strong>';
    
    if (blockedSites.length > 0) {
      const ul = document.createElement('ul');
      blockedSites.forEach(site => {
        const li = document.createElement('li');
        li.textContent = site;
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => removeSite(site));
        ul.appendChild(li);
      });
      listDiv.appendChild(ul);
    } else {
      listDiv.innerHTML += '<p>No sites blocked yet</p>';
    }
  } catch (error) {
    console.error('Error loading list:', error);
  }
}

async function removeSite(site) {
  try {
    const { blockedSites = [] } = await chrome.storage.local.get('blockedSites');
    const filtered = blockedSites.filter(s => s !== site);
    await chrome.storage.local.set({ blockedSites: filtered });
    await loadBlockedList(); // Refresh the list after removal
  } catch (error) {
    console.error('Error removing site:', error);
  }
}