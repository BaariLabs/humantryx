import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { PayrollRecordWithEmployee } from "../types";

interface ExtendedJsPDF extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

const BRAND = {
  primary: [15, 82, 186] as [number, number, number],
  primaryDark: [10, 60, 140] as [number, number, number],
  accent: [45, 156, 219] as [number, number, number],
  dark: [30, 30, 40] as [number, number, number],
  text: [55, 55, 70] as [number, number, number],
  lightText: [120, 120, 140] as [number, number, number],
  sectionBg: [245, 247, 252] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  border: [220, 225, 235] as [number, number, number],
  earnings: [16, 124, 65] as [number, number, number],
  earningsBg: [240, 253, 244] as [number, number, number],
  deductions: [185, 28, 28] as [number, number, number],
  deductionsBg: [254, 242, 242] as [number, number, number],
  netPayBg: [238, 242, 255] as [number, number, number],
};

export class PayslipPDF {
  private doc: ExtendedJsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin = 18;

  constructor() {
    this.doc = new jsPDF() as ExtendedJsPDF;
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  generatePayslip(
    payrollRecord: PayrollRecordWithEmployee,
    organizationName?: string,
  ): void {
    this.addHeader(payrollRecord, organizationName);
    this.addEmployeeInfo(payrollRecord);
    this.addEarningsAndDeductions(payrollRecord);
    this.addNetPaySummary(payrollRecord);
    this.addPaymentInfo(payrollRecord);
    this.addFooter(payrollRecord, organizationName);
  }

  private addHeader(
    payrollRecord: PayrollRecordWithEmployee,
    organizationName?: string,
  ): void {
    const contentWidth = this.pageWidth - 2 * this.margin;

    // Top accent bar
    this.doc.setFillColor(...BRAND.primary);
    this.doc.rect(0, 0, this.pageWidth, 4, "F");

    // Company logo area
    this.doc.setFillColor(...BRAND.primary);
    this.doc.roundedRect(this.margin, 12, 32, 20, 3, 3, "F");
    this.doc.setTextColor(...BRAND.white);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(11);
    this.doc.text("Simplifiiq", this.margin + 3.5, 24);

    // Organization name
    this.doc.setTextColor(...BRAND.dark);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(16);
    const orgName = organizationName || "Organization";
    this.doc.text(orgName, this.margin + 38, 22);

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8);
    this.doc.setTextColor(...BRAND.lightText);
    this.doc.text("hr.simplifiiq.com", this.margin + 38, 29);

    // Payslip title block on right
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(20);
    this.doc.setTextColor(...BRAND.primary);
    const titleX = this.pageWidth - this.margin;
    this.doc.text("PAYSLIP", titleX, 20, { align: "right" });

    // Pay period
    const [year, month] = payrollRecord.payrollMonth.split("-");
    const payPeriod = new Date(
      parseInt(year || "2024"),
      parseInt(month || "1") - 1,
    ).toLocaleDateString("en-US", { year: "numeric", month: "long" });

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9);
    this.doc.setTextColor(...BRAND.lightText);
    this.doc.text(payPeriod, titleX, 27, { align: "right" });

    // Divider line
    this.doc.setDrawColor(...BRAND.border);
    this.doc.setLineWidth(0.6);
    this.doc.line(this.margin, 38, this.margin + contentWidth, 38);
  }

  private addEmployeeInfo(payrollRecord: PayrollRecordWithEmployee): void {
    const startY = 46;
    const contentWidth = this.pageWidth - 2 * this.margin;
    const halfWidth = contentWidth / 2 - 4;

    // Employee details card
    this.doc.setFillColor(...BRAND.sectionBg);
    this.doc.roundedRect(this.margin, startY, contentWidth, 36, 3, 3, "F");

    // Left column - Employee Info
    const leftX = this.margin + 8;
    let y = startY + 10;

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(8);
    this.doc.setTextColor(...BRAND.primary);
    this.doc.text("EMPLOYEE DETAILS", leftX, y);

    y += 7;
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9);
    this.doc.setTextColor(...BRAND.dark);
    this.doc.text(payrollRecord.employee?.user?.name || "N/A", leftX, y);

    y += 5.5;
    this.doc.setFontSize(8);
    this.doc.setTextColor(...BRAND.text);
    this.doc.text(payrollRecord.employee?.user?.email || "N/A", leftX, y);

    y += 5.5;
    const designation =
      payrollRecord.employee?.designation?.replace(/_/g, " ").toUpperCase() ||
      "N/A";
    this.doc.text(designation, leftX, y);

    // Right column - Pay Info
    const rightX = this.margin + halfWidth + 12;
    y = startY + 10;

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(8);
    this.doc.setTextColor(...BRAND.primary);
    this.doc.text("PAY INFORMATION", rightX, y);

    y += 7;
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8);
    this.doc.setTextColor(...BRAND.text);

    this.doc.setFont("helvetica", "bold");
    this.doc.text("Employee ID:", rightX, y);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(
      payrollRecord.employeeId.substring(0, 8).toUpperCase(),
      rightX + 28,
      y,
    );

    y += 5.5;
    const [year, month] = payrollRecord.payrollMonth.split("-");
    const payPeriod = new Date(
      parseInt(year || "2024"),
      parseInt(month || "1") - 1,
    ).toLocaleDateString("en-US", { year: "numeric", month: "long" });
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Pay Period:", rightX, y);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(payPeriod, rightX + 24, y);

    y += 5.5;
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Currency:", rightX, y);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(payrollRecord.currency, rightX + 20, y);
  }

  private addEarningsAndDeductions(
    payrollRecord: PayrollRecordWithEmployee,
  ): void {
    const startY = 90;
    const currency =
      payrollRecord.currency === "USD" ? "$" : payrollRecord.currency;
    const contentWidth = this.pageWidth - 2 * this.margin;
    const colWidth = contentWidth / 2 - 3;

    // === EARNINGS TABLE (left side) ===
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(9);
    this.doc.setTextColor(...BRAND.earnings);
    this.doc.text("EARNINGS", this.margin, startY);

    const earningsData = [
      [
        "Basic Salary",
        `${currency}${parseFloat(payrollRecord.baseSalary).toLocaleString()}`,
      ],
      [
        "Bonuses",
        `${currency}${parseFloat(payrollRecord.bonuses || "0").toLocaleString()}`,
      ],
      [
        "Allowances",
        `${currency}${parseFloat(payrollRecord.allowances || "0").toLocaleString()}`,
      ],
    ];

    autoTable(this.doc, {
      startY: startY + 3,
      head: [["Description", "Amount"]],
      body: earningsData,
      foot: [
        [
          "Total Earnings",
          `${currency}${parseFloat(payrollRecord.grossPay).toLocaleString()}`,
        ],
      ],
      theme: "plain",
      tableWidth: colWidth,
      margin: { left: this.margin },
      headStyles: {
        fillColor: BRAND.earningsBg,
        textColor: BRAND.earnings,
        fontStyle: "bold",
        fontSize: 8,
        cellPadding: 3,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: BRAND.text,
        cellPadding: 3,
        lineColor: BRAND.border,
        lineWidth: 0.2,
      },
      footStyles: {
        fillColor: BRAND.earningsBg,
        textColor: BRAND.earnings,
        fontStyle: "bold",
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "right" },
      },
    });

    // === DEDUCTIONS TABLE (right side) ===
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(9);
    this.doc.setTextColor(...BRAND.deductions);
    this.doc.text("DEDUCTIONS", this.margin + colWidth + 6, startY);

    const deductionsData = [
      [
        `Tax (${payrollRecord.taxPercentage || "0"}%)`,
        `${currency}${parseFloat(payrollRecord.taxDeduction || "0").toLocaleString()}`,
      ],
      [
        `Leave (${payrollRecord.unpaidLeaveDays || 0} days)`,
        `${currency}${parseFloat(payrollRecord.leaveDeduction || "0").toLocaleString()}`,
      ],
    ];

    autoTable(this.doc, {
      startY: startY + 3,
      head: [["Description", "Amount"]],
      body: deductionsData,
      foot: [
        [
          "Total Deductions",
          `${currency}${parseFloat(payrollRecord.totalDeductions).toLocaleString()}`,
        ],
      ],
      theme: "plain",
      tableWidth: colWidth,
      margin: { left: this.margin + colWidth + 6 },
      headStyles: {
        fillColor: BRAND.deductionsBg,
        textColor: BRAND.deductions,
        fontStyle: "bold",
        fontSize: 8,
        cellPadding: 3,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: BRAND.text,
        cellPadding: 3,
        lineColor: BRAND.border,
        lineWidth: 0.2,
      },
      footStyles: {
        fillColor: BRAND.deductionsBg,
        textColor: BRAND.deductions,
        fontStyle: "bold",
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "right" },
      },
    });
  }

  private addNetPaySummary(payrollRecord: PayrollRecordWithEmployee): void {
    const currency =
      payrollRecord.currency === "USD" ? "$" : payrollRecord.currency;
    const tableEndY = this.doc.lastAutoTable?.finalY ?? 160;
    const summaryY = tableEndY + 12;
    const contentWidth = this.pageWidth - 2 * this.margin;

    // Net pay highlight box
    this.doc.setFillColor(...BRAND.primary);
    this.doc.roundedRect(this.margin, summaryY, contentWidth, 22, 3, 3, "F");

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(12);
    this.doc.setTextColor(...BRAND.white);
    this.doc.text("NET PAY", this.margin + 10, summaryY + 14);

    const netPayText = `${currency}${parseFloat(payrollRecord.netPay).toLocaleString()}`;
    this.doc.setFontSize(16);
    this.doc.text(
      netPayText,
      this.pageWidth - this.margin - 10,
      summaryY + 14.5,
      { align: "right" },
    );

    // Breakdown below
    const breakdownY = summaryY + 28;
    this.doc.setFontSize(8);
    this.doc.setTextColor(...BRAND.lightText);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(
      `Gross: ${currency}${parseFloat(payrollRecord.grossPay).toLocaleString()}  |  Deductions: ${currency}${parseFloat(payrollRecord.totalDeductions).toLocaleString()}  |  Working Days: ${payrollRecord.totalWorkingDays}`,
      this.pageWidth / 2,
      breakdownY,
      { align: "center" },
    );
  }

  private addPaymentInfo(payrollRecord: PayrollRecordWithEmployee): void {
    const tableEndY = this.doc.lastAutoTable?.finalY ?? 160;
    const infoY = tableEndY + 48;

    if (payrollRecord.paymentDate || payrollRecord.paymentReference) {
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(8);
      this.doc.setTextColor(...BRAND.primary);
      this.doc.text("PAYMENT DETAILS", this.margin, infoY);

      let y = infoY + 7;
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(8);
      this.doc.setTextColor(...BRAND.text);

      if (payrollRecord.paymentDate) {
        this.doc.text(
          `Payment Date: ${new Date(payrollRecord.paymentDate).toLocaleDateString()}`,
          this.margin,
          y,
        );
        y += 5;
      }

      if (payrollRecord.paymentReference) {
        this.doc.text(
          `Reference: ${payrollRecord.paymentReference}`,
          this.margin,
          y,
        );
      }
    }
  }

  private addFooter(
    payrollRecord: PayrollRecordWithEmployee,
    organizationName?: string,
  ): void {
    const footerY = this.pageHeight - 28;

    // Notes
    if (payrollRecord.notes) {
      const notesY = footerY - 18;
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(7);
      this.doc.setTextColor(...BRAND.dark);
      this.doc.text("Notes:", this.margin, notesY);

      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(7);
      this.doc.setTextColor(...BRAND.text);
      const lines = this.doc.splitTextToSize(
        payrollRecord.notes,
        this.pageWidth - 2 * this.margin,
      );
      this.doc.text(lines, this.margin, notesY + 5);
    }

    // Bottom accent bar
    this.doc.setFillColor(...BRAND.primary);
    this.doc.rect(0, this.pageHeight - 4, this.pageWidth, 4, "F");

    // Divider
    this.doc.setDrawColor(...BRAND.border);
    this.doc.setLineWidth(0.3);
    this.doc.line(
      this.margin,
      footerY - 4,
      this.pageWidth - this.margin,
      footerY - 4,
    );

    // Footer left
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(7);
    this.doc.setTextColor(...BRAND.lightText);
    this.doc.text(
      "This is a system-generated payslip and does not require a signature.",
      this.margin,
      footerY,
    );

    const generatedBy =
      payrollRecord.generatedByEmployee?.user?.name || "System";
    this.doc.text(
      `Generated by: ${generatedBy}  |  Payslip ID: ${payrollRecord.id.substring(0, 8).toUpperCase()}`,
      this.margin,
      footerY + 5,
    );

    // Footer right
    const companyText = `${organizationName || "Organization"} — Powered by Simplifiiq`;
    const companyTextWidth = this.doc.getTextWidth(companyText);
    this.doc.text(
      companyText,
      this.pageWidth - this.margin - companyTextWidth,
      footerY,
    );

    const urlText = "hr.simplifiiq.com";
    const urlWidth = this.doc.getTextWidth(urlText);
    this.doc.setTextColor(...BRAND.primary);
    this.doc.text(
      urlText,
      this.pageWidth - this.margin - urlWidth,
      footerY + 5,
    );
  }

  download(fileName: string): void {
    this.doc.save(fileName);
  }

  getBlob(): Blob {
    return this.doc.output("blob");
  }

  getDataUrl(): string {
    return this.doc.output("dataurlstring");
  }
}
