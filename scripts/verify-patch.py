from pathlib import Path

t = Path(r"C:\Users\maghosh\OneDrive - Qualys, Inc\Work\Code\AP_Test_ap-risk\src\components\AttackPathInsights.jsx").read_text(encoding="utf-8")
checks = {
    "infer": "inferResourceScoring" in t,
    "merged": "mergedAssetRows" in t,
    "unified": "Asset Metadata &amp; Risk Scoring" in t,
    "no_split_meta": "Asset Metadata (diagram" not in t,
    "no_split_scoring_section": "── 6. Asset Risk Scoring" not in t,
    "vpn": "vpn-gateway-01" in t,
    "merged_map": "mergedAssetRows.map" in t,
}
for k, v in checks.items():
    print(k, v)
print("all_ok", all(checks.values()))
