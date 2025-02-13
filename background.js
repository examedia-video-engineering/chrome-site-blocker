async function updateRules() {
  const result = await chrome.storage.local.get(['blockedDomains']);
  const domains = result.blockedDomains || [];
  
  const rules = domains.map((domain, i) => ({
    id: i + 1,
    priority: 1,
    action: { type: "block" },
    condition: {
      urlFilter: `||${domain}`,
      resourceTypes: ["main_frame"]
    }
  }));

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: Array.from({length: 50}, (_, i) => i + 1),
    addRules: rules
  });
}

chrome.storage.local.onChanged.addListener(updateRules);
updateRules();
