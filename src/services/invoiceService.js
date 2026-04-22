export const generateInvoicePDF = async (order) => {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF();
  const orderId = order.id.slice(0, 8).toUpperCase();
  const orderDate = order.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  }) || 'N/A';

  // Header
  doc.setFillColor(26, 77, 122);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('RAINFORT TARPAULIN', 14, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Industrial-Grade Tarpaulin Solutions', 14, 26);
  doc.text('Phone: +91 83850 11488  |  Email: enquiry@rainfort.in', 14, 33);

  // Invoice title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDER RECEIPT / INVOICE', 14, 55);

  // Order info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Order ID: #${orderId}`, 14, 65);
  doc.text(`Date: ${orderDate}`, 14, 72);
  doc.text(`Status: ${order.status?.toUpperCase() || 'PENDING'}`, 14, 79);

  // Customer info
  doc.text(`Invoice To:`, 120, 65);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(order.customer?.name || 'N/A', 120, 72);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(order.customer?.phone || '', 120, 79);
  doc.text(order.customer?.email || '', 120, 86);
  if (order.customer?.company) doc.text(order.customer.company, 120, 93);

  // Divider
  doc.setDrawColor(230, 230, 230);
  doc.line(14, 98, 196, 98);

  // Items table
  const tableData = (order.items || []).map((item, i) => [
    i + 1,
    item.name,
    item.category || '-',
    item.quantity,
    'On Confirmation',
  ]);

  autoTable(doc, {
    startY: 103,
    head: [['#', 'Product', 'Category', 'Qty', 'Price']],
    body: tableData,
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: {
      fillColor: [26, 77, 122],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 35, halign: 'right' },
    },
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // Shipping address
  if (order.shipping) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 107, 0);
    doc.text('SHIPPING ADDRESS', 14, finalY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(
      `${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state} - ${order.shipping.pincode}`,
      14, finalY + 8
    );
  }

  // Notes
  if (order.notes) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 107, 0);
    doc.text('NOTES', 14, finalY + 20);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(order.notes, 14, finalY + 28, { maxWidth: 180 });
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(245, 247, 250);
  doc.rect(0, pageHeight - 25, 210, 25, 'F');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('RainFort Tarpaulin  |  Sujangarh, Rajasthan, India  |  www.rainfort.in', 105, pageHeight - 14, { align: 'center' });
  doc.text('Thank you for your order! Our team will contact you within 2 hours to confirm pricing.', 105, pageHeight - 8, { align: 'center' });

  doc.save(`RainFort-Order-${orderId}.pdf`);
};
