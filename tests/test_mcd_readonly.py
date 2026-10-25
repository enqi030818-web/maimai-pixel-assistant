import json
from pathlib import Path
import sys
import unittest
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from mcd_readonly import McdClient, McdError, decode_rpc, price_cents, unwrap_tool


class ReadonlyContract(unittest.TestCase):
    def test_sse_matches_response_after_notification(self):
        body = 'event: message\ndata: {"jsonrpc":"2.0","method":"ping"}\n\nevent: message\ndata: {"jsonrpc":"2.0",\ndata: "id":4,"result":{"ok":true}}\n\n'
        self.assertEqual(decode_rpc(body, 4), {"ok": True})

    def test_missing_id_and_rpc_errors_are_not_success(self):
        for body in ['{"id":5,"result":{}}', '{"id":4,"error":{"code":-1}}']:
            with self.assertRaises(McdError):
                decode_rpc(body, 4)

    def test_markdown_original_response_and_business_errors(self):
        result = {"content": [{"type": "text", "text": 'Original Response\n```json\n{"success":true,"data":{"price":2650}}\n```'}]}
        self.assertEqual(price_cents(unwrap_tool(result)), 2650)
        for bad in [{"isError": True}, {"structuredContent": {"success": False}},
                    {"structuredContent": {"code": 401}}]:
            with self.assertRaises(McdError):
                unwrap_tool(bad)

    def test_only_integer_fen_can_be_quoted(self):
        self.assertEqual(price_cents({"data": {"price": 0}}), 0)
        for price in [26.5, "2650", None, -1, True]:
            with self.assertRaises(McdError):
                price_cents({"data": {"price": price}})

    def test_write_tools_blocked_before_network(self):
        client = McdClient(token="test-only")
        client.rpc = lambda *a, **k: self.fail("network must not be reached")
        for name in ['create-order', 'auto-bind-coupons', 'draw-lottery', 'cancel-order']:
            with self.assertRaises(McdError):
                client.call(name, {})

    def test_quote_call_rejects_missing_or_wrong_amount(self):
        client = McdClient(token="test-only")
        client.tools = {"calculate-price": {}}
        args = {"storeCode": "fixture", "beType": 1, "orderType": 1,
                "items": [{"productCode": "fixture", "quantity": 1}]}
        for data in [{}, {"price": "26.50"}, {"price": -1}, None]:
            client.rpc = lambda *a, **k: {"structuredContent": {"success": True, "data": data}}
            with self.assertRaises(McdError):
                client.call("calculate-price", args)


if __name__ == "__main__":
    unittest.main()
