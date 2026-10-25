"""Small stdlib-only Streamable HTTP client; deliberately exposes read-only tools."""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import re
import sys
import urllib.error
import urllib.request

ENDPOINT = "https://mcp.mcd.cn"
READ_TOOLS = frozenset({
    "now-time-info", "query-nearby-stores", "query-meals", "query-meal-detail",
    "calculate-price", "query-my-coupons", "query-store-coupons",
    "available-coupons", "list-nutrition-foods", "campaign-calendar",
})


class McdError(Exception):
    pass


def load_token():
    token = os.environ.get("MCD_MCP_TOKEN")
    if not token and sys.platform == "win32":
        import winreg
        try:
            with winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Environment") as key:
                token = winreg.QueryValueEx(key, "MCD_MCP_TOKEN")[0]
        except (FileNotFoundError, OSError):
            pass
    if not token:
        raise McdError("未检测到 MCD_MCP_TOKEN，请在本机环境变量中设置；不要发到聊天里。")
    return token


def decode_rpc(body: str, request_id):
    try:
        parsed = json.loads(body)
    except json.JSONDecodeError:
        events = []
        for event in re.split(r"\r?\n\r?\n", body):
            data = "\n".join(line[5:].lstrip() for line in event.splitlines()
                             if line.startswith("data:"))
            if data:
                try:
                    events.append(json.loads(data))
                except json.JSONDecodeError:
                    raise McdError("MCP 返回了无法解析的 SSE 数据") from None
        parsed = next((e for e in events if e.get("id") == request_id), None)
    if not isinstance(parsed, dict) or parsed.get("id") != request_id:
        raise McdError("MCP 响应缺少匹配的请求 id")
    if "error" in parsed:
        raise McdError(f"MCP RPC 错误（code={parsed['error'].get('code')}）")
    if "result" not in parsed:
        raise McdError("MCP 响应缺少 result")
    return parsed["result"]


def unwrap_tool(result):
    if result.get("isError"):
        raise McdError("MCP 工具执行失败；未生成有效报价")
    if isinstance(result.get("structuredContent"), dict):
        data = result["structuredContent"]
    else:
        text = "\n".join(c["text"] for c in result.get("content", [])
                         if c.get("type") == "text")
        candidates = [text] + list(reversed(re.findall(r"```(?:json)?\s*([\s\S]*?)```", text)))
        data = None
        for candidate in candidates:
            try:
                data = json.loads(candidate)
                break
            except json.JSONDecodeError:
                continue
        if not isinstance(data, dict):
            raise McdError("无法识别工具 JSON，停止处理，不能猜测报价")
    if data.get("success") is False or data.get("code", 200) not in (0, 200, "0", "200"):
        raise McdError("麦当劳业务请求失败（未生成有效结果）")
    return data


class McdClient:
    def __init__(self, token=None):
        self.token = token or load_token()
        self.session = None
        self.protocol = "2025-03-26"
        self.counter = 0
        self.tools = {}

    def rpc(self, method, params=None, *, notification=False):
        self.counter += 1
        payload = {"jsonrpc": "2.0", "method": method}
        if not notification:
            payload["id"] = self.counter
        if params is not None:
            payload["params"] = params
        headers = {"Authorization": "Bearer " + self.token,
                   "Content-Type": "application/json", "Accept": "application/json, text/event-stream"}
        if self.session:
            headers["Mcp-Session-Id"] = self.session
        if method != "initialize":
            headers["MCP-Protocol-Version"] = self.protocol
        req = urllib.request.Request(ENDPOINT, data=json.dumps(payload).encode(),
                                     headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=45) as response:
                self.session = response.headers.get("Mcp-Session-Id", self.session)
                body = response.read().decode("utf-8-sig")
        except urllib.error.HTTPError as exc:
            raise McdError(f"MCP HTTP {exc.code}；检查凭证、权限或限流，未自动重试") from None
        except (urllib.error.URLError, TimeoutError, OSError):
            raise McdError("MCP 网络连接失败；未自动重试，也未生成有效报价") from None
        if notification:
            return None
        return decode_rpc(body, self.counter)

    def connect(self):
        result = self.rpc("initialize", {"protocolVersion": self.protocol, "capabilities": {},
            "clientInfo": {"name": "maimai-pixel-pal", "version": "0.1.0"}})
        self.protocol = result["protocolVersion"]
        self.rpc("notifications/initialized", {}, notification=True)
        cursor = None
        while True:
            page = self.rpc("tools/list", {"cursor": cursor} if cursor else {})
            self.tools.update({t["name"]: t for t in page["tools"]})
            next_cursor = page.get("nextCursor")
            if not next_cursor:
                break
            if next_cursor == cursor:
                raise McdError("工具分页 cursor 未推进")
            cursor = next_cursor
        return {"serverInfo": result.get("serverInfo"), "toolCount": len(self.tools)}

    def call(self, name, arguments):
        if name not in READ_TOOLS:
            raise McdError("本项目只允许餐单查询与核价工具，禁止写操作")
        if name not in self.tools:
            raise McdError("服务当前未提供该工具")
        if name in {"query-nearby-stores", "query-meals", "query-meal-detail", "calculate-price", "query-store-coupons"}:
            if arguments.get("beType") != 1 or (name != "query-nearby-stores" and arguments.get("orderType") != 1):
                raise McdError("第一版仅支持到店自取（beType=1, orderType=1）")
        if name == "calculate-price" and not arguments.get("items"):
            raise McdError("不能对空餐单核价")
        result = unwrap_tool(self.rpc("tools/call", {"name": name, "arguments": arguments}))
        if name == "calculate-price":
            price_cents(result)
        return result


def price_cents(response):
    if response.get("success") is False or response.get("code", 200) not in (200, 0, "200", "0"):
        raise McdError("失败的业务结果不可用作报价")
    data = response.get("data")
    value = data.get("price") if isinstance(data, dict) else None
    if type(value) is not int or value < 0:
        raise McdError("报价缺少有效的整单 price（整数分）")
    return value


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="action", required=True)
    sub.add_parser("probe", help="连通性与工具名称，不输出凭证")
    sub.add_parser("schema", help="读取当前只读工具 schema")
    call = sub.add_parser("call", help="只读工具调用；参数从 JSON 文件或 stdin 读取")
    call.add_argument("name", choices=sorted(READ_TOOLS))
    call.add_argument("--args-file", default="-", help="默认从 stdin 读取 JSON")
    args = parser.parse_args()
    try:
        client = McdClient()
        status = client.connect()
        if args.action == "probe":
            result = status
        elif args.action == "schema":
            result = [v for k, v in client.tools.items() if k in READ_TOOLS]
        else:
            raw = sys.stdin.read() if args.args_file == "-" else Path(args.args_file).read_text(encoding="utf-8-sig")
            arguments = json.loads(raw)
            if not isinstance(arguments, dict):
                raise McdError("工具参数必须为 JSON 对象")
            result = client.call(args.name, arguments)
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except (McdError, ValueError, KeyError, OSError) as exc:
        # Avoid exception strings from transports or requests containing credentials.
        print(str(exc) if isinstance(exc, McdError) else "参数或响应格式无效，处理已停止", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
