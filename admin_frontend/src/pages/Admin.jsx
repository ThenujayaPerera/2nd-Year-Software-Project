import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  TrendingUp, ArrowRight, Plus, Pencil, Trash2,
  RefreshCw, Download, Search, Filter, ShieldCheck, AlertTriangle, CreditCard, Check, X, Ban, UserCheck, UserPlus, Shield, LogOut, Activity, ShieldAlert, Star, Image as ImageIcon, Warehouse, Truck, Menu, Eye, Smartphone, FileText, ChevronDown, Store, Clock, MessageSquare
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import AdminProductPreview from '../components/AdminProductPreview';
import CustomizeHomeTab from '../components/CustomizeHomeTab';
import StockManagementTab from '../components/StockManagementTab';
import SuppliersTab from '../components/SuppliersTab';
import ShopSettingsTab from '../components/ShopSettingsTab';
import ReviewsTab from '../components/ReviewsTab';

export default function Admin({ admin, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalProducts: 0,
    lowStockCount: 0,
    lowStockProducts: [],
  });

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [payments, setPayments] = useState([]);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [expandedOrderHistory, setExpandedOrderHistory] = useState({});

  // New Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    deliveryFee: 350,
    isFreeDelivery: false,
    vatRate: 0,
    category: 'Power Banks',
    brand: 'Anker',
    stock: 15,
    warranty: '1 Year Warranty',
    returnPeriod: '7 Days',
    image: 'https://images.unsplash.com/photo-1618218168350-6e7c81151b64?q=80&w=600',
    description: '',
    rating: 5.0,
    reviews: 1,
    isNew: true,
    discount: 0,
    descriptionImages: [],
    galleryImages: [],
  });

  // Add New Admin Modal State
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [adminSaving, setAdminSaving] = useState(false);
  const [adminAlert, setAdminAlert] = useState(null);

  // Edit Product Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editAlert, setEditAlert] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '185/1/2B New Road, Ambalangoda, Sri Lanka',
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [repRes, ordRes, prodRes, userRes, payRes, adminRes] = await Promise.all([
        fetch('http://127.0.0.1:8080/api/admin/reports/sales'),
        fetch('http://127.0.0.1:8080/api/admin/orders'),
        fetch('http://127.0.0.1:8080/api/products'),
        fetch('http://127.0.0.1:8080/api/admin/users'),
        fetch('http://127.0.0.1:8080/api/admin/payments'),
        fetch('http://127.0.0.1:8080/api/admin/admins'),
      ]);

      if (repRes.ok) {
        const rep = await repRes.json();
        setReportData(rep);
      }
      if (ordRes.ok) {
        const ords = await ordRes.json();
        setOrders(ords);
      }
      if (prodRes.ok) {
        const prods = await prodRes.json();
        setProducts(prods);
      }
      if (userRes.ok) {
        const usrs = await userRes.json();
        setUsersList(usrs);
      }
      if (payRes.ok) {
        const pymts = await payRes.json();
        setPayments(pymts);
      }
      if (adminRes.ok) {
        setAdminsList(await adminRes.json());
      }

      fetch('http://127.0.0.1:8080/api/admin/reviews')
        .then((r) => (r.ok ? r.json() : []))
        .then((revs) => {
          if (Array.isArray(revs)) {
            setPendingReviewsCount(revs.filter((r) => r.status === 'PENDING').length);
          }
        })
        .catch(() => {});
    } catch (e) {
      console.warn('Admin API offline fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus, notes = '') => {
    try {
      const res = await fetch(`http://127.0.0.1:8080/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes, updatedBy: 'ADMIN' }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8080/api/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8080/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAdminRole = async (adminId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8080/api/admin/admins/${adminId}/toggle-role`, { method: 'PUT' });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8080/api/admin/admins/${adminId}`, { method: 'DELETE' });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to add this administrator account?')) return;
    setAdminSaving(true);
    setAdminAlert(null);
    try {
      const res = await fetch('http://127.0.0.1:8080/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newAdmin,
          role: 'ADMIN',
        }),
      });
      if (res.ok) {
        setShowAddAdminModal(false);
        setNewAdmin({
          name: '',
          email: '',
          phone: '',
          password: '',
          address: '185/1/2B New Road, Ambalangoda, Sri Lanka',
        });
        fetchAdminData();
      } else {
        const data = await res.json().catch(() => ({}));
        setAdminAlert(data.message || 'Failed to create administrator.');
      }
    } catch (err) {
      console.error(err);
      setAdminAlert('Server connection error. Please try again.');
    } finally {
      setAdminSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`http://127.0.0.1:8080/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleHighlight = async (productId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8080/api/products/${productId}/highlight`, {
        method: 'PUT',
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      deliveryFee: product.deliveryFee != null ? product.deliveryFee : 350,
      isFreeDelivery: Boolean(product.isFreeDelivery),
      vatRate: product.vatRate != null ? product.vatRate : 0,
      category: product.category || 'Others',
      brand: product.brand || '',
      stock: product.stock ?? 0,
      warranty: product.warranty || '1 Year Warranty',
      returnPeriod: product.returnPeriod || '7 Days',
      image: product.image || '',
      description: product.description || '',
      discount: product.discount || 0,
      rating: product.rating || 5.0,
      reviews: product.reviews || 0,
      isNew: product.isNew || false,
      descriptionImages: product.descriptionImages || [],
      galleryImages: product.galleryImages || [],
    });
    setEditAlert(null);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to save these changes?')) return;
    setEditSaving(true);
    setEditAlert(null);
    try {
      const res = await fetch(`http://127.0.0.1:8080/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingProduct,
          price: parseFloat(editingProduct.price),
          originalPrice: parseFloat(editingProduct.originalPrice || editingProduct.price),
          deliveryFee: editingProduct.isFreeDelivery ? 0 : parseFloat(editingProduct.deliveryFee || 0),
          isFreeDelivery: Boolean(editingProduct.isFreeDelivery),
          vatRate: parseFloat(editingProduct.vatRate || 0),
          stock: parseInt(editingProduct.stock),
          discount: parseInt(editingProduct.discount || 0),
          rating: parseFloat(editingProduct.rating || 5.0),
          reviews: parseInt(editingProduct.reviews || 0),
          isNew: Boolean(editingProduct.isNew),
          descriptionImages: (editingProduct.descriptionImages || []).filter(img => img.trim() !== ''),
          galleryImages: (editingProduct.galleryImages || []).filter(img => img.trim() !== ''),
        }),
      });
      if (res.ok) {
        setShowEditModal(false);
        setEditingProduct(null);
        fetchAdminData();
      } else {
        const data = await res.json().catch(() => ({}));
        setEditAlert(data.message || 'Failed to update product details.');
      }
    } catch (err) {
      console.error(err);
      setEditAlert('Server connection error. Please try again.');
    } finally {
      setEditSaving(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to add this product to the catalog?')) return;
    try {
      const res = await fetch('http://127.0.0.1:8080/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          originalPrice: parseFloat(newProduct.originalPrice || newProduct.price),
          deliveryFee: newProduct.isFreeDelivery ? 0 : parseFloat(newProduct.deliveryFee || 0),
          isFreeDelivery: Boolean(newProduct.isFreeDelivery),
          vatRate: parseFloat(newProduct.vatRate || 0),
          stock: parseInt(newProduct.stock),
          discount: parseInt(newProduct.discount || 0),
          rating: parseFloat(newProduct.rating || 5.0),
          reviews: parseInt(newProduct.reviews || 0),
          isNew: Boolean(newProduct.isNew),
          descriptionImages: (newProduct.descriptionImages || []).filter(img => img.trim() !== ''),
          galleryImages: (newProduct.galleryImages || []).filter(img => img.trim() !== ''),
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewProduct({
          name: '',
          price: '',
          originalPrice: '',
          deliveryFee: 350,
          isFreeDelivery: false,
          vatRate: 0,
          category: 'Power Banks',
          brand: 'Anker',
          stock: 15,
          warranty: '1 Year Warranty',
          image: 'https://images.unsplash.com/photo-1618218168350-6e7c81151b64?q=80&w=600',
          description: '',
          descriptionImages: [],
          galleryImages: [],
        });
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    setShowExportMenu(false);
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Order Number,Customer,Phone,Amount,Status,Payment Method,Date"].join(",") + "\n"
      + orders.map(o => `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.totalAmount}","${o.status}","${o.paymentMethod}","${o.createdAt || ''}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NVSHOP_Sales_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    setShowExportMenu(false);
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Create a new jsPDF document (A4 portrait)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Header Banner Background
    doc.setFillColor(37, 99, 235); // Blue #2563eb
    doc.rect(0, 0, pageWidth, 28, 'F');

    // Header Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('NVSHOP.LK', 14, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(224, 231, 255);
    doc.text('EXECUTIVE BUSINESS & SALES REPORT', 14, 18);
    doc.text(`Official Business Audit • Generated on ${dateStr} at ${timeStr}`, 14, 23);

    // Header Right Meta
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`Admin: ${admin?.name || 'Administrator'}`, pageWidth - 14, 14, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(`Role: ${admin?.role || 'Admin'}`, pageWidth - 14, 19, { align: 'right' });

    // 2. Executive Summary Cards (Metrics)
    const cardY = 35;
    const cardWidth = (pageWidth - 28 - 9) / 4; // 4 cards with 3mm gaps
    const cardHeight = 18;

    const cards = [
      { label: 'TOTAL REVENUE', value: `LKR ${(reportData.totalRevenue || 0).toLocaleString()}`, color: [30, 41, 59] },
      { label: 'TOTAL ORDERS', value: `${reportData.totalOrders || orders.length}`, color: [37, 99, 235] },
      { label: 'DELIVERED', value: `${reportData.completedOrders || 0}`, color: [22, 163, 74] },
      { label: 'CATALOG SIZE', value: `${products.length} Items`, color: [124, 58, 237] }
    ];

    cards.forEach((c, i) => {
      const cx = 14 + i * (cardWidth + 3);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(cx, cardY, cardWidth, cardHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(c.label, cx + 3, cardY + 6);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(c.color[0], c.color[1], c.color[2]);
      doc.text(c.value, cx + 3, cardY + 13);
    });

    // 3. Section Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Customer Orders Statement (${orders.length} Records)`, 14, 60);

    // 4. AutoTable with all customer orders
    const tableColumns = [
      { header: 'Order #', dataKey: 'orderNumber' },
      { header: 'Customer', dataKey: 'customerName' },
      { header: 'Phone', dataKey: 'customerPhone' },
      { header: 'Amount (LKR)', dataKey: 'totalAmount' },
      { header: 'Status', dataKey: 'status' },
      { header: 'Payment', dataKey: 'paymentMethod' },
      { header: 'Date', dataKey: 'date' }
    ];

    const tableRows = orders.map(o => ({
      orderNumber: o.orderNumber || 'N/A',
      customerName: o.customerName || 'Customer',
      customerPhone: o.customerPhone || 'N/A',
      totalAmount: `LKR ${(o.totalAmount || 0).toLocaleString()}`,
      status: o.status || 'PENDING',
      paymentMethod: o.paymentMethod || 'COD',
      date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Recent'
    }));

    autoTable(doc, {
      startY: 64,
      columns: tableColumns,
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontSize: 7.5,
        fontStyle: 'bold',
        halign: 'left',
        cellPadding: 2.5
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [15, 23, 42],
        cellPadding: 2.5
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        orderNumber: { fontStyle: 'bold', textColor: [37, 99, 235], cellWidth: 26 },
        customerName: { fontStyle: 'bold', cellWidth: 34 },
        customerPhone: { cellWidth: 24 },
        totalAmount: { fontStyle: 'bold', halign: 'right', cellWidth: 28 },
        status: { halign: 'center', cellWidth: 22 },
        paymentMethod: { cellWidth: 22 },
        date: { cellWidth: 26 }
      },
      didDrawPage: (data) => {
        // Page footer
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `NVSHOP.LK Management System • Confidential Business Documentation • Page ${data.pageNumber} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 7,
          { align: 'center' }
        );
      }
    });

    // 5. Directly download the PDF file to user device (No new tab)
    doc.save(`NVSHOP_Sales_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleExportWord = () => {
    setShowExportMenu(false);
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const orderRows = orders.map((o, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-family: 'Courier New', monospace; font-weight: bold; color: #2563eb;">${o.orderNumber || 'N/A'}</td>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-weight: bold;">${o.customerName || 'Customer'}</td>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${o.customerPhone || 'N/A'}</td>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-weight: bold;">LKR ${(o.totalAmount || 0).toLocaleString()}</td>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: center;">${o.status || 'PENDING'}</td>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${o.paymentMethod || 'COD'}</td>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Recent'}</td>
      </tr>
    `).join('');

    const wordContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>NVSHOP.LK Sales Report</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; color: #0f172a; padding: 20px; }
          h1 { color: #1e3a8a; font-size: 22pt; margin-bottom: 2pt; }
          h2 { color: #2563eb; font-size: 14pt; margin-top: 0; }
          .meta { font-size: 10pt; color: #475569; margin-bottom: 20pt; }
          .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 25pt; }
          .summary-table td { padding: 10pt; border: 1px solid #94a3b8; background-color: #f1f5f9; }
          .data-table { width: 100%; border-collapse: collapse; font-size: 10pt; }
          .data-table th { background-color: #1e40af; color: #ffffff; padding: 8pt; border: 1px solid #1e3a8a; text-align: left; }
          .data-table td { padding: 6pt 8pt; border: 1px solid #cbd5e1; }
        </style>
      </head>
      <body>
        <h1>NVSHOP.LK Business Summary Report</h1>
        <h2>Executive Sales, Financial & Order Report</h2>
        <div class="meta">
          <strong>Generated Date:</strong> ${dateStr} at ${timeStr}<br/>
          <strong>Generated By:</strong> ${admin?.name || 'Administrator'} (${admin?.email || ''})<br/>
          <strong>System:</strong> NVSHOP.LK Official Management Console
        </div>

        <table class="summary-table">
          <tr>
            <td>
              <strong style="color: #64748b; font-size: 9pt; text-transform: uppercase;">Total Sales Revenue</strong><br/>
              <span style="font-size: 16pt; font-weight: bold; color: #0f172a;">LKR ${(reportData.totalRevenue || 0).toLocaleString()}</span>
            </td>
            <td>
              <strong style="color: #64748b; font-size: 9pt; text-transform: uppercase;">Total Orders</strong><br/>
              <span style="font-size: 16pt; font-weight: bold; color: #0f172a;">${reportData.totalOrders || orders.length} Orders</span>
            </td>
            <td>
              <strong style="color: #64748b; font-size: 9pt; text-transform: uppercase;">Delivered Orders</strong><br/>
              <span style="font-size: 16pt; font-weight: bold; color: #16a34a;">${reportData.completedOrders || 0} Delivered</span>
            </td>
            <td>
              <strong style="color: #64748b; font-size: 9pt; text-transform: uppercase;">Product Catalog</strong><br/>
              <span style="font-size: 16pt; font-weight: bold; color: #0f172a;">${products.length} Products</span>
            </td>
          </tr>
        </table>

        <h3 style="color: #0f172a; font-size: 12pt; margin-bottom: 8pt;">Orders Log Details</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Contact Phone</th>
              <th>Amount</th>
              <th>Order Status</th>
              <th>Payment Method</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${orderRows}
          </tbody>
        </table>
        <br/>
        <p style="font-size: 9pt; color: #94a3b8; text-align: center;">End of Report • NVSHOP.LK Confidential Business Documentation</p>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + wordContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NVSHOP_Executive_Report_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard & Reports', icon: Activity },
    { id: 'stock', label: 'Stock Management', icon: Warehouse },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'highlights', label: 'Weekly Highlights', icon: Star },
    { id: 'products', label: `Products (${products.length})`, icon: Package },
    { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
    { id: 'reviews', label: pendingReviewsCount > 0 ? `Reviews (${pendingReviewsCount} Pending)` : 'Reviews & Ratings', icon: MessageSquare },
    { id: 'users', label: `Users (${usersList.length})`, icon: Users },
    { id: 'admins', label: `Admins (${adminsList.length})`, icon: ShieldCheck },
    { id: 'payments', label: `Transactions (${payments.length})`, icon: CreditCard },
    { id: 'customize', label: 'Customize Home', icon: ImageIcon },
    { id: 'shop', label: 'Store & AI Knowledge', icon: Store },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Drawer Backdrop */}
      {isMobileNavOpen && (
        <div 
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar - Desktop static & Mobile slide-over drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        isMobileNavOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <img 
            src="/logo.png" 
            alt="NVSHOP.LK" 
            className="h-9 w-auto object-contain" 
          />
          <button 
            onClick={() => setIsMobileNavOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
                activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-5 h-5 flex-shrink-0" /> {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{admin?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500 truncate">{admin?.email}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors text-xs">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="NVSHOP.LK" 
                className="h-8 sm:h-9 w-auto object-contain" 
              />
              <span className="hidden sm:inline-block h-5 w-[1px] bg-slate-200"></span>
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-800 truncate">
                {tabs.find(t => t.id === activeTab)?.label || 'Admin Control Panel'}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">{admin?.role || 'Administrator'}</span>
              <span className="sm:hidden">Admin</span>
            </div>
          </div>
        </header>

        {/* Read-Only Mobile Notice Banner */}
        <div className="md:hidden bg-amber-500/10 border-b border-amber-200/60 px-4 py-2.5 flex items-center gap-2.5 text-amber-800 text-xs font-semibold">
          <Smartphone className="w-4 h-4 flex-shrink-0 text-amber-600" />
          <span className="flex-1">
            Mobile Overview: CRUD & editing actions are restricted to desktop view.
          </span>
        </div>

        <div className="py-6 sm:py-10 px-4 sm:px-6 flex-1">
          <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <span className="text-blue-600 font-bold text-xs tracking-widest uppercase">NVSHOP.LK ADMIN</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Management Console</h1>
              <p className="text-slate-500 text-xs sm:text-sm">Control inventory, process customer orders, view revenue analytics & user accounts.</p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center w-full sm:w-auto">
              <button onClick={fetchAdminData} className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>

              {/* Export Dropdown Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)} 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-95"
                >
                  <Download className="w-4 h-4" /> Export Report <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
                </button>

                {showExportMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setShowExportMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Choose Export Format
                      </div>

                      <button 
                        onClick={handleExportPDF}
                        className="w-full px-3.5 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2.5 transition-colors"
                      >
                        <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div>Download as PDF</div>
                          <span className="text-[10px] font-normal text-slate-400 block">Printable clean document</span>
                        </div>
                      </button>

                      <button 
                        onClick={handleExportWord}
                        className="w-full px-3.5 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors"
                      >
                        <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div>Download as Word (.doc)</div>
                          <span className="text-[10px] font-normal text-slate-400 block">Editable Microsoft Word format</span>
                        </div>
                      </button>

                      <button 
                        onClick={handleExportCSV}
                        className="w-full px-3.5 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5 transition-colors"
                      >
                        <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                          <Download className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div>Export as CSV (Excel)</div>
                          <span className="text-[10px] font-normal text-slate-400 block">Spreadsheet data file</span>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Low Stock Alert Banner (FR2.6) */}
          {reportData.lowStockCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">Low Stock Alert (FR2.6)</h4>
                  <p className="text-xs text-amber-700">{reportData.lowStockCount} products are below the safety threshold (≤ 5 units remaining).</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('products')}
                className="px-3.5 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-all"
              >
                Review Stock
              </button>
            </div>
          )}



          {/* Tab 1: Dashboard & Reports (FR2.7) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales Revenue</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">LKR {(reportData.totalRevenue || 0).toLocaleString()}</h3>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">↑ Verified Payments</p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">{reportData.totalOrders || orders.length}</h3>
                  <p className="text-[11px] text-blue-600 font-bold mt-1">{reportData.completedOrders || 0} Delivered</p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catalog Size</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">{products.length} Items</h3>
                  <p className="text-[11px] text-purple-600 font-bold mt-1">11 Official Categories</p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Accounts</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">{usersList.length} Users</h3>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">Active Accounts</p>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-900">Recent Customer Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-blue-600 hover:text-blue-700">View All Orders →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                        <th className="pb-3">Order #</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/60">
                          <td className="py-3 font-bold text-blue-600 font-mono">{o.orderNumber}</td>
                          <td className="py-3 font-semibold text-slate-800">{o.customerName}</td>
                          <td className="py-3 font-black text-slate-900">LKR {o.totalAmount?.toLocaleString()}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              o.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                              o.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 text-slate-500 font-semibold">{o.paymentMethod}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Weekly Highlights */}
          {activeTab === 'highlights' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Weekly Highlights</h3>
                  <p className="text-xs text-slate-500">Manage the products featured on the customer homepage.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Item</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3 text-right">Highlight Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((prod) => (
                      <tr key={prod.id} className={`hover:bg-slate-50/60 transition-colors ${prod.isWeeklyHighlight ? 'bg-amber-50/30' : ''}`}>
                        <td className="py-3 flex items-center gap-3">
                          <img src={prod.image} alt={prod.name} className="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-slate-100" />
                          <span className={`font-bold line-clamp-1 max-w-xs ${prod.isWeeklyHighlight ? 'text-amber-900' : 'text-slate-900'}`}>{prod.name}</span>
                        </td>
                        <td className="py-3 text-slate-600 font-medium">{prod.category}</td>
                        <td className="py-3 font-black text-slate-900">LKR {prod.price?.toLocaleString()}</td>
                        <td className="py-3 text-right">
                          {/* Desktop: Action Button */}
                          <button
                            onClick={() => handleToggleHighlight(prod.id)}
                            className={`hidden md:inline-flex px-3 py-1.5 rounded-lg transition-colors font-bold text-xs items-center justify-end ml-auto gap-1.5 ${prod.isWeeklyHighlight ? 'text-amber-700 bg-amber-100 hover:bg-amber-200' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`}
                          >
                            <Star className={`w-3.5 h-3.5 ${prod.isWeeklyHighlight ? 'fill-amber-600 text-amber-600' : ''}`} />
                            {prod.isWeeklyHighlight ? 'Highlighted' : 'Set as Highlight'}
                          </button>
                          {/* Mobile: Read-Only Badge */}
                          <span className={`md:hidden px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            prod.isWeeklyHighlight ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {prod.isWeeklyHighlight ? '★ Featured' : 'Standard'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Products Management (FR2.2) */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-base">Catalog & Stock ({products.length} Products)</h3>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="hidden md:flex px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Item</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Brand</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Stock Units</th>
                      <th className="pb-3 text-right hidden md:table-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/60">
                        <td className="py-3 flex items-center gap-3">
                          <img src={prod.image} alt={prod.name} className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100" />
                          <span className="font-bold text-slate-900 line-clamp-1 max-w-xs">{prod.name}</span>
                        </td>
                        <td className="py-3 text-slate-600 font-medium">{prod.category}</td>
                        <td className="py-3 font-semibold text-slate-800">{prod.brand}</td>
                        <td className="py-3 font-black text-slate-900">LKR {prod.price?.toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            prod.stock <= 5 ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {prod.stock} left {prod.stock <= 5 ? '⚠️ Low' : ''}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-1 hidden md:table-cell">
                          <button
                            onClick={() => handleToggleHighlight(prod.id)}
                            className={`p-1.5 rounded-lg transition-colors ${prod.isWeeklyHighlight ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:bg-slate-100'}`}
                            title={prod.isWeeklyHighlight ? 'Remove Weekly Highlight' : 'Set as Weekly Highlight'}
                          >
                            <Star className={`w-4 h-4 ${prod.isWeeklyHighlight ? 'fill-amber-500' : ''}`} />
                          </button>
                          <button 
                            onClick={() => handleEditClick(prod)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Product Details"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Orders Management (FR2.4) */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Header and Stats */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">Customer Orders & Live Status Control</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Track and progress orders: New orders start with an empty tracking line until you click <strong>Placed</strong>, then advance through <strong>Processing</strong>, <strong>Shipped</strong>, and <strong>Delivered</strong>.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={fetchAdminData}
                      className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-blue-600" /> Refresh
                    </button>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs font-bold">
                  {[
                    { id: 'ALL', label: 'All Orders', count: orders.length, color: 'bg-slate-900 text-white' },
                    { id: 'PENDING', label: 'Awaiting Notice (New)', count: orders.filter(o => o.status === 'PENDING').length, color: 'bg-amber-500 text-white' },
                    { id: 'PLACED', label: 'Placed', count: orders.filter(o => o.status === 'PLACED').length, color: 'bg-blue-600 text-white' },
                    { id: 'PROCESSING', label: 'Processing', count: orders.filter(o => o.status === 'PROCESSING').length, color: 'bg-indigo-600 text-white' },
                    { id: 'SHIPPED', label: 'Shipped (In Transit)', count: orders.filter(o => o.status === 'SHIPPED').length, color: 'bg-purple-600 text-white' },
                    { id: 'DELIVERED', label: 'Delivered', count: orders.filter(o => o.status === 'DELIVERED').length, color: 'bg-emerald-600 text-white' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setOrderFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
                        orderFilter === tab.id
                          ? tab.color + ' shadow-sm'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${orderFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-700'}`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List Cards */}
              <div className="space-y-5">
                {orders
                  .filter(o => orderFilter === 'ALL' || o.status === orderFilter)
                  .map((o) => {
                    const isPending = !o.status || o.status === 'PENDING';
                    const isPlaced = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status);
                    const isProcessing = ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status);
                    const isShipped = ['SHIPPED', 'DELIVERED'].includes(o.status);
                    const isDelivered = o.status === 'DELIVERED';
                    const isCancelled = o.status === 'CANCELLED';

                    return (
                      <div
                        key={o.id}
                        className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-5"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="text-base sm:text-lg font-black text-slate-900 font-mono tracking-tight">{o.orderNumber}</span>
                              <span
                                className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                                  isDelivered ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  isShipped ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                  isProcessing ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                  isPlaced ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  isCancelled ? 'bg-red-50 text-red-700 border-red-200' :
                                  'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                                }`}
                              >
                                {isPending ? 'AWAITING NOTICE (NEW)' : o.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              Customer: <strong>{o.customerName}</strong> ({o.customerPhone}) • {o.userEmail}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Shipping Address: {o.shippingAddress}, {o.city}
                            </p>
                          </div>

                          <div className="sm:text-right">
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Amount</p>
                            <p className="text-lg sm:text-xl font-black text-blue-600 font-mono">
                              LKR {(o.totalAmount || 0).toLocaleString()}
                            </p>
                            <div className="text-[11px] text-slate-600 font-medium mt-1 bg-slate-100/70 p-2 rounded-xl border border-slate-200/60 inline-block text-left sm:text-right">
                              <p className="flex justify-between sm:justify-end gap-3 text-slate-500">
                                <span>Subtotal:</span>
                                <strong className="text-slate-800 font-mono">LKR {(o.subtotal || 0).toLocaleString()}</strong>
                              </p>
                              <p className="flex justify-between sm:justify-end gap-3 text-slate-500">
                                <span>VAT / Tax:</span>
                                <strong className="text-blue-700 font-mono">LKR {(o.tax || 0).toLocaleString()}</strong>
                              </p>
                              <p className="flex justify-between sm:justify-end gap-3 text-slate-500">
                                <span>Delivery Fee:</span>
                                <strong className={(o.shippingCost || 0) === 0 ? "text-emerald-700 font-bold" : "text-slate-800 font-mono"}>
                                  {(o.shippingCost || 0) === 0 ? 'FREE' : `LKR ${(o.shippingCost || 0).toLocaleString()}`}
                                </strong>
                              </p>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium mt-1">
                              Payment: {o.paymentMethod || 'COD'} ({o.paymentStatus || 'PENDING'})
                            </p>
                          </div>
                        </div>

                        {/* Live Tracking Timeline */}
                        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold">
                            <span className="text-slate-800 flex items-center gap-1.5">
                              <Truck className="w-4 h-4 text-blue-600" />
                              Live Tracking Status:
                              <span className="text-blue-700 font-black ml-1">
                                {isPending ? 'Empty – Awaiting Store Confirmation' :
                                 o.status === 'PLACED' ? '1. Placed by Store' :
                                 o.status === 'PROCESSING' ? '2. Processing & Packaging' :
                                 o.status === 'SHIPPED' ? '3. Handed to Courier (In Transit)' :
                                 o.status === 'DELIVERED' ? '4. Delivered to Customer' :
                                 o.status}
                              </span>
                            </span>
                            {isPending && (
                              <span className="text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-md text-[11px] font-bold w-fit">
                                Action Required: Click 'Mark Placed' to start customer tracking
                              </span>
                            )}
                          </div>

                          {/* 4 Step Nodes */}
                          <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs font-bold pt-2">
                            <div>
                              <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs mb-1.5 transition-all shadow-2xs ${
                                isPlaced ? 'bg-blue-600 text-white font-black' : 'bg-slate-200 text-slate-500'
                              }`}>
                                {isPlaced ? '✓' : '1'}
                              </div>
                              <span className={isPlaced ? 'text-blue-700 font-black' : 'text-slate-400'}>1. Placed</span>
                            </div>

                            <div>
                              <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs mb-1.5 transition-all shadow-2xs ${
                                isProcessing ? 'bg-indigo-600 text-white font-black' : 'bg-slate-200 text-slate-500'
                              }`}>
                                {isProcessing ? '✓' : '2'}
                              </div>
                              <span className={isProcessing ? 'text-indigo-700 font-black' : 'text-slate-400'}>2. Processing</span>
                            </div>

                            <div>
                              <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs mb-1.5 transition-all shadow-2xs ${
                                isShipped ? 'bg-purple-600 text-white font-black' : 'bg-slate-200 text-slate-500'
                              }`}>
                                {isShipped ? '✓' : '3'}
                              </div>
                              <span className={isShipped ? 'text-purple-700 font-black' : 'text-slate-400'}>3. Shipped</span>
                            </div>

                            <div>
                              <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs mb-1.5 transition-all shadow-2xs ${
                                isDelivered ? 'bg-emerald-600 text-white font-black' : 'bg-slate-200 text-slate-500'
                              }`}>
                                {isDelivered ? '✓' : '4'}
                              </div>
                              <span className={isDelivered ? 'text-emerald-700 font-black' : 'text-slate-400'}>4. Delivered</span>
                            </div>
                          </div>

                          {/* Progress bar line */}
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isDelivered ? 'w-full bg-emerald-600' :
                                isShipped ? 'w-3/4 bg-purple-600' :
                                isProcessing ? 'w-1/2 bg-indigo-600' :
                                isPlaced ? 'w-1/4 bg-blue-600' : 'w-0'
                              }`}
                            />
                          </div>

                          {/* Admin Action Buttons */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Advance Order State:</span>
                              {isPending && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(o.id, 'PLACED', 'Order noticed and officially confirmed by Admin')}
                                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                                >
                                  <Check className="w-3.5 h-3.5" /> Mark Placed
                                </button>
                              )}
                              {o.status === 'PLACED' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(o.id, 'PROCESSING', 'Order moved to packaging and processing')}
                                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                                >
                                  <Package className="w-3.5 h-3.5" /> Mark Processing
                                </button>
                              )}
                              {o.status === 'PROCESSING' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(o.id, 'SHIPPED', 'Order handed over to courier for islandwide delivery')}
                                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                                >
                                  <Truck className="w-3.5 h-3.5" /> Mark Shipped (Courier)
                                </button>
                              )}
                              {o.status === 'SHIPPED' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(o.id, 'DELIVERED', 'Order confirmed delivered to destination')}
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                                >
                                  <Check className="w-3.5 h-3.5" /> Mark Delivered
                                </button>
                              )}
                              {isDelivered && (
                                <span className="text-emerald-700 bg-emerald-100 font-bold text-xs px-3 py-1 rounded-xl flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> Order Completed & Delivered
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-400 font-bold">Manual Status:</span>
                              <select
                                value={o.status || 'PENDING'}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value, `Status manually set to ${e.target.value}`)}
                                className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-600"
                              >
                                <option value="PENDING">PENDING (Awaiting Notice)</option>
                                <option value="PLACED">PLACED</option>
                                <option value="PROCESSING">PROCESSING</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Order Items with Live State */}
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                            <span>Order Items ({o.items?.length || 0})</span>
                            <span className="text-[11px] font-medium text-slate-500">Live Item State: <strong className="text-slate-800">{o.status || 'PENDING'}</strong></span>
                          </h4>
                          <div className="divide-y divide-slate-100 bg-slate-50/50 rounded-2xl p-2 sm:p-3 border border-slate-100">
                            {(o.items || []).map((item, itemIdx) => (
                              <div key={item.id || itemIdx} className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  {item.productImage ? (
                                    <img
                                      src={item.productImage}
                                      alt={item.productName}
                                      className="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-slate-100 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 border border-slate-100">
                                      <Package className="w-5 h-5" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">{item.productName}</p>
                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                                      <span>Qty: <strong>{item.quantity}</strong> × LKR {(item.price || 0).toLocaleString()}</span>
                                      {item.warrantyPeriod && (
                                        <>
                                          <span>•</span>
                                          <span className="text-[11px] text-blue-600 font-semibold">{item.warrantyPeriod}</span>
                                        </>
                                      )}
                                    </div>
                                    <div className="mt-1">
                                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                        isDelivered ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                        isShipped ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                        isProcessing ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                        isPlaced ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        'bg-amber-50 text-amber-700 border-amber-200'
                                      }`}>
                                        Live Status: {o.status || 'PENDING'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <span className="font-black text-xs sm:text-sm text-slate-900 font-mono shrink-0">
                                  LKR {(item.subtotal || 0).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Audit Trail History Accordion */}
                        {o.statusHistory && o.statusHistory.length > 0 && (
                          <div className="pt-2 border-t border-slate-100">
                            <button
                              onClick={() => setExpandedOrderHistory(prev => ({ ...prev, [o.id]: !prev[o.id] }))}
                              className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                            >
                              <span>Database Tracking History ({o.statusHistory.length} events logged)</span>
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedOrderHistory[o.id] ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedOrderHistory[o.id] && (
                              <div className="mt-2.5 space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                                {o.statusHistory.map((hist, hIdx) => (
                                  <div key={hist.id || hIdx} className="flex items-start justify-between gap-3 text-slate-600 pb-1.5 last:pb-0 border-b last:border-0 border-slate-200">
                                    <div>
                                      <span className="font-black text-[10px] uppercase px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 mr-2">
                                        {hist.status}
                                      </span>
                                      <span className="font-medium text-slate-700">{hist.notes || 'Status updated'}</span>
                                      <span className="text-[10px] text-slate-400 ml-1.5">by {hist.updatedBy || 'ADMIN'}</span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-mono shrink-0">
                                      {hist.createdAt ? new Date(hist.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : ''}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Tab 4: Customer & Administrator Accounts (FR2.8) */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">User Management</h3>
                  <p className="text-xs text-slate-500">Manage customer accounts and statuses.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">User ID</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email & Phone</th>
                      <th className="pb-3">Account Status</th>
                      <th className="pb-3 text-right hidden md:table-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((usr) => {
                      const isAdmin = usr.role === 'admin' || usr.email?.toLowerCase().includes('admin');
                      return (
                        <tr key={usr.id} className="hover:bg-slate-50/60">
                          <td className="py-3.5 font-mono text-slate-400">#{usr.id}</td>
                          <td className="py-3.5 font-bold text-slate-900">{usr.name}</td>
                          <td className="py-3.5 text-slate-600">
                            <div>{usr.email}</div>
                            {usr.phone && <div className="text-[11px] text-slate-400 font-mono">{usr.phone}</div>}
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                              usr.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {usr.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="py-3.5 text-right space-x-2 hidden md:table-cell">
                            <button
                              onClick={() => handleToggleUserStatus(usr.id)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-[10px] inline-flex items-center gap-1 transition-all ${
                                usr.isActive
                                  ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {usr.isActive ? <Ban className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                              {usr.isActive ? 'Disable' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(usr.id)}
                              className="px-3 py-1.5 rounded-xl font-bold text-[10px] inline-flex items-center gap-1 transition-all bg-red-50 text-red-700 hover:bg-red-100"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Admins Table */}
          {activeTab === 'admins' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Administrators</h3>
                  <p className="text-xs text-slate-500">Manage system administrators and super admins.</p>
                </div>
                <button
                  onClick={() => {
                    setAdminAlert(null);
                    setShowAddAdminModal(true);
                  }}
                  className="hidden md:flex px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs items-center gap-2 shadow-md shadow-purple-500/20 transition-all active:scale-95"
                >
                  <UserPlus className="w-4 h-4" /> Add New Administrator
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Admin ID</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3 text-right hidden md:table-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adminsList.map((adm) => {
                      const isSuper = adm.role === 'SUPER_ADMIN';
                      return (
                        <tr key={adm.id} className="hover:bg-slate-50/60">
                          <td className="py-3.5 font-mono text-slate-400">#{adm.id}</td>
                          <td className="py-3.5 font-bold text-slate-900">{adm.name}</td>
                          <td className="py-3.5 text-slate-600">{adm.email}</td>
                          <td className="py-3.5">
                            {isSuper ? (
                              <span className="px-2.5 py-1 rounded-full font-extrabold text-[10px] bg-purple-100 text-purple-800 border border-purple-200 inline-flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-purple-600" /> SUPER ADMIN
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-blue-100 text-blue-800 border border-blue-200 inline-flex items-center gap-1">
                                <Shield className="w-3 h-3 text-blue-600" /> ADMIN
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 text-right space-x-2 hidden md:table-cell">
                            {admin?.role === 'SUPER_ADMIN' && admin?.id !== adm.id && (
                              <>
                                <button
                                  onClick={() => handleToggleAdminRole(adm.id)}
                                  className={`px-3 py-1.5 rounded-xl font-bold text-[10px] inline-flex items-center gap-1 transition-all ${
                                    isSuper
                                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                                  }`}
                                >
                                  <Shield className="w-3 h-3" />
                                  {isSuper ? 'Demote to Admin' : 'Make Super Admin'}
                                </button>
                                <button
                                  onClick={() => handleDeleteAdmin(adm.id)}
                                  className="px-3 py-1.5 rounded-xl font-bold text-[10px] inline-flex items-center gap-1 transition-all bg-red-50 text-red-700 hover:bg-red-100"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 5: Payment Transactions (FR3.3) */}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 text-base">Payment Gateway Transactions Log (FR3.3)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Txn Reference</th>
                      <th className="pb-3">Order Number</th>
                      <th className="pb-3">Customer Email</th>
                      <th className="pb-3">Gateway</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60">
                        <td className="py-3 font-mono font-bold text-slate-900">{p.transactionReference}</td>
                        <td className="py-3 font-mono text-blue-600 font-bold">{p.orderNumber}</td>
                        <td className="py-3 text-slate-600">{p.userEmail}</td>
                        <td className="py-3 font-bold text-slate-700">{p.paymentGateway}</td>
                        <td className="py-3 font-black text-slate-900">LKR {p.amount?.toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            p.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                            p.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Product Modal (FR2.2) */}
          {showAddModal && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-6xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[95vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-black text-lg text-slate-900">Add New Official Product</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left: Add Form */}
                  <div className="flex-1">
                    <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                    <input 
                      type="text" required 
                      value={newProduct.name} 
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="e.g. Anker Soundcore Life Q35 Headphones"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Price (LKR)</label>
                      <input 
                        type="number" required 
                        value={newProduct.price} 
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        placeholder="24500"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Original Price</label>
                      <input 
                        type="number" 
                        value={newProduct.originalPrice} 
                        onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                        placeholder="28000"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Stock</label>
                      <input 
                        type="number" required 
                        value={newProduct.stock} 
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        placeholder="15"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Discount %</label>
                      <input 
                        type="number" 
                        value={newProduct.discount} 
                        onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Rating</label>
                      <input 
                        type="number" step="0.1" max="5" 
                        value={newProduct.rating} 
                        onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Reviews</label>
                      <input 
                        type="number" 
                        value={newProduct.reviews} 
                        onChange={(e) => setNewProduct({ ...newProduct, reviews: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div className="flex items-center mt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={newProduct.isNew}
                          onChange={(e) => setNewProduct({ ...newProduct, isNew: e.target.checked })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="font-bold text-slate-700">New Arrival</span>
                      </label>
                    </div>
                  </div>

                  {/* Delivery Charges & Tax (VAT) Settings */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-blue-600" /> Delivery Charges & Tax (VAT)
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                        <input 
                          type="checkbox" 
                          checked={newProduct.isFreeDelivery}
                          onChange={(e) => {
                            const isFree = e.target.checked;
                            setNewProduct({
                              ...newProduct,
                              isFreeDelivery: isFree,
                              deliveryFee: isFree ? 0 : (newProduct.deliveryFee || 350)
                            });
                          }}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <span className="font-bold text-emerald-700 text-xs">Free Delivery</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Delivery Charge (LKR)
                        </label>
                        <input 
                          type="number" 
                          min="0"
                          disabled={newProduct.isFreeDelivery}
                          value={newProduct.isFreeDelivery ? 0 : newProduct.deliveryFee} 
                          onChange={(e) => setNewProduct({ ...newProduct, deliveryFee: e.target.value })}
                          placeholder="350"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 disabled:bg-slate-100 disabled:text-slate-400 font-bold"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">
                          {newProduct.isFreeDelivery ? 'Free delivery is enabled (0 LKR)' : 'Standard islandwide courier fee'}
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          VAT / Tax Percentage (%)
                        </label>
                        <input 
                          type="number" 
                          step="0.1"
                          min="0"
                          max="100"
                          value={newProduct.vatRate} 
                          onChange={(e) => setNewProduct({ ...newProduct, vatRate: e.target.value })}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-bold"
                        />
                        <span className="text-[10px] text-blue-600 font-semibold">
                          Calculated VAT: LKR {Math.round(((parseFloat(newProduct.price) || 0) * (parseFloat(newProduct.vatRate) || 0)) / 100).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category</label>
                      <select 
                        value={newProduct.category} 
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white"
                      >
                        <option>Apple iPhone</option>
                        <option>Earphones & Headsets</option>
                        <option>Power Banks</option>
                        <option>Speakers</option>
                        <option>Chargers & Cables & Adapters</option>
                        <option>Phone Cases & Back Covers</option>
                        <option>Screen Protectors</option>
                        <option>Smart Watches</option>
                        <option>Mouse & Keyboards</option>
                        <option>Pendrives & SD Cards</option>
                        <option>Others</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Brand</label>
                      <input 
                        type="text" required 
                        value={newProduct.brand} 
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                        placeholder="Anker, UGREEN, Apple"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Main Image URL</label>
                    <input 
                      type="url" required 
                      value={newProduct.image} 
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700 mb-1">Additional Gallery Images (Up to 5)</label>
                    {[0, 1, 2, 3, 4].map(idx => (
                      <input 
                        key={`new-gallery-${idx}`}
                        type="url"
                        placeholder={`Gallery Image URL ${idx + 1}`}
                        value={(newProduct.galleryImages && newProduct.galleryImages[idx]) || ''}
                        onChange={(e) => {
                          const newGals = [...(newProduct.galleryImages || [])];
                          newGals[idx] = e.target.value;
                          setNewProduct({ ...newProduct, galleryImages: newGals });
                        }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-mono text-[11px]"
                      />
                    ))}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                    <textarea 
                      rows={6}
                      required
                      placeholder={"Enter paragraph text here.\nUse '-' at the start of a line to create bullet points.\nUse 'Key Features:' to create a section header."}
                      value={newProduct.description || ''} 
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-medium resize-y"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700 mb-1">Description Images (Up to 5)</label>
                    {[0, 1, 2, 3, 4].map(idx => (
                      <input 
                        key={`new-descimg-${idx}`}
                        type="url"
                        placeholder={`Description Image URL ${idx + 1}`}
                        value={(newProduct.descriptionImages && newProduct.descriptionImages[idx]) || ''}
                        onChange={(e) => {
                          const newDescImgs = [...(newProduct.descriptionImages || [])];
                          newDescImgs[idx] = e.target.value;
                          setNewProduct({ ...newProduct, descriptionImages: newDescImgs });
                        }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-mono text-[11px]"
                      />
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                    <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20">Save Product</button>
                  </div>
                    </form>
                  </div>
                  
                  {/* Right: Live Preview */}
                  <div className="w-full lg:w-[320px] bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-start h-max sticky top-6">
                    <p className="text-[10px] font-bold text-blue-600 mb-4 uppercase tracking-widest text-center">Live Preview</p>
                    <AdminProductPreview product={newProduct} label="PREVIEW" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Product Modal (FR2.2) */}
          {showEditModal && editingProduct && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-6xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                      <Pencil className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900 leading-tight">Edit Product Details</h3>
                      <p className="text-[11px] text-slate-500 font-medium">Modify inventory specs, pricing (LKR), or stock levels</p>
                    </div>
                  </div>
                  <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>

                {editAlert && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-semibold">
                    {editAlert}
                  </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left: Edit Form */}
                  <div className="flex-1">
                    <form onSubmit={handleUpdateProduct} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                    <input 
                      type="text" required 
                      value={editingProduct.name} 
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Price (LKR)</label>
                      <input 
                        type="number" required 
                        value={editingProduct.price} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Original Price</label>
                      <input 
                        type="number" 
                        value={editingProduct.originalPrice} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Stock</label>
                      <input 
                        type="number" required 
                        value={editingProduct.stock} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Discount %</label>
                      <input 
                        type="number" 
                        value={editingProduct.discount} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, discount: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Rating</label>
                      <input 
                        type="number" step="0.1" max="5" 
                        value={editingProduct.rating} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, rating: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Reviews</label>
                      <input 
                        type="number" 
                        value={editingProduct.reviews} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, reviews: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-bold"
                      />
                    </div>
                    <div className="flex items-center mt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={editingProduct.isNew}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="font-bold text-slate-700">New Arrival</span>
                      </label>
                    </div>
                  </div>

                  {/* Delivery Charges & Tax (VAT) Settings */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-blue-600" /> Delivery Charges & Tax (VAT)
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                        <input 
                          type="checkbox" 
                          checked={editingProduct.isFreeDelivery}
                          onChange={(e) => {
                            const isFree = e.target.checked;
                            setEditingProduct({
                              ...editingProduct,
                              isFreeDelivery: isFree,
                              deliveryFee: isFree ? 0 : (editingProduct.deliveryFee || 350)
                            });
                          }}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <span className="font-bold text-emerald-700 text-xs">Free Delivery</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Delivery Charge (LKR)
                        </label>
                        <input 
                          type="number" 
                          min="0"
                          disabled={editingProduct.isFreeDelivery}
                          value={editingProduct.isFreeDelivery ? 0 : editingProduct.deliveryFee} 
                          onChange={(e) => setEditingProduct({ ...editingProduct, deliveryFee: e.target.value })}
                          placeholder="350"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 disabled:bg-slate-100 disabled:text-slate-400 font-bold"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">
                          {editingProduct.isFreeDelivery ? 'Free delivery is enabled (0 LKR)' : 'Standard islandwide courier fee'}
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          VAT / Tax Percentage (%)
                        </label>
                        <input 
                          type="number" 
                          step="0.1"
                          min="0"
                          max="100"
                          value={editingProduct.vatRate} 
                          onChange={(e) => setEditingProduct({ ...editingProduct, vatRate: e.target.value })}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-bold"
                        />
                        <span className="text-[10px] text-blue-600 font-semibold">
                          Calculated VAT: LKR {Math.round(((parseFloat(editingProduct.price) || 0) * (parseFloat(editingProduct.vatRate) || 0)) / 100).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category</label>
                      <select 
                        value={editingProduct.category} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white text-slate-900 font-medium"
                      >
                        <option>Apple iPhone</option>
                        <option>Earphones & Headsets</option>
                        <option>Power Banks</option>
                        <option>Speakers</option>
                        <option>Chargers & Cables & Adapters</option>
                        <option>Phone Cases & Back Covers</option>
                        <option>Screen Protectors</option>
                        <option>Smart Watches</option>
                        <option>Mouse & Keyboards</option>
                        <option>Pendrives & SD Cards</option>
                        <option>Others</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Brand</label>
                      <input 
                        type="text" required 
                        value={editingProduct.brand} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Main Image URL</label>
                    <input 
                      type="url" required 
                      value={editingProduct.image} 
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700 mb-1">Additional Gallery Images (Up to 5)</label>
                    {[0, 1, 2, 3, 4].map(idx => (
                      <input 
                        key={`edit-gallery-${idx}`}
                        type="url"
                        placeholder={`Gallery Image URL ${idx + 1}`}
                        value={(editingProduct.galleryImages && editingProduct.galleryImages[idx]) || ''}
                        onChange={(e) => {
                          const newGals = [...(editingProduct.galleryImages || [])];
                          newGals[idx] = e.target.value;
                          setEditingProduct({ ...editingProduct, galleryImages: newGals });
                        }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-mono text-[11px]"
                      />
                    ))}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                    <textarea 
                      rows={6}
                      required
                      placeholder={"Enter paragraph text here.\nUse '-' at the start of a line to create bullet points.\nUse 'Key Features:' to create a section header."}
                      value={editingProduct.description} 
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-medium resize-y"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700 mb-1">Description Images (Up to 5)</label>
                    {[0, 1, 2, 3, 4].map(idx => (
                      <input 
                        key={`edit-descimg-${idx}`}
                        type="url"
                        placeholder={`Description Image URL ${idx + 1}`}
                        value={(editingProduct.descriptionImages && editingProduct.descriptionImages[idx]) || ''}
                        onChange={(e) => {
                          const newDescImgs = [...(editingProduct.descriptionImages || [])];
                          newDescImgs[idx] = e.target.value;
                          setEditingProduct({ ...editingProduct, descriptionImages: newDescImgs });
                        }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-mono text-[11px]"
                      />
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowEditModal(false)} 
                      className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={editSaving}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-blue-500/20"
                    >
                      {editSaving ? 'Updating...' : 'Save Changes'}
                    </button>
                  </div>
                    </form>
                  </div>

                  {/* Right: Live Preview */}
                  <div className="w-full lg:w-[620px] bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-6 items-start justify-start h-max sticky top-6">
                    <div className="flex-1 w-full flex flex-col items-center">
                      <p className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-widest text-center">Before (Current)</p>
                      <AdminProductPreview product={products.find(p => p.id === editingProduct.id) || editingProduct} label="BEFORE" />
                    </div>
                    <div className="hidden md:flex items-center text-slate-300 self-center">
                      <ArrowRight className="w-8 h-8" />
                    </div>
                    <div className="flex-1 w-full flex flex-col items-center">
                      <p className="text-[10px] font-bold text-blue-600 mb-4 uppercase tracking-widest text-center">Live Preview</p>
                      <AdminProductPreview product={editingProduct} label="AFTER" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add New Administrator Modal (FR2.8) */}
          {showAddAdminModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900 leading-tight">Add Administrator</h3>
                      <p className="text-[11px] text-slate-500 font-medium">Create a new system manager account</p>
                    </div>
                  </div>
                  <button onClick={() => setShowAddAdminModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>

                {adminAlert && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-semibold">
                    {adminAlert}
                  </div>
                )}

                <form onSubmit={handleCreateAdmin} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                    <input 
                      type="text" required 
                      value={newAdmin.name} 
                      onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                      placeholder="e.g. Mayantha Nawarathna (Manager)"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Admin Email Address</label>
                    <input 
                      type="email" required 
                      value={newAdmin.email} 
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      placeholder="admin2@example.com"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Phone (Hotline/2FA)</label>
                    <input 
                      type="text" 
                      value={newAdmin.phone} 
                      onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                      placeholder="+94 76 989 0079"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Master Password (min 6 characters)</label>
                    <input 
                      type="password" required minLength={6}
                      value={newAdmin.password} 
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-slate-900"
                    />
                  </div>

                  <div className="flex gap-2 pt-3">
                    <button 
                      type="button" 
                      onClick={() => setShowAddAdminModal(false)} 
                      className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={adminSaving}
                      className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-purple-500/20"
                    >
                      {adminSaving ? 'Creating...' : 'Create Admin'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Tab 6: Customize Home */}
          {activeTab === 'customize' && (
            <CustomizeHomeTab />
          )}

          {/* Tab 7: Stock Management */}
          {activeTab === 'stock' && (
            <StockManagementTab 
              products={products} 
              onUpdateStock={() => fetchAdminData()} 
            />
          )}

          {/* Tab 8: Suppliers */}
          {activeTab === 'suppliers' && (
            <SuppliersTab />
          )}

          {/* Tab 9: Store Settings & AI Knowledge Engine */}
          {activeTab === 'shop' && (
            <ShopSettingsTab />
          )}

          {/* Tab 10: Customer Reviews & Ratings Moderation */}
          {activeTab === 'reviews' && (
            <ReviewsTab />
          )}

          </div>
        </div>
      </main>
    </div>
  );
}