const fs = require('fs');
const path = require('path');

// 20 realistic Indian borrowers
const IndianBorrowers = [
  { name: "Aarav Sharma", email: "aarav.sharma@gmail.com", phone: "9876543210", creditScore: 780, city: "Mumbai", employmentStatus: "Employed", annualIncome: 1800000 },
  { name: "Vihaan Patel", email: "vihaan.patel@yahoo.com", phone: "9812345678", creditScore: 710, city: "Ahmedabad", employmentStatus: "Self-Employed", annualIncome: 2400000 },
  { name: "Aditya Verma", email: "aditya.v@outlook.com", phone: "9765432109", creditScore: 820, city: "Delhi", employmentStatus: "Employed", annualIncome: 3000000 },
  { name: "Sai Reddy", email: "sai.reddy@gmail.com", phone: "9988776655", creditScore: 680, city: "Hyderabad", employmentStatus: "Employed", annualIncome: 1200000 },
  { name: "Ananya Iyer", email: "ananya.iyer@icloud.com", phone: "9898989898", creditScore: 790, city: "Chennai", employmentStatus: "Self-Employed", annualIncome: 1500000 },
  { name: "Ishan Joshi", email: "ishan.joshi@gmail.com", phone: "9654321987", creditScore: 620, city: "Pune", employmentStatus: "Employed", annualIncome: 950000 },
  { name: "Kabir Malhotra", email: "kabir.m@gmail.com", phone: "9543216789", creditScore: 750, city: "Gurugram", employmentStatus: "Employed", annualIncome: 2200000 },
  { name: "Diya Nair", email: "diya.nair@yahoo.com", phone: "9123456789", creditScore: 800, city: "Bengaluru", employmentStatus: "Employed", annualIncome: 1600000 },
  { name: "Pragya Chaudhary", email: "pragya.c@gmail.com", phone: "9012345678", creditScore: 590, city: "Noida", employmentStatus: "Self-Employed", annualIncome: 800000 },
  { name: "Advait Kulkarni", email: "advait.k@gmail.com", phone: "9823456781", creditScore: 740, city: "Pune", employmentStatus: "Employed", annualIncome: 1400000 },
  { name: "Riya Gupta", email: "riya.gupta@outlook.com", phone: "9712345680", creditScore: 660, city: "Kolkata", employmentStatus: "Self-Employed", annualIncome: 1100000 },
  { name: "Vivaan Rao", email: "vivaan.rao@gmail.com", phone: "9612345681", creditScore: 720, city: "Bengaluru", employmentStatus: "Employed", annualIncome: 1700000 },
  { name: "Reyansh Sinha", email: "reyansh.s@gmail.com", phone: "9512345682", creditScore: 510, city: "Patna", employmentStatus: "Unemployed", annualIncome: 350000 },
  { name: "Aanya Deshmukh", email: "aanya.d@gmail.com", phone: "9412345683", creditScore: 760, city: "Mumbai", employmentStatus: "Employed", annualIncome: 2000000 },
  { name: "Zara Khan", email: "zara.khan@gmail.com", phone: "9312345684", creditScore: 840, city: "Lucknow", employmentStatus: "Retired", annualIncome: 1300000 },
  { name: "Aranya Sen", email: "aranya.sen@gmail.com", phone: "9212345685", creditScore: 690, city: "Kolkata", employmentStatus: "Self-Employed", annualIncome: 1250000 },
  { name: "Arjun Banerjee", email: "arjun.b@gmail.com", phone: "9112345686", creditScore: 730, city: "Delhi", employmentStatus: "Employed", annualIncome: 1900000 },
  { name: "Dhruv Bhatt", email: "dhruv.b@yahoo.com", phone: "9012345687", creditScore: 450, city: "Jaipur", employmentStatus: "Self-Employed", annualIncome: 600000 },
  { name: "Kiara Prasad", email: "kiara.p@gmail.com", phone: "9871234560", creditScore: 770, city: "Mumbai", employmentStatus: "Employed", annualIncome: 2100000 },
  { name: "Sai Krishna", email: "sai.krishna@gmail.com", phone: "9861234561", creditScore: 640, city: "Vijayawada", employmentStatus: "Employed", annualIncome: 900000 }
];

// Helper to format date relative to days
function addMonths(dateStr, months) {
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}

// Generate loan purpose based on type
function getPurpose(type) {
  const purposes = {
    Personal: ["Medical Emergency", "Home Renovation", "Wedding Expenses", "Debt Consolidation", "Vacation Financing"],
    Business: ["Working Capital", "Equipment Purchase", "Inventory Expansion", "Office Renovation", "Marketing Campaign"],
    Home: ["Apartment Acquisition", "Villa Construction", "Land Purchase", "Home Extension"],
    Education: ["Higher Studies in USA", "MBA at IIM", "Medical Engineering Degree", "Overseas Pilot Training"]
  };
  const list = purposes[type];
  return list[Math.floor(Math.random() * list.length)];
}

const borrowers = IndianBorrowers.map((b, index) => ({
  id: `BWR${String(index + 1).padStart(3, '0')}`,
  ...b
}));

const loanTypes = ["Personal", "Business", "Home", "Education"];
const loanStatuses = ["Active", "Closed", "Pending", "Defaulted"];

// We will construct 50 loans
const loans = [];
const currentDateStr = "2026-05-28";
const currentDate = new Date(currentDateStr);

for (let i = 1; i <= 50; i++) {
  const loanId = `LON${String(i).padStart(3, '0')}`;
  
  // Pick borrower
  const bIndex = (i - 1) % borrowers.length; // Ensure even distribution across all 20 borrowers
  const borrower = borrowers[bIndex];
  
  // Loan type determination
  const loanType = loanTypes[(i - 1) % loanTypes.length];
  
  // Decide Amount, Rate and Tenure based on Loan Type
  let amount = 100000;
  let interestRate = 12.0;
  let tenure = 24; // months
  
  if (loanType === "Personal") {
    amount = 50000 + ((i * 17) % 10) * 50000; // ₹50k to ₹500k
    interestRate = 10.5 + ((i * 3) % 6) * 0.8; // 10.5% to 14.5%
    tenure = 12 + ((i * 7) % 4) * 12; // 12, 24, 36, 48 months
  } else if (loanType === "Business") {
    amount = 500000 + ((i * 29) % 10) * 450000; // ₹500k to ₹5000k
    interestRate = 11.5 + ((i * 2) % 6) * 0.9; // 11.5% to 16%
    tenure = 24 + ((i * 5) % 4) * 12; // 24, 36, 48, 60 months
  } else if (loanType === "Home") {
    amount = 1500000 + ((i * 41) % 10) * 350000; // ₹1500k to ₹5000k
    interestRate = 8.2 + ((i * 1) % 5) * 0.3; // 8.2% to 9.4%
    tenure = 120 + ((i * 3) % 4) * 24; // 120, 144, 168, 192 months
  } else if (loanType === "Education") {
    amount = 200000 + ((i * 13) % 10) * 150000; // ₹200k to ₹1700k
    interestRate = 9.0 + ((i * 4) % 5) * 0.5; // 9% to 11%
    tenure = 36 + ((i * 9) % 4) * 12; // 36, 48, 60, 72 months
  }

  // Disbursement Date spread between 2023-01-01 and 2025-12-31
  const year = 2023 + ((i * 7) % 3); // 2023, 2024, 2025
  const month = 1 + ((i * 11) % 12);
  const day = 1 + ((i * 19) % 28);
  const disbursementDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const dueDate = addMonths(disbursementDate, tenure);

  // Determine status
  let status = "Active";
  if (borrower.creditScore < 500) {
    status = "Defaulted";
  } else if (new Date(dueDate) < currentDate) {
    status = "Closed";
  } else if (i % 9 === 0) {
    status = "Pending";
  } else if (i % 13 === 0) {
    status = "Defaulted";
  } else {
    if (i % 7 === 0) {
      status = "Closed";
    } else {
      status = "Active";
    }
  }

  // Overrides to make sure we have active, pending, closed, defaulted
  if (i === 1) status = "Active";
  if (i === 2) status = "Pending";
  if (i === 3) status = "Closed";
  if (i === 4) status = "Defaulted";

  // Calculate EMI
  const monthlyRate = (interestRate / 12) / 100;
  const emiAmount = Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1));

  // Amortization Schedule
  let remainingPrincipal = amount;
  const repaymentSchedule = [];
  const paymentHistory = [];

  for (let m = 1; m <= tenure; m++) {
    const interest = Math.round(remainingPrincipal * monthlyRate);
    const principal = Math.min(Math.round(emiAmount - interest), remainingPrincipal);
    remainingPrincipal = Math.max(0, remainingPrincipal - principal);
    const scheduledDate = addMonths(disbursementDate, m);
    const scheduledDateObj = new Date(scheduledDate);
    
    let periodStatus = "Pending";
    if (status === "Closed") {
      periodStatus = "Paid";
    } else if (status === "Pending") {
      periodStatus = "Pending";
    } else if (scheduledDateObj < currentDate) {
      if (status === "Defaulted" && m >= tenure - 4) {
        periodStatus = "Overdue";
      } else {
        periodStatus = "Paid";
      }
    }

    repaymentSchedule.push({
      month: m,
      dueDate: scheduledDate,
      emiAmount,
      principal,
      interest,
      remainingPrincipal,
      status: periodStatus
    });

    if (periodStatus === "Paid") {
      paymentHistory.push({
        id: `PAY${loanId}${String(m).padStart(3, '0')}`,
        paymentDate: addMonths(disbursementDate, m),
        amountPaid: emiAmount,
        status: "Paid",
        notes: `EMI Month ${m} processed automatically`
      });
    } else if (periodStatus === "Overdue") {
      paymentHistory.push({
        id: `PAY${loanId}${String(m).padStart(3, '0')}`,
        paymentDate: addMonths(disbursementDate, m),
        amountPaid: 0,
        status: "Missed",
        notes: `EMI Month ${m} payment defaulted`
      });
    }
  }

  if (status === "Defaulted" && paymentHistory.length > 2) {
    paymentHistory[paymentHistory.length - 2].status = "Late";
    paymentHistory[paymentHistory.length - 2].notes = "Late payment processed with penalty";
  }

  loans.push({
    id: loanId,
    borrowerId: borrower.id,
    borrowerName: borrower.name,
    amount,
    interestRate,
    tenure,
    status,
    loanType,
    disbursementDate,
    dueDate,
    emiAmount,
    purpose: getPurpose(loanType),
    repaymentSchedule, // Keep full schedule so that details page is robust
    paymentHistory: paymentHistory.slice(-10) // Keep recent payments
  });
}

// Write to db.json
const dbContent = {
  borrowers,
  loans
};

const targetDir = path.join(__dirname);
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(
  path.join(__dirname, 'db.json'), 
  JSON.stringify(dbContent, null, 2), 
  'utf-8'
);

console.log("SUCCESS: Programmatically generated db.json with 20 borrowers and 50 fully linked loans!");
