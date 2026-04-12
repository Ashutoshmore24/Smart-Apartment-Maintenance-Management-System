/* Everything Ready */
import React from "react";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import QRCode from "qrcode";

const RecentPayments = ({ payments }) => {

    if (payments.length === 0) {
        return (
            <div className="p-6 bg-white border rounded-xl dark:bg-gray-800 dark:border-gray-700">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Payments
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    No recent payments found.
                </p>
            </div>
        );
    }

    const generatePDF = async (payment) => {

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        /* WATERMARK */
        doc.setFontSize(60);
        doc.setTextColor(235, 235, 235);
        doc.text("SMARTSTAY", pageWidth / 2, pageHeight / 2, {
            align: "center",
            angle: 45
        });

        /* QR DATA */
        const qrData = `
SmartStay Payment
Receipt ID: ${payment.payment_id}
Request ID: ${payment.request_id}
Amount: ${payment.amount}₹
Date: ${payment.payment_date}
`;

        const qrImage = await QRCode.toDataURL(qrData);

        /* HEADER */
        doc.setFontSize(18);
        doc.setTextColor(41, 128, 185);
        doc.text("SmartStay Maintenance", pageWidth / 2, 20, { align: "center" });

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Apartment Maintenance Payment Receipt", pageWidth / 2, 28, { align: "center" });

        doc.line(20, 35, 190, 35);

        /* TABLE DATA */

        const tableData = [
            ["Receipt ID", `#${payment.payment_id}`],
            ["Request ID", `#${payment.request_id}`],
            ["Resident Name", payment.resident_name || "N/A"],
            ["Technician Name", payment.technician_name || "N/A"],
            ["Service Category", payment.request_category],
            ["Service Type", payment.request_type],
            ["Payment Date", new Date(payment.payment_date).toLocaleDateString()],
            ["Payment Time", new Date(payment.payment_date).toLocaleTimeString()],
            ["Payment Mode", payment.payment_mode || "Online"],
            ["Transaction ID", payment.transaction_id || "N/A"],
            ["Amount Paid", `${payment.amount} ₹`]
        ];

        let startY = 50;

        tableData.forEach((row) => {

            doc.setDrawColor(200);
            doc.rect(20, startY - 6, 80, 10);
            doc.rect(100, startY - 6, 90, 10);

            doc.setFontSize(11);
            doc.setTextColor(40);

            /* COLUMN 1 (BOLD LABELS) */
            doc.setFont("helvetica", "bold");
            doc.text(row[0], 25, startY);

            /* COLUMN 2 (VALUES) */
            doc.setFont("helvetica", "normal");
            doc.text(String(row[1]), 105, startY);

            startY += 12;
        });

        /* QR CODE AFTER TABLE */

        doc.addImage(qrImage, "PNG", pageWidth / 2 - 15, startY + 5, 30, 30);

        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(
            "Scan to verify payment",
            pageWidth / 2,
            startY + 40,
            { align: "center" }
        );

        /* FOOTER */

        doc.setFontSize(10);
        doc.setTextColor(120);

        doc.text(
            "This is a system generated receipt from SmartStay Maintenance System.",
            pageWidth / 2,
            startY + 60,
            { align: "center" }
        );

        doc.text(
            "Thank you for your payment. For queries contact apartment administration.",
            pageWidth / 2,
            startY + 68,
            { align: "center" }
        );

        doc.save(`SmartStay_Receipt_${payment.request_id}_${payment.payment_id}.pdf`);
    };

    return (
        <div className="overflow-hidden bg-white border rounded-xl dark:bg-gray-800 dark:border-gray-700">

            <div className="p-4 border-b bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Payments
                </h3>
            </div>

            <div className="overflow-x-auto">

                <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">

                    <thead className="font-medium text-gray-900 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                        <tr>
                            <th className="px-4 py-3">Req ID</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3 text-right">Receipt</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 dark:divide-gray-600">

                        {payments.map((payment) => (

                            <tr
                                key={payment.payment_id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800"
                            >

                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                    #{payment.request_id}
                                </td>

                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 rounded-full bg-blue-50 dark:bg-blue-900 dark:text-blue-200">
                                        {payment.request_type}
                                    </span>
                                </td>

                                <td className="px-4 py-3">
                                    {payment.request_category}
                                </td>

                                <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">
                                    ₹{payment.amount}
                                </td>

                                <td className="px-4 py-3 text-right">

                                    <button
                                        onClick={() => generatePDF(payment)}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-colors dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                                    >
                                        <Download size={14} />
                                        PDF
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>
        </div>
    );
};

export default RecentPayments;