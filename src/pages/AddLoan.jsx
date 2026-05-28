import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  UserPlus,
  Coins,
  Clock,
  Percent,
  HelpCircle,
  Check,
  AlertCircle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useLoans } from "../hooks/useLoans";
import { useAppDispatch } from "../app/store";
import { addLoanAsync } from "../features/loans/loansSlice";
import { fetchBorrowersAsync } from "../features/borrowers/borrowersSlice";
import { borrowersAPI } from "../features/borrowers/borrowersAPI";
import {
  calculateEMI,
  generateAmortizationSchedule,
} from "../utils/calculateEMI";
import { formatCurrency } from "../utils/formatCurrency";

// Zod Validation Schema
const addLoanSchema = z.object({
  borrowerName: z
    .string()
    .min(3, "Borrower name must be at least 3 characters long"),
  email: z.string().email("Invalid email address format"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  amount: z.coerce
    .number()
    .min(50000, "Minimum loan amount is ₹50,000")
    .max(5000000, "Maximum loan amount is ₹50,00,000"),
  interestRate: z.coerce
    .number()
    .min(5, "Minimum annual interest rate is 5%")
    .max(25, "Maximum annual interest rate is 25%"),
  tenure: z.coerce
    .number()
    .min(6, "Minimum tenure is 6 months")
    .max(240, "Maximum tenure is 240 months"),
  loanType: z.enum(["Personal", "Business", "Home", "Education"]),
  purpose: z
    .string()
    .min(5, "Purpose description must be at least 5 characters long"),
});

export const AddLoan = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { borrowers, loans } = useLoans();
  const [selectedBorrowerId, setSelectedBorrowerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(addLoanSchema),
    defaultValues: {
      borrowerName: "",
      email: "",
      phone: "",
      amount: 100000,
      interestRate: 10.5,
      tenure: 24,
      loanType: "Personal",
      purpose: "",
    },
  });

  // Watch fields to calculate EMI and total repayment dynamically
  const watchAmount = watch("amount") || 0;
  const watchRate = watch("interestRate") || 0;
  const watchTenure = watch("tenure") || 0;

  const estimatedEMI = calculateEMI(watchAmount, watchRate, watchTenure);
  const totalRepayment = estimatedEMI * watchTenure;
  const estimatedInterest = Math.max(0, totalRepayment - watchAmount);

  // Auto-complete when choosing an existing borrower
  const handleBorrowerSelect = (bId) => {
    setSelectedBorrowerId(bId);
    if (!bId) {
      reset({
        borrowerName: "",
        email: "",
        phone: "",
        amount: watchAmount,
        interestRate: watchRate,
        tenure: watchTenure,
        loanType: watch("loanType"),
        purpose: watch("purpose"),
      });
      return;
    }

    const b = borrowers.find((x) => x.id === bId);
    if (b) {
      setValue("borrowerName", b.name, { shouldValidate: true });
      setValue("email", b.email, { shouldValidate: true });
      setValue("phone", b.phone, { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let bId = selectedBorrowerId;

      // 1. If it is a new borrower, save them to /borrowers mock table first
      if (!bId) {
        // Generate a new borrower profile
        const creditScores = [780, 810, 690, 720, 640, 590, 840, 750, 480];
        const randomScore =
          creditScores[Math.floor(Math.random() * creditScores.length)];
        const cities = [
          "Mumbai",
          "Delhi",
          "Bengaluru",
          "Pune",
          "Hyderabad",
          "Chennai",
        ];
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        const employmentOptions = ["Employed", "Self-Employed", "Retired"];
        const randomEmp =
          employmentOptions[
            Math.floor(Math.random() * employmentOptions.length)
          ];

        const newBorrower = {
          id: `BWR${String(borrowers.length + 1).padStart(3, "0")}`,
          name: data.borrowerName,
          email: data.email,
          phone: data.phone,
          creditScore: randomScore,
          city: randomCity,
          employmentStatus: randomEmp,
          annualIncome: Math.round(data.amount * 2.5),
        };

        const res = await borrowersAPI.addBorrower(newBorrower);
        bId = res.id;
        // Refresh borrowers list in store
        dispatch(fetchBorrowersAsync());
      }

      // 2. Formulate dates and amortization schedule
      const disbursementDate = new Date().toISOString().slice(0, 10);
      const scheduleDate = new Date();
      scheduleDate.setMonth(scheduleDate.getMonth() + data.tenure);
      const dueDate = scheduleDate.toISOString().slice(0, 10);
      const repaymentSchedule = generateAmortizationSchedule(
        data.amount,
        data.interestRate,
        data.tenure,
        disbursementDate,
      );

      // Enforce custom structured ledger prefix
      const nextLoanId = `LON${String(loans.length + 1).padStart(3, "0")}`;

      // 3. Assemble and dispatch full loan profile to Redux
      const completeLoan = {
        id: nextLoanId,
        borrowerId: bId,
        borrowerName: data.borrowerName,
        amount: data.amount,
        interestRate: data.interestRate,
        tenure: data.tenure,
        status: "Active", // default active disbersed
        loanType: data.loanType,
        disbursementDate,
        dueDate,
        emiAmount: estimatedEMI,
        purpose: data.purpose,
        repaymentSchedule,
        paymentHistory: [],
      };

      await dispatch(addLoanAsync(completeLoan)).unwrap();
      navigate("/loans");
    } catch (err) {
      console.error("Failed to disburse loan:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800 md:text-2xl leading-none">
          Loan Disbursement Wizard
        </h1>
        <p className="text-xs text-slate-400 mt-1.5 leading-normal">
          Validate and disburse new capital allocations onto the enterprise
          portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form panel (Left 2 columns) */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-premium space-y-6"
        >
          {/* Section A: Borrower Registry */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-850 flex items-center gap-1.5 border-b border-slate-150 pb-2">
              <UserPlus className="h-4.5 w-4.5 text-brand-500" />
              <span>Borrower Registry</span>
            </h3>

            {/* Existing borrower autocomplete switcher */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Link Existing Profile (Optional)
                </label>
                <select
                  value={selectedBorrowerId}
                  onChange={(e) => handleBorrowerSelect(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-250 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50 smooth-transition"
                >
                  <option value="">-- Setup New Borrower Profile --</option>
                  {borrowers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} (Credit Score: {b.creditScore})
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Borrower Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  disabled={!!selectedBorrowerId}
                  {...register("borrowerName")}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/20 py-2.5 px-3.5 text-xs font-medium placeholder-slate-400 text-slate-700 outline-none transition-all focus:border-brand-400 focus:bg-white disabled:bg-slate-100 disabled:text-slate-455"
                />

                {errors.borrowerName && (
                  <p className="mt-1 text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.borrowerName.message}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Contact Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. name@domain.com"
                  disabled={!!selectedBorrowerId}
                  {...register("email")}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/20 py-2.5 px-3.5 text-xs font-medium placeholder-slate-400 text-slate-700 outline-none transition-all focus:border-brand-400 focus:bg-white disabled:bg-slate-100 disabled:text-slate-455"
                />

                {errors.email && (
                  <p className="mt-1 text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.email.message}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Phone Number (10 digits)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  disabled={!!selectedBorrowerId}
                  {...register("phone")}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/20 py-2.5 px-3.5 text-xs font-medium placeholder-slate-400 text-slate-700 outline-none transition-all focus:border-brand-400 focus:bg-white disabled:bg-slate-100 disabled:text-slate-455"
                />

                {errors.phone && (
                  <p className="mt-1 text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.phone.message}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section B: Financial particulars */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-850 flex items-center gap-1.5 border-b border-slate-150 pb-2">
              <Coins className="h-4.5 w-4.5 text-brand-500" />
              <span>Lending Agreement particulars</span>
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Amount */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <span>Loan Amount (₹)</span>
                  <span title="Values between ₹50k and ₹50L">
                    <HelpCircle className="h-3.5 w-3.5 text-slate-350 cursor-pointer" />
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="100000"
                  {...register("amount")}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/20 py-2.5 px-3.5 text-xs font-semibold text-slate-700 outline-none transition-all focus:border-brand-400 focus:bg-white"
                />

                {errors.amount && (
                  <p className="mt-1 text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.amount.message}</span>
                  </p>
                )}
              </div>

              {/* Interest Rate */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <span>Interest Rate (%)</span>
                  <span title="Values between 5% and 25%">
                    <Percent className="h-3.5 w-3.5 text-slate-350 cursor-pointer" />
                  </span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="10.5"
                  {...register("interestRate")}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/20 py-2.5 px-3.5 text-xs font-semibold text-slate-700 outline-none transition-all focus:border-brand-400 focus:bg-white"
                />

                {errors.interestRate && (
                  <p className="mt-1 text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.interestRate.message}</span>
                  </p>
                )}
              </div>

              {/* Tenure */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <span>Tenure (Months)</span>
                  <span title="Values between 6 and 240 months">
                    <Clock className="h-3.5 w-3.5 text-slate-350 cursor-pointer" />
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="24"
                  {...register("tenure")}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/20 py-2.5 px-3.5 text-xs font-semibold text-slate-700 outline-none transition-all focus:border-brand-400 focus:bg-white"
                />

                {errors.tenure && (
                  <p className="mt-1 text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.tenure.message}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Type selection */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Loan Type Category
                </label>
                <select
                  {...register("loanType")}
                  className="mt-1.5 w-full rounded-xl border border-slate-250 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50 smooth-transition"
                >
                  <option value="Personal">Personal Loan</option>
                  <option value="Business">Business Loan</option>
                  <option value="Home">Home Loan</option>
                  <option value="Education">Education Loan</option>
                </select>
              </div>

              {/* Purpose */}
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Statement of Purpose
                </label>
                <input
                  type="text"
                  placeholder="e.g. Higher studies MBA at IIM Bangalore"
                  {...register("purpose")}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/20 py-2.5 px-3.5 text-xs font-medium placeholder-slate-400 text-slate-700 outline-none transition-all focus:border-brand-400 focus:bg-white"
                />

                {errors.purpose && (
                  <p className="mt-1 text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.purpose.message}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-150 pt-5">
            <button
              type="button"
              onClick={() => navigate("/loans")}
              className="rounded-xl border border-slate-250 px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 smooth-transition"
            >
              Cancel Disbursement
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/10 hover:bg-brand-700 disabled:opacity-50 smooth-transition"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check className="h-4.5 w-4.5" />
                  <span>Approve & Disburse</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Dynamic Calculator panel (Right 1 column) */}
        <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-6 shadow-premium flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">EMI Estimator</h3>
                <p className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">
                  Realtime Calculations
                </p>
              </div>
            </div>

            <div className="space-y-4.5 text-xs">
              {/* Calculated EMI */}
              <div className="rounded-xl bg-slate-850 p-4 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Estimated Monthly EMI
                </span>
                <p className="text-2xl font-black text-brand-400 mt-1 leading-none">
                  {formatCurrency(estimatedEMI)}
                </p>
              </div>

              {/* Principal Amount */}
              <div className="flex justify-between border-b border-slate-850 pb-2.5">
                <span className="font-semibold text-slate-400">
                  Principal Volume
                </span>
                <span className="font-bold text-slate-100">
                  {formatCurrency(watchAmount)}
                </span>
              </div>

              {/* Interest volume */}
              <div className="flex justify-between border-b border-slate-850 pb-2.5">
                <span className="font-semibold text-slate-400">
                  Total Interest Payable
                </span>
                <span className="font-bold text-emerald-400">
                  +{formatCurrency(estimatedInterest)}
                </span>
              </div>

              {/* Aggregate value */}
              <div className="flex justify-between border-b border-slate-850 pb-2.5">
                <span className="font-semibold text-slate-400">
                  Aggregate Repayments
                </span>
                <span className="font-bold text-slate-100">
                  {formatCurrency(totalRepayment)}
                </span>
              </div>

              {/* Interest Rate summary */}
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">
                  Annual Pricing (APR)
                </span>
                <span className="font-bold text-slate-100">
                  {watchRate}% per annum
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-slate-850/60 p-4 border border-slate-850 text-[11px] text-slate-400 leading-normal flex items-start gap-2.5">
            <AlertCircle className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              All estimates are calculated based on monthly compounding
              amortizations. Actual banking ledger terms might differ slightly
              depending on tax additions.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLoan;
