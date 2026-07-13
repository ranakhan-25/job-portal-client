// "use client";

// import { useMemo, useState } from "react";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";
// import { motion } from "framer-motion";
// import {
//   Wallet,
//   CreditCard,
//   BadgeCheck,
//   DollarSign,
//   Search,
// } from "lucide-react";

// interface Payment {
//   _id: string;
//   transactionId: string;
//   amount: number;
//   credits: number;
//   gateway: "Stripe" | "SSLCommerz";
//   status: "Completed" | "Pending" | "Failed";
//   invoice: string;
//   createdAt: string;
// }

// const getPayments = async (): Promise<Payment[]> => {
//   const { data } = await axios.get(
//     `${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments/my-history`,
//     {
//       withCredentials: true,
//     }
//   );

//   return data;
// };

// export default function PaymentHistory() {
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("All");
//   const [page, setPage] = useState(1);

//   const limit = 10;

//   const {
//     data: payments = [],
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["payment-history"],
//     queryFn: getPayments,
//   });

//   const stats = useMemo(() => {
//     return {
//       totalPaid: payments
//         .filter((p) => p.status === "Completed")
//         .reduce((sum, p) => sum + p.amount, 0),

//       totalTransactions: payments.length,

//       successful: payments.filter(
//         (p) => p.status === "Completed"
//       ).length,

//       monthly: payments
//         .filter(
//           (p) =>
//             new Date(p.createdAt).getMonth() ===
//             new Date().getMonth()
//         )
//         .reduce((sum, p) => sum + p.amount, 0),
//     };
//   }, [payments]);

//   if (isLoading) {
//     return (
//       <div className="flex h-[60vh] items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex h-[60vh] items-center justify-center text-red-500">
//         Failed to load payment history.
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">

//       {/* Hero */}

//       <motion.section
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 p-8 text-white"
//       >
//         <h1 className="text-4xl font-bold">
//           Payment History
//         </h1>

//         <p className="mt-2 text-indigo-100">
//           View your payment history, invoices and
//           purchased credits.
//         </p>
//       </motion.section>

//       {/* Statistics */}

//       <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

//         <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">

//           <Wallet className="text-indigo-600" />

//           <h2 className="mt-4 text-3xl font-bold">
//             ${stats.totalPaid}
//           </h2>

//           <p className="text-slate-500">
//             Total Paid
//           </p>

//         </div>

//         <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">

//           <CreditCard className="text-sky-600" />

//           <h2 className="mt-4 text-3xl font-bold">
//             {stats.totalTransactions}
//           </h2>

//           <p className="text-slate-500">
//             Transactions
//           </p>

//         </div>

//         <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">

//           <BadgeCheck className="text-green-600" />

//           <h2 className="mt-4 text-3xl font-bold">
//             {stats.successful}
//           </h2>

//           <p className="text-slate-500">
//             Successful
//           </p>

//         </div>

//         <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">

//           <DollarSign className="text-orange-600" />

//           <h2 className="mt-4 text-3xl font-bold">
//             ${stats.monthly}
//           </h2>

//           <p className="text-slate-500">
//             This Month
//           </p>

//         </div>

//       </section>

//             {/* Search & Filter */}

//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

//         <div className="relative w-full md:max-w-sm">

//           <Search
//             size={18}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//           />

//           <input
//             type="text"
//             placeholder="Search Transaction ID..."
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(1);
//             }}
//             className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
//           />

//         </div>

//         <select
//           value={status}
//           onChange={(e) => {
//             setStatus(e.target.value);
//             setPage(1);
//           }}
//           className="rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
//         >
//           <option value="All">All Status</option>
//           <option value="Completed">Completed</option>
//           <option value="Pending">Pending</option>
//           <option value="Failed">Failed</option>
//         </select>

//       </div>

//       {/* Filter */}

//       {(() => {

//         const filteredPayments = payments.filter((payment) => {

//           const matchSearch =
//             payment.transactionId
//               .toLowerCase()
//               .includes(search.toLowerCase());

//           const matchStatus =
//             status === "All" ||
//             payment.status === status;

//           return matchSearch && matchStatus;

//         });

//         const totalPages = Math.ceil(
//           filteredPayments.length / limit
//         );

//         const currentPayments = filteredPayments.slice(
//           (page - 1) * limit,
//           page * limit
//         );

//         return (

//           <>
//             {/* Table */}

//             <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">

//               <div className="overflow-x-auto">

//                 <table className="min-w-full">

//                   <thead className="bg-slate-100 dark:bg-slate-800">

//                     <tr>

//                       <th className="px-5 py-4 text-left">
//                         Transaction
//                       </th>

//                       <th className="px-5 py-4 text-left">
//                         Amount
//                       </th>

//                       <th className="px-5 py-4 text-left">
//                         Gateway
//                       </th>

//                       <th className="px-5 py-4 text-left">
//                         Status
//                       </th>

//                       <th className="px-5 py-4 text-center">
//                         Invoice
//                       </th>

//                     </tr>

//                   </thead>

//                   <tbody>

//                     {currentPayments.length === 0 ? (

//                       <tr>

//                         <td
//                           colSpan={5}
//                           className="py-10 text-center text-slate-500"
//                         >
//                           No Payment Found
//                         </td>

//                       </tr>

//                     ) : (

//                       currentPayments.map((payment) => (

//                         <tr
//                           key={payment._id}
//                           className="border-t dark:border-slate-800"
//                         >

//                           <td className="px-5 py-4">

//                             <h3 className="font-semibold">

//                               {payment.transactionId}

//                             </h3>

//                             <p className="text-xs text-slate-500">

//                               {new Date(
//                                 payment.createdAt
//                               ).toLocaleDateString()}

//                             </p>

//                           </td>

//                           <td className="px-5 py-4 font-semibold">

//                             ${payment.amount}

//                           </td>

//                           <td className="px-5 py-4">

//                             {payment.gateway}

//                           </td>

//                           <td className="px-5 py-4">

//                             <span
//                               className={`rounded-full px-3 py-1 text-xs font-semibold

//                               ${
//                                 payment.status === "Completed"
//                                   ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
//                                   : payment.status === "Pending"
//                                   ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300"
//                                   : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
//                               }

//                               `}
//                             >

//                               {payment.status}

//                             </span>

//                           </td>

//                           <td className="px-5 py-4 text-center">

//                             <a
//                               href={payment.invoice}
//                               target="_blank"
//                               className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
//                             >
//                               Invoice
//                             </a>

//                           </td>

//                         </tr>

//                       ))

//                     )}

//                   </tbody>

//                 </table>

//               </div>

//             </div>

//             {/* Part 3 Starts Here */}
//                       {/* Pagination */}

//             {totalPages > 1 && (
//               <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-200 px-6 py-5 dark:border-slate-800 md:flex-row">

//                 <p className="text-sm text-slate-500">
//                   Showing{" "}
//                   <span className="font-semibold">
//                     {currentPayments.length}
//                   </span>{" "}
//                   of{" "}
//                   <span className="font-semibold">
//                     {filteredPayments.length}
//                   </span>{" "}
//                   payments
//                 </p>

//                 <div className="flex items-center gap-2">

//                   <button
//                     disabled={page === 1}
//                     onClick={() => setPage(page - 1)}
//                     className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
//                   >
//                     Previous
//                   </button>

//                   {Array.from(
//                     { length: totalPages },
//                     (_, index) => index + 1
//                   ).map((number) => (
//                     <button
//                       key={number}
//                       onClick={() => setPage(number)}
//                       className={`h-10 w-10 rounded-lg text-sm font-medium transition

//                       ${
//                         page === number
//                           ? "bg-indigo-600 text-white"
//                           : "border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
//                       }
//                       `}
//                     >
//                       {number}
//                     </button>
//                   ))}

//                   <button
//                     disabled={page === totalPages}
//                     onClick={() => setPage(page + 1)}
//                     className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
//                   >
//                     Next
//                   </button>

//                 </div>

//               </div>
//             )}

//           </>
//         );
//       })()}

//     </div>
//   );
// }


import React from 'react'

const page = () => {
  return (
    <div>payment page</div>
  )
}

export default page