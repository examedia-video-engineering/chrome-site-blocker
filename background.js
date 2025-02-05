chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('blockedSites', ({ blockedSites = [] }) => {
    updateBlockingRules(blockedSites);
  });
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedSites) {
    updateBlockingRules(changes.blockedSites.newValue);
  }
});

async function updateBlockingRules(blockedSites = []) {
  // Convert blocked sites to DNR rules
  const rules = blockedSites.map((domain, index) => ({
    id: index + 1,
    action: { type: "block" },
    condition: {
      urlFilter: `||${domain}^`,
      resourceTypes: ["main_frame"]
    }
  }));

  // Update dynamic rules
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map(rule => rule.id), // Remove existing rules
    addRules: rules
  });
}