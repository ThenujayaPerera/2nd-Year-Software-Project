// frontend/src/utils/invoicePdf.js
// Generates standard, valid PDF 1.4 documents with official NVSHOP.LK logo client-side and triggers direct download.

import { NVSHOP_LOGO_BASE64 } from './logoBase64';

export const escapePdfText = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
};

export const createInvoicePdfBlob = ({
  orderNumber,
  date,
  customerName,
  customerEmail,
  customerPhone,
  shippingAddress,
  status,
  paymentMethod,
  items,
  subtotal,
  tax,
  shipping,
  total,
}) => {
  // Decode embedded NVSHOP logo bytes
  const rawLogo = atob(NVSHOP_LOGO_BASE64);
  const logoBytes = new Uint8Array(rawLogo.length);
  for (let i = 0; i < rawLogo.length; i++) {
    logoBytes[i] = rawLogo.charCodeAt(i);
  }

  const objects = [];
  const addObject = (content) => {
    objects.push(content);
    return objects.length; // 1-based index
  };

  // Object 1: Catalog
  addObject('<< /Type /Catalog /Pages 2 0 R >>');
  // Object 2: Pages
  addObject('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  // Object 3: Page with fonts and image XObject
  addObject('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> /XObject << /Logo 7 0 R >> >> /Contents 6 0 R >>');
  // Object 4: Font Bold
  addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  // Object 5: Font Normal
  addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

  // Object 6: Stream content instructions
  const streamLines = [
    // Header dark bar (Navy #0f172a)
    '0.06 0.09 0.16 rg 0 755 595.28 87 re f',
    // White background box for logo
    '1 1 1 rg 35 770 160 56 re f',
    // Place NVSHOP.LK Logo: width 150 pt, height 37.5 pt at x=40, y=779
    'q 150 0 0 37.5 40 779 cm /Logo Do Q',
    // Invoice Title on top right (White)
    '1 1 1 rg BT /F1 22 Tf 430 805 Td (INVOICE) Tj ET',
    `0.8 0.85 0.95 rg BT /F2 9 Tf 430 790 Td (Order: ${escapePdfText(orderNumber)}) Tj ET`,
    `0.8 0.85 0.95 rg BT /F2 8 Tf 430 778 Td (Date: ${escapePdfText(date)}) Tj ET`,

    // Metadata Section Headers
    '0.1 0.15 0.25 rg',
    'BT /F1 10 Tf 40 730 Td (BILLED TO) Tj ET',
    'BT /F1 10 Tf 330 730 Td (ORDER INFORMATION) Tj ET',
    '0.85 0.88 0.92 RG 1 w 40 722 m 555 722 l S',

    // Customer Details (Left)
    '0.15 0.2 0.3 rg',
    `BT /F1 10 Tf 40 705 Td (${escapePdfText(customerName)}) Tj ET`,
    `BT /F2 9 Tf 40 691 Td (${escapePdfText(customerEmail)}) Tj ET`,
    `BT /F2 9 Tf 40 677 Td (${escapePdfText(customerPhone)}) Tj ET`,
  ];

  const addr = escapePdfText(shippingAddress || 'Not provided');
  const addr1 = addr.length > 45 ? addr.substring(0, 45) : addr;
  const addr2 = addr.length > 45 ? addr.substring(45, 90) : '';
  streamLines.push(`BT /F2 8.5 Tf 40 663 Td (${addr1}) Tj ET`);
  if (addr2) {
    streamLines.push(`BT /F2 8.5 Tf 40 651 Td (${addr2}) Tj ET`);
  }

  // Order Details (Right)
  streamLines.push(`BT /F2 9 Tf 330 705 Td (Status: ) Tj /F1 9 Tf (${escapePdfText(status)}) Tj ET`);
  streamLines.push(`BT /F2 9 Tf 330 691 Td (Payment Method: ) Tj /F1 9 Tf (${escapePdfText(paymentMethod)}) Tj ET`);
  streamLines.push('BT /F2 9 Tf 330 677 Td (Official Warranty: Verified Authentic) Tj ET');
  streamLines.push('BT /F2 9 Tf 330 663 Td (Store: 185/1/2B New Road, Ambalangoda) Tj ET');

  // Items Table Header
  streamLines.push('0.93 0.95 0.98 rg 40 615 515 22 re f');
  streamLines.push('0.8 0.85 0.92 RG 1 w 40 615 515 22 re S');
  streamLines.push('0.15 0.25 0.45 rg');
  streamLines.push('BT /F1 8.5 Tf 48 623 Td (PRODUCT / ITEM) Tj ET');
  streamLines.push('BT /F1 8.5 Tf 290 623 Td (WARRANTY) Tj ET');
  streamLines.push('BT /F1 8.5 Tf 390 623 Td (QTY) Tj ET');
  streamLines.push('BT /F1 8.5 Tf 440 623 Td (UNIT PRICE) Tj ET');
  streamLines.push('BT /F1 8.5 Tf 510 623 Td (TOTAL) Tj ET');

  // Table Rows
  let currentY = 590;
  (items || []).forEach((item, index) => {
    if (index % 2 === 1) {
      streamLines.push(`0.98 0.98 0.99 rg 40 ${currentY - 6} 515 24 re f`);
    }
    streamLines.push(`0.9 0.92 0.95 RG 0.5 w 40 ${currentY - 6} m 555 ${currentY - 6} l S`);

    streamLines.push('0.1 0.15 0.2 rg');
    const nameStr = escapePdfText(item.productName || item.name || 'Product');
    const nameLine = nameStr.length > 40 ? nameStr.substring(0, 40) + '...' : nameStr;
    const warrantyStr = escapePdfText(item.warrantyPeriod || item.warranty || 'Company Warranty');
    const qty = Number(item.quantity || item.qty) || 1;
    const price = Number(item.price) || 0;
    const lineTotal = Number(item.subtotal) || price * qty;

    streamLines.push(`BT /F1 8.5 Tf 48 ${currentY} Td (${nameLine}) Tj ET`);
    streamLines.push(`BT /F2 8 Tf 290 ${currentY} Td (${warrantyStr}) Tj ET`);
    streamLines.push(`BT /F2 8.5 Tf 395 ${currentY} Td (${qty}) Tj ET`);
    streamLines.push(`BT /F2 8.5 Tf 435 ${currentY} Td (Rs. ${price.toLocaleString()}) Tj ET`);
    streamLines.push(`BT /F1 8.5 Tf 500 ${currentY} Td (Rs. ${lineTotal.toLocaleString()}) Tj ET`);

    currentY -= 26;
  });

  // Totals Section
  const totalsTop = Math.min(currentY - 10, 480);
  streamLines.push(`0.85 0.88 0.92 RG 1 w 350 ${totalsTop + 15} m 555 ${totalsTop + 15} l S`);

  streamLines.push('0.3 0.35 0.45 rg');
  streamLines.push(`BT /F2 9 Tf 360 ${totalsTop} Td (Subtotal:) Tj ET`);
  streamLines.push(`BT /F2 9 Tf 475 ${totalsTop} Td (Rs. ${subtotal.toLocaleString()}) Tj ET`);

  streamLines.push(`BT /F2 9 Tf 360 ${totalsTop - 15} Td (Tax:) Tj ET`);
  streamLines.push(`BT /F2 9 Tf 475 ${totalsTop - 15} Td (Rs. ${tax.toLocaleString()}) Tj ET`);

  streamLines.push(`BT /F2 9 Tf 360 ${totalsTop - 30} Td (Delivery:) Tj ET`);
  streamLines.push(`BT /F2 9 Tf 475 ${totalsTop - 30} Td (Rs. ${shipping.toLocaleString()}) Tj ET`);

  // Final Total Box
  streamLines.push(`0.06 0.09 0.16 rg 350 ${totalsTop - 65} 205 26 re f`);
  streamLines.push('1 1 1 rg');
  streamLines.push(`BT /F1 10.5 Tf 360 ${totalsTop - 56} Td (TOTAL PAID:) Tj ET`);
  streamLines.push(`BT /F1 11 Tf 460 ${totalsTop - 56} Td (Rs. ${total.toLocaleString()}) Tj ET`);

  // Footer & Warranty Policy
  streamLines.push('0.85 0.88 0.92 RG 1 w 40 85 m 555 85 l S');
  streamLines.push('0.45 0.5 0.6 rg');
  streamLines.push('BT /F1 8 Tf 40 70 Td (Official Warranty Claim Policy:) Tj ET');
  streamLines.push('BT /F2 7.5 Tf 40 58 Td (Please retain this digital tax invoice for official warranty coverage and replacement claims at NVSHOP.LK.) Tj ET');
  streamLines.push('BT /F2 7.5 Tf 40 46 Td (NVSHOP Showroom: 185/1/2B New Road, Ambalangoda, Sri Lanka  |  Hotline: +94 77 123 4567  |  support@nvshop.lk) Tj ET');

  const streamContent = streamLines.join('\n');
  const encoder = new TextEncoder();
  const streamBytes = encoder.encode(streamContent);

  // Object 6: Stream Content
  addObject(`<< /Length ${streamBytes.length} >>\nstream\n${streamContent}\nendstream`);

  // Object 7: Image XObject with JPEG stream
  const imgHeader = `<< /Type /XObject /Subtype /Image /Width 360 /Height 90 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logoBytes.length} >>\nstream\n`;
  const imgFooter = '\nendstream';

  // Assemble full PDF Blob using chunks
  const chunks = [];
  const headerStr = '%PDF-1.4\n';
  chunks.push(encoder.encode(headerStr));
  let currentOffset = encoder.encode(headerStr).length;
  const offsets = [];

  // Write objects 1 to 6
  for (let i = 0; i < objects.length; i++) {
    offsets.push(currentOffset);
    const objNum = i + 1;
    const startObj = `${objNum} 0 obj\n`;
    const endObj = '\nendobj\n';
    const objContent = objects[i];

    const partBytes = encoder.encode(startObj + objContent + endObj);
    chunks.push(partBytes);
    currentOffset += partBytes.length;
  }

  // Write object 7 (Logo image)
  offsets.push(currentOffset);
  const obj7Start = encoder.encode('7 0 obj\n' + imgHeader);
  const obj7End = encoder.encode(imgFooter + '\nendobj\n');
  chunks.push(obj7Start, logoBytes, obj7End);
  currentOffset += obj7Start.length + logoBytes.length + obj7End.length;

  // Write XRef Table
  const xrefStart = currentOffset;
  let xrefStr = `xref\n0 8\n0000000000 65535 f \n`;
  for (let i = 0; i < offsets.length; i++) {
    xrefStr += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  xrefStr += `trailer\n<< /Size 8 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  chunks.push(encoder.encode(xrefStr));

  return new Blob(chunks, { type: 'application/pdf' });
};

/**
 * Directly downloads an invoice PDF with embedded NVSHOP logo without opening any new tab or window.
 */
export const downloadDirectInvoicePdf = (order, customer = {}) => {
  if (!order) return;
  const orderDate = new Date(order.createdAt || Date.now());
  const formattedDate = Number.isNaN(orderDate.getTime())
    ? 'Recent'
    : orderDate.toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' });
  const items = order.items || [];
  const subtotal = Number(order.subtotal) || items.reduce((sum, item) => sum + (Number(item.subtotal) || (Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
  const tax = Number(order.tax) || 0;
  const shipping = Number(order.shippingCost) || 0;
  const total = Number(order.totalAmount ?? subtotal + tax + shipping);

  const pdfBlob = createInvoicePdfBlob({
    orderNumber: order.orderNumber || order.id || 'ORDER',
    date: formattedDate,
    customerName: order.customerName || customer.name || 'Valued Customer',
    customerEmail: order.userEmail || customer.email || '',
    customerPhone: order.customerPhone || customer.phone || '',
    shippingAddress: order.shippingAddress || customer.address || '',
    status: order.status || 'PROCESSING',
    paymentMethod: order.paymentMethod || 'COD',
    items,
    subtotal,
    tax,
    shipping,
    total,
  });

  const fileName = `NVSHOP-Invoice-${order.orderNumber || order.id || 'order'}.pdf`;
  const downloadUrl = URL.createObjectURL(pdfBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = downloadUrl;
  downloadLink.download = fileName;
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);
};
