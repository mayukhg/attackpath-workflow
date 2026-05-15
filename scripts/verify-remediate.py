from pathlib import Path
import re

text = Path(r"C:\Users\maghosh\OneDrive - Qualys, Inc\Work\Code\AP_Test_ap-risk\src\components\AttackPathInsights.jsx").read_text(encoding="utf-8")

checks = {
    "RemediateTab component": "function RemediateTab" in text,
    "Tab registered (03 Remediate)": "id: 'remediate'" in text,
    "Tab render wired": "activeTab === 'remediate'" in text,
    "Remediation data on paths": text.count("remediation: [") >= 10,
    "Recommended Remediation Actions UI": "Recommended Remediation Actions" in text,
    "Action cards (allActions.map)": "allActions.map" in text,
    "More Detail button": "More Detail" in text,
    "Navigate from Analyze": "onNavigateToRemediate" in text,
    "Ready to Remediate gate": "Ready to Remediate?" in text,
}

print("=== Remediation section validation ===")
for k, v in checks.items():
    print(f"{'PASS' if v else 'FAIL'}: {k}")

# Sample path AP-5025 / id 5025
m = re.search(r"id:\s*5025,[\s\S]*?remediation:\s*\[([\s\S]*?)\],", text)
if m:
    actions = re.findall(r"priority:\s*'(\w+)'", m.group(1))
    print(f"\nPath 5025 remediation actions: {len(actions)} ({', '.join(actions)})")
else:
    print("\nPath 5025: not found (check id)")

print(f"\nOverall: {'AVAILABLE' if all(checks.values()) else 'ISSUES FOUND'}")
