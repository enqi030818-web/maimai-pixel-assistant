"""Render the checked-in historical MCP snapshot; never claims to query live prices."""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def yuan(cents):
    if type(cents) is not int:
        raise ValueError("expected integer fen")
    sign = "-" if cents < 0 else ""
    value = abs(cents)
    return f"{sign}{value // 100}.{value % 100:02d}"


def render(data):
    budget = data["budgetCents"]
    lines = ["# 麦麦历史演示 · 点餐确认单", "",
             "> 历史真实核价快照，非当前价格。测试门店，不代表用户位置。尚未创建订单。", "",
             f"门店：{data['store']['name']}（{data['store']['code']}），{data['store']['mode']}。", "",
             "| 本轮候选 | 完整组成 | 整单应付 | 预算余量/超额 |", "| --- | --- | ---: | ---: |"]
    for candidate in data["candidates"]:
        composition = "、".join(f"{s['name']}×{s['quantity']}" for s in candidate["selections"])
        difference = budget - candidate["priceCents"]
        balance = ("余 " if difference >= 0 else "超 ") + "¥" + yuan(abs(difference))
        lines.append(f"| {candidate['name']} | {composition} | ¥{yuan(candidate['priceCents'])} | {balance} |")
    chosen = data["revision"]
    lines += ["", f"选定：**{chosen['name']} ×1**，{chosen['change']}。", ""]
    lines += [f"- {s['name']} ×{s['quantity']}" for s in chosen["selections"]]
    balance = budget - chosen["priceCents"]
    lines += ["", f"重新核价整单应付：**¥{yuan(chosen['priceCents'])}**；预算 ¥{yuan(budget)}，"
              + ("剩余" if balance >= 0 else "超出") + f" ¥{yuan(abs(balance))}。",
              f"相较上次整单报价变化：¥{yuan(chosen['priceCents'] - chosen['previousPriceCents'])}。这是整单差额。", "",
              f"核价时间：{chosen['quotedAt']}（UTC+8）。本轮未查询或使用账户券。", "",
              "状态：餐单确认单，尚未创建订单。价格及可售状态可能变化，以麦当劳官方渠道实时结果为准。", ""]
    return "\n".join(lines)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=ROOT / "docs/demo-confirmation.md")
    args = parser.parse_args()
    data = json.loads((ROOT / "docs/live-verification.snapshot.json").read_text(encoding="utf-8"))
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(render(data), encoding="utf-8")
    print(args.out.resolve())
