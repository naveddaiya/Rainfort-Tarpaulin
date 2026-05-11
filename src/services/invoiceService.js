// Seller details — update SELLER_GSTIN once GST registration is complete
const SELLER_GSTIN = ''; // e.g., '08XXXXX0000X1Z5'
const SELLER_STATE = 'Rajasthan';
const SELLER_ADDRESS = 'Sujangarh, Rajasthan – 331507';
const SELLER_PHONE   = '+91 83850 11488';
const SELLER_EMAIL   = 'enquiry@rainfort.in';

function parseDate(raw) {
  if (!raw) return new Date();
  if (typeof raw.toDate === 'function') return raw.toDate(); // Firestore Timestamp
  return new Date(raw);                                       // ISO string
}

function fmt(n) {
  return Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const generateInvoicePDF = async (order) => {
  const { default: jsPDF }     = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc      = new jsPDF();
  const orderId  = order.id.slice(0, 8).toUpperCase();
  const orderDate = parseDate(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // Determine tax type: same-state → CGST + SGST, inter-state → IGST
  const buyerState   = order.shipping?.state || '';
  const isIntraState = buyerState.trim().toLowerCase() === SELLER_STATE.toLowerCase();

  const pricing      = order.pricing || {};
  const subtotal     = Number(pricing.subtotal     || 0);
  const gstTotal     = Number(pricing.gstAmount    || 0);
  const shipping     = Number(pricing.shippingCharges || 0);
  const grandTotal   = Number(pricing.grandTotal   || 0);

  const buyerGstin   = order.customer?.gstin || null;
  const hasGstin     = !!(buyerGstin || SELLER_GSTIN);
  const invoiceTitle = hasGstin ? 'TAX INVOICE' : 'ORDER RECEIPT';

  // ── Header bar ────────────────────────────────────────────────────────────────
  doc.setFillColor(26, 77, 122);
  doc.rect(0, 0, 210, 42, 'F');
  doc.setTextColor(255, 255, 255);

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('RAINFORT TARPAULIN', 14, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Industrial-Grade Tarpaulin Solutions', 14, 23);
  doc.text(`${SELLER_ADDRESS}  |  ${SELLER_PHONE}  |  ${SELLER_EMAIL}`, 14, 30);
  if (SELLER_GSTIN) {
    doc.text(`GSTIN: ${SELLER_GSTIN}`, 14, 37);
  }

  // ── Invoice title + meta ─────────────────────────────────────────────────────
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(invoiceTitle, 14, 55);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Order ID : #${orderId}`, 14, 63);
  doc.text(`Date     : ${orderDate}`, 14, 69);
  doc.text(`Status   : ${(order.status || 'pending').toUpperCase()}`, 14, 75);
  if (order.payment?.razorpay_payment_id) {
    doc.text(`Payment  : ${order.payment.razorpay_payment_id}`, 14, 81);
  }

  // ── Bill To ──────────────────────────────────────────────────────────────────
  const billX = 120;
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Bill To:', billX, 63);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(order.customer?.name  || 'N/A', billX, 69);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(order.customer?.phone || '', billX, 75);
  doc.text(order.customer?.email || '', billX, 81);
  if (order.customer?.company) doc.text(order.customer.company, billX, 87);
  if (buyerGstin) {
    doc.setFont('helvetica', 'bold');
    doc.text(`GSTIN: ${buyerGstin}`, billX, order.customer?.company ? 93 : 87);
    doc.setFont('helvetica', 'normal');
  }

  // ── Divider ───────────────────────────────────────────────────────────────────
  doc.setDrawColor(220, 220, 220);
  doc.line(14, 96, 196, 96);

  // ── Items table ───────────────────────────────────────────────────────────────
  const tableRows = (order.items || []).map((item, i) => {
    const unit  = Number(item.unitPrice || item.price || 0);
    const qty   = Number(item.quantity  || 0);
    const total = Number(item.lineTotal || (unit * qty) || 0);
    const desc  = [item.selectedSize, item.selectedGsm].filter(Boolean).join(' / ');
    return [
      i + 1,
      desc ? `${item.name}\n${desc}` : item.name,
      item.category || '—',
      qty,
      `₹${fmt(unit)}`,
      `₹${fmt(total)}`,
    ];
  });

  autoTable(doc, {
    startY: 101,
    head: [['#', 'Product', 'Category', 'Qty', 'Unit Price', 'Amount']],
    body: tableRows,
    styles:       { fontSize: 8.5, cellPadding: 3.5 },
    headStyles:   { fillColor: [26, 77, 122], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      3: { cellWidth: 14, halign: 'center' },
      4: { cellWidth: 28, halign: 'right' },
      5: { cellWidth: 28, halign: 'right' },
    },
  });

  const tableBottom = doc.lastAutoTable.finalY + 8;

  // ── Price summary (right-aligned) ─────────────────────────────────────────────
  const summaryX = 118;
  const valX     = 196;
  let   sy       = tableBottom;

  const summaryRow = (label, value, bold = false, color = [60, 60, 60]) => {
    doc.setFontSize(9);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setTextColor(...color);
    doc.text(label, summaryX, sy);
    doc.text(value,  valX,    sy, { align: 'right' });
    sy += 6;
  };

  doc.setDrawColor(220, 220, 220);
  doc.line(summaryX - 2, sy - 3, valX, sy - 3);

  summaryRow('Taxable Amount (Subtotal)', `₹${fmt(subtotal)}`);

  if (isIntraState) {
    const half = gstTotal / 2;
    summaryRow('CGST @ 6%', `₹${fmt(half)}`);
    summaryRow('SGST @ 6%', `₹${fmt(half)}`);
  } else {
    summaryRow('IGST @ 12%', `₹${fmt(gstTotal)}`);
  }

  summaryRow(
    shipping === 0 ? 'Shipping (Free)' : 'Shipping',
    shipping === 0 ? 'FREE' : `₹${fmt(shipping)}`,
  );

  sy += 1;
  doc.setDrawColor(26, 77, 122);
  doc.line(summaryX - 2, sy - 2, valX, sy - 2);
  summaryRow('Grand Total', `₹${fmt(grandTotal)}`, true, [26, 77, 122]);

  // ── Shipping address (left side, same row band as summary) ───────────────────
  if (order.shipping) {
    const addrY = tableBottom;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 107, 0);
    doc.text('Ship To', 14, addrY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const addr = `${order.shipping.address}, ${order.shipping.city},\n${order.shipping.state} – ${order.shipping.pincode}`;
    doc.text(addr, 14, addrY + 6, { maxWidth: 90 });
  }

  // ── Notes ────────────────────────────────────────────────────────────────────
  if (order.notes) {
    const noteY = Math.max(sy + 4, tableBottom + 28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 107, 0);
    doc.text('Notes', 14, noteY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(order.notes, 14, noteY + 6, { maxWidth: 90 });
  }

  // ── GST declaration (for tax invoices) ───────────────────────────────────────
  if (hasGstin) {
    const declY = sy + 10;
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(130, 130, 130);
    const taxType = isIntraState ? 'CGST + SGST (6% each)' : 'IGST (12%)';
    doc.text(
      `This is a computer-generated tax invoice. GST charged: ${taxType}. HSN/SAC as applicable.`,
      14, declY, { maxWidth: 182 },
    );
  }

  // ── Footer ────────────────────────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.height;
  doc.setFillColor(245, 247, 250);
  doc.rect(0, pageH - 22, 210, 22, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text(
    `RainFort Tarpaulin  |  ${SELLER_ADDRESS}  |  www.rainfort.in`,
    105, pageH - 13, { align: 'center' },
  );
  doc.text(
    'Thank you for your order! Our team will contact you within 2 hours.',
    105, pageH - 7, { align: 'center' },
  );

  doc.save(`RainFort-Invoice-${orderId}.pdf`);
};
