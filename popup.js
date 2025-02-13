function updateDomainList() {
  chrome.storage.local.get(['blockedDomains'], function(result) {
    const domainList = document.getElementById('domainList');
    domainList.innerHTML = '';
    result.blockedDomains?.forEach(domain => {
      const div = document.createElement('div');
      div.className = 'domain';
      div.textContent = domain;
      const removeButton = document.createElement('button');
      removeButton.className = 'remove-btn';
      removeButton.innerHTML = 'x';
      removeButton.onclick = () => removeDomain(domain);
      div.appendChild(removeButton);
      domainList.appendChild(div);
    });
  });
}

function addDomain() {
  const input = document.getElementById('domain');
  const domain = input.value.trim();
  if (domain) {
    chrome.storage.local.get(['blockedDomains'], function(result) {
      const domains = result.blockedDomains || [];
      if (!domains.includes(domain)) {
        domains.push(domain);
        chrome.storage.local.set({blockedDomains: domains}, updateDomainList);
      }
      input.value = '';
    });
  }
}

function removeDomain(domain) {
  chrome.storage.local.get(['blockedDomains'], function(result) {
    const domains = result.blockedDomains.filter(d => d !== domain);
    chrome.storage.local.set({blockedDomains: domains}, updateDomainList);
  });
}

document.getElementById('add').onclick = addDomain;
document.getElementById('domain').onkeypress = function(e) {
  if (e.key === 'Enter') addDomain();
};

updateDomainList();