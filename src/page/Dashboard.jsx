import { useState, useEffect } from "react";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [mutations, setMutations] = useState([]);
  const [topupAmount, setTopupAmount] = useState("");
  const [transferEmail, setTransferEmail] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);


  const API_BASE = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  async function fetchDashboardData() {
    try {
      const walletRes = await fetch(`${API_BASE}/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const walletData = await walletRes.json();
      if (walletRes.ok) setBalance(walletData.data.balance);

      const mutationRes = await fetch(`${API_BASE}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mutationData = await mutationRes.json();

      console.log("Response Status Transactions:", mutationRes.status);
      console.log("Data Transactions dari Backend:", mutationData);

      if (mutationRes.ok) setMutations(mutationData.data);
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Poin b.ii: Aksi Top Up Saldo
  async function handleTopup(e) {
    e.preventDefault();
    if (!topupAmount) return;
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API_BASE}/topup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parseInt(topupAmount) }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal memproses top up.");

      setMessage({ type: "success", text: "Top up berhasil diproses!" });
      setTopupAmount("");
      fetchDashboardData();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  // Poin b.iii: Aksi Transfer Saldo (Validasi Ketat Backend & Frontend)
  async function handleTransfer(e) {
    e.preventDefault();
    if (!transferEmail || !transferAmount) return;
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API_BASE}/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: transferEmail,
          amount: parseInt(transferAmount),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal memproses transfer.");

      setMessage({ type: "success", text: "Transfer berhasil dilakukan!" });
      setTransferEmail("");
      setTransferAmount("");
      fetchDashboardData();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard E-wallet</h1>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-lg border text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 border-green-200 text-green-700"
              : "bg-red-100 border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Saldo Anda</p>
            <h3 className="text-4xl font-extrabold text-gray-800 mt-2">
              Rp {balance.toLocaleString("id-ID")}
            </h3>
          </div>
          <div className="mt-4 text-xs text-gray-400">
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top Up Saldo</h3>
          <form onSubmit={handleTopup} className="flex flex-col gap-3">
            <input
              type="number"
              placeholder="Nominal Top Up (Contoh: 50000)"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              disabled={loading}
              min="1"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Isi Saldo"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Transfer Uang</h3>
          <form onSubmit={handleTransfer} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email Penerima"
              value={transferEmail}
              onChange={(e) => setTransferEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              disabled={loading}
              required
            />
            <input
              type="number"
              placeholder="Nominal Transfer"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              disabled={loading}
              min="1"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Kirim Uang"}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Riwayat Mutasi Dompet</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-medium">
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Tipe</th>
                <th className="py-3 px-4">Nominal</th>
                <th className="py-3 px-4">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {mutations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-400">
                  </td>
                </tr>
              ) : (
                mutations.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4 text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          item.type === "topup" || item.type === "transfer_in"
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {item.type === "topup" && "💰 Top Up"}
                        {item.type === "transfer_in" && "📥 Masuk"}
                        {item.type === "transfer_out" && "📤 Keluar"}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-4 font-bold ${
                        item.type === "topup" || item.type === "transfer_in"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.type === "topup" || item.type === "transfer_in" ? "+ " : "- "}
                      Rp {item.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-gray-500">{item.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
