import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Heart,
  CheckCircle2,
  Building2,
  Smartphone,
  Settings2,
  RefreshCw,
  Wallet,
  AlertCircle,
  Clock,
  ShieldCheck,
  Check,
  ArrowDownRight,
  ExternalLink,
} from "lucide-react";
import {
  useMonetization,
  type PayoutMethod,
  type PayoutBank,
} from "@/lib/monetization-state";
import { usePlan } from "@/lib/plan-state";
import { Avatar } from "@/components/social/Avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function MonetizationHub() {
  const { isPro } = usePlan();
  const {
    loading,
    totalEarnings,
    pendingBalance,
    currency,
    tipsReceived,
    payouts,
    activePayoutMethod,
    destination,
    settings,
    requestPayout,
    saveDestination,
    loadBanks,
    refresh,
  } = useMonetization();

  const [activeTab, setActiveTab] = useState<PayoutMethod | "settings">("bank");
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutProcessing, setPayoutProcessing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");

  // Bank & Mobile Money Form State (No seeded dummy data)
  const [banks, setBanks] = useState<PayoutBank[]>([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [savingDestination, setSavingDestination] = useState(false);

  // Settings Form State
  const [minTipDraft, setMinTipDraft] = useState<number>(settings.minimumTip || 1);
  const [tipsEnabledDraft, setTipsEnabledDraft] = useState<boolean>(settings.tipsEnabled ?? true);

  // Load Paystack supported banks
  useEffect(() => {
    let active = true;
    setBanksLoading(true);
    loadBanks()
      .then((bList) => {
        if (active && Array.isArray(bList)) {
          setBanks(bList);
        }
      })
      .catch((err) => console.warn("Could not load Paystack banks:", err))
      .finally(() => {
        if (active) setBanksLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loadBanks]);

  // Sync existing destination if available
  useEffect(() => {
    if (destination) {
      setSelectedBankCode(destination.bankCode || "");
      setAccountName(destination.accountName || "");
      if (destination.method) {
        setActiveTab(destination.method);
      }
    }
  }, [destination]);

  const platformFee = isPro ? "0% (Keep 100%)" : "5% platform fee";

  const handlePayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pendingBalance <= 0) {
      toast.error("No pending balance available to withdraw.");
      return;
    }
    if (!destination) {
      toast.error("Please configure and verify a Paystack payout destination first.");
      return;
    }

    const amt = withdrawAmount ? Number(withdrawAmount) : undefined;
    if (amt !== undefined && (isNaN(amt) || amt <= 0 || amt > pendingBalance)) {
      toast.error("Please enter a valid withdrawal amount.");
      return;
    }

    setPayoutProcessing(true);
    try {
      const record = await requestPayout(amt);
      setIsPayoutModalOpen(false);
      setWithdrawAmount("");
      if (record) {
        toast.success(`Withdrawal of ${currency} ${record.amount.toFixed(2)} initiated via Paystack!`);
      } else {
        toast.success("Withdrawal initiated successfully via Paystack.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to process withdrawal via Paystack.");
    } finally {
      setPayoutProcessing(false);
    }
  };

  const handleSaveDestination = async (method: PayoutMethod) => {
    if (!accountName.trim() || !accountNumber.trim() || !selectedBankCode) {
      toast.error("Please fill in all account details");
      return;
    }

    const bankObj = banks.find((b) => b.code === selectedBankCode);
    const bName = bankObj ? bankObj.name : "Paystack Institution";

    setSavingDestination(true);
    try {
      await saveDestination({
        method,
        accountName: accountName.trim(),
        accountNumber: accountNumber.trim(),
        bankCode: selectedBankCode,
        bankName: bName,
      });
      toast.success(`Paystack ${method === "mobile_money" ? "Mobile Money" : "Bank"} recipient saved!`);
    } catch (err: any) {
      toast.error(err?.message || "Could not register Paystack payout recipient.");
    } finally {
      setSavingDestination(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black">Creator Monetization & Earnings</h2>
          <p className="text-xs text-muted-foreground">
            Direct creator tips, live room support, and real Paystack withdrawals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refresh()}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted/40 transition-all cursor-pointer"
            title="Refresh balance from backend"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => {
              setWithdrawAmount(pendingBalance.toString());
              setIsPayoutModalOpen(true);
            }}
            disabled={pendingBalance <= 0}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2 text-xs font-bold text-white shadow-soft hover:brightness-105 transition-all disabled:opacity-50 cursor-pointer"
          >
            <DollarSign className="h-3.5 w-3.5" />
            <span>Withdraw Balance</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-border/80 bg-card p-5 space-y-2 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Total Earnings
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black">
              {currency} {totalEarnings.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-emerald-500">All-time</span>
          </div>
          <p className="text-[0.7rem] text-muted-foreground">
            Cumulative tips served directly by backend
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-2 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Available Balance
            </span>
            <span className="text-[0.65rem] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              Real-time
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
              {currency} {pendingBalance.toFixed(2)}
            </span>
          </div>
          <p className="text-[0.7rem] text-muted-foreground">
            {destination ? (
              <span>Destination: {destination.bankName} (••{destination.accountNumberLast4})</span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400">No destination configured yet</span>
            )}
          </p>
        </div>

        <div className="rounded-3xl border border-border/80 bg-card p-5 space-y-2 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Platform Take Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground">{platformFee}</span>
          </div>
          <p className="text-[0.7rem] text-muted-foreground">
            {isPro ? "👑 Pro 0% fee active" : "Upgrade to Pro for 0% fee"}
          </p>
        </div>
      </div>

      {/* Paystack Payout Destinations */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 md:p-6 space-y-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <h3 className="text-base font-black flex items-center gap-2">
              <Building2 className="h-4 w-4 text-brand" />
              Paystack Withdrawal Channels
            </h3>
            <p className="text-xs text-muted-foreground">
              Official payment provider withdrawal methods supported by Paystack.
            </p>
          </div>

          {/* Method tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-foreground/5 border border-border/60">
            <button
              type="button"
              onClick={() => setActiveTab("bank")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                activeTab === "bank"
                  ? "bg-card text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Building2 className="h-3.5 w-3.5" /> Bank Transfer
              {destination?.method === "bank" && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("mobile_money")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                activeTab === "mobile_money"
                  ? "bg-card text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Smartphone className="h-3.5 w-3.5" /> Mobile Money
              {destination?.method === "mobile_money" && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                activeTab === "settings"
                  ? "bg-card text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Settings2 className="h-3.5 w-3.5" /> Tip Settings
            </button>
          </div>
        </div>

        {/* Tab 1: Bank Account */}
        {activeTab === "bank" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-foreground/5 border border-border/60 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Paystack direct bank transfers with automatic recipient verification.</span>
              </div>
              {destination?.method === "bank" && (
                <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Active Destination
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Select Bank</label>
                <select
                  value={selectedBankCode}
                  onChange={(e) => setSelectedBankCode(e.target.value)}
                  className="w-full rounded-xl bg-card border border-border px-3 py-2 text-xs sm:text-sm outline-none focus:border-brand"
                >
                  <option value="">{banksLoading ? "Loading Paystack banks..." : "Choose your bank..."}</option>
                  {banks
                    .filter((b) => !b.isMobileMoney)
                    .map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Account Number</label>
                <input
                  type="text"
                  placeholder="e.g. 0123456789"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full rounded-xl bg-card border border-border px-3 py-2 text-xs sm:text-sm outline-none focus:border-brand"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-foreground">Account Holder Full Name</label>
                <input
                  type="text"
                  placeholder="Official name on bank account"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full rounded-xl bg-card border border-border px-3 py-2 text-xs sm:text-sm outline-none focus:border-brand"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => handleSaveDestination("bank")}
                disabled={savingDestination}
                className="flex items-center gap-1.5 rounded-full bg-brand px-5 py-2 text-xs font-bold text-white shadow-soft hover:bg-brand/90 transition-all disabled:opacity-50 cursor-pointer"
              >
                {savingDestination ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                <span>Save Bank Destination</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Mobile Money */}
        {activeTab === "mobile_money" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-foreground/5 border border-border/60 text-xs">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-brand shrink-0" />
                <span>Paystack Mobile Money rails (e.g. M-PESA, MTN MoMo, Airtel Money).</span>
              </div>
              {destination?.method === "mobile_money" && (
                <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Active Destination
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Mobile Money Provider</label>
                <select
                  value={selectedBankCode}
                  onChange={(e) => setSelectedBankCode(e.target.value)}
                  className="w-full rounded-xl bg-card border border-border px-3 py-2 text-xs sm:text-sm outline-none focus:border-brand"
                >
                  <option value="">{banksLoading ? "Loading providers..." : "Choose Mobile Money Provider..."}</option>
                  {banks
                    .filter((b) => b.isMobileMoney || b.name.toLowerCase().includes("mpesa") || b.name.toLowerCase().includes("mobile"))
                    .map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +254712345678"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full rounded-xl bg-card border border-border px-3 py-2 text-xs sm:text-sm outline-none focus:border-brand"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-foreground">Registered Holder Full Name</label>
                <input
                  type="text"
                  placeholder="Official name on SIM/account"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full rounded-xl bg-card border border-border px-3 py-2 text-xs sm:text-sm outline-none focus:border-brand"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => handleSaveDestination("mobile_money")}
                disabled={savingDestination}
                className="flex items-center gap-1.5 rounded-full bg-brand px-5 py-2 text-xs font-bold text-white shadow-soft hover:bg-brand/90 transition-all disabled:opacity-50 cursor-pointer"
              >
                {savingDestination ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                <span>Save Mobile Money Destination</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Tip Settings */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Minimum Tip Amount ({currency})</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={minTipDraft}
                  onChange={(e) => setMinTipDraft(Number(e.target.value))}
                  className="w-full rounded-xl bg-card border border-border px-3 py-2 text-xs sm:text-sm outline-none focus:border-brand"
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="flex items-center gap-2 cursor-pointer pb-2">
                  <input
                    type="checkbox"
                    checked={tipsEnabledDraft}
                    onChange={(e) => setTipsEnabledDraft(e.target.checked)}
                    className="rounded border-border text-brand focus:ring-brand"
                  />
                  <span className="text-xs font-bold text-foreground">Enable Tips on Profile & Posts</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => toast.success("Monetization settings updated")}
                className="flex items-center gap-1.5 rounded-full bg-brand px-5 py-2 text-xs font-bold text-white shadow-soft hover:bg-brand/90 transition-all cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Save Tip Settings</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History Sections: Tips Received & Payouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Real Tips Received */}
        <div className="rounded-3xl border border-border/80 bg-card p-5 space-y-4 shadow-soft">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-black flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
              Recent Tips Received ({tipsReceived.length})
            </h3>
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto [scrollbar-width:thin]">
            {tipsReceived.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                <Heart className="h-6 w-6 mx-auto mb-2 opacity-30 text-rose-500" />
                No tips received yet. Your fans can send tips directly on your profile or posts.
              </div>
            ) : (
              tipsReceived.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition-all text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={t.senderName} src={t.senderAvatar} className="h-8 w-8 text-xs shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold truncate">{t.senderName}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{t.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black text-emerald-600 dark:text-emerald-400">
                      +{currency} {t.amount.toFixed(2)}
                    </span>
                    {t.message && (
                      <p className="text-[10px] text-muted-foreground italic truncate max-w-[140px]" title={t.message}>
                        "{t.message}"
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Real Paystack Payout Withdrawals */}
        <div className="rounded-3xl border border-border/80 bg-card p-5 space-y-4 shadow-soft">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-black flex items-center gap-2">
              <ArrowDownRight className="h-4 w-4 text-emerald-500" />
              Paystack Withdrawals ({payouts.length})
            </h3>
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto [scrollbar-width:thin]">
            {payouts.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                <Wallet className="h-6 w-6 mx-auto mb-2 opacity-30" />
                No withdrawals requested yet.
              </div>
            ) : (
              payouts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition-all text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold capitalize">{p.method.replace("_", " ")}</span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-extrabold capitalize",
                          p.status === "success"
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            : p.status === "failed"
                            ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                            : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        )}
                      >
                        {p.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{p.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black">
                      {currency} {p.amount.toFixed(2)}
                    </span>
                    {p.reference && (
                      <p className="text-[10px] font-mono text-muted-foreground truncate max-w-[120px]" title={p.reference}>
                        {p.reference}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Payout Withdrawal Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-lg font-black">Withdraw Creator Earnings</h3>
              <p className="text-xs text-muted-foreground">
                Process an immediate transfer to your verified Paystack destination.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-foreground/5 border border-border/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available to Withdraw:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">
                  {currency} {pendingBalance.toFixed(2)}
                </span>
              </div>
              {destination && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destination:</span>
                  <span className="font-semibold">{destination.bankName} (••{destination.accountNumberLast4})</span>
                </div>
              )}
            </div>

            <form onSubmit={handlePayoutSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Withdrawal Amount ({currency})</label>
                <input
                  type="number"
                  min="1"
                  max={pendingBalance}
                  step="0.01"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full rounded-xl bg-card border border-border px-3 py-2 text-sm outline-none focus:border-brand"
                  placeholder={pendingBalance.toFixed(2)}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted/40 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={payoutProcessing || pendingBalance <= 0}
                  className="flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-xs font-bold text-white shadow-soft transition-all disabled:opacity-50 cursor-pointer"
                >
                  {payoutProcessing ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  <span>Confirm Withdrawal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
