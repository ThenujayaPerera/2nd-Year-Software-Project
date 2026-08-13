import os
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 800, "NVSHOP.LK – Comprehensive Project Documentation")
            self.drawRightString(558, 800, "2nd Year Software Project")
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.5)
            self.line(54, 792, 558, 792)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        self.drawString(54, 32, "Confidential • NVSHOP.LK Mobile Accessories • Ambalangoda, Sri Lanka")
        self.drawRightString(558, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    primary_color = colors.HexColor("#1e3a8a")
    secondary_color = colors.HexColor("#2563eb")
    dark_slate = colors.HexColor("#0f172a")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.white,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#bfdbfe"),
        spaceAfter=0
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=dark_slate,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#334155")
    )

    badge_style = ParagraphStyle(
        'BadgeText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9,
        textColor=colors.HexColor("#166534"),
        alignment=1
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0f172a")
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#334155")
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#0f172a")
    )

    story = []

    # 1. Header Banner Box (Table)
    banner_content = [
        [
            Paragraph("<b>📱 NVSHOP.LK – Comprehensive Project Documentation</b>", title_style),
            Paragraph("<b>STATUS: 97% COMPLETE</b><br/><font size=7 color='#bfdbfe'>Production & Viva Ready</font>", ParagraphStyle('StatusB', parent=styles['Normal'], alignment=2, textColor=colors.white, fontName='Helvetica-Bold', fontSize=10, leading=12))
        ],
        [
            Paragraph("Enterprise Full-Stack E-Commerce Platform for Genuine Branded Mobile Accessories (Anker, UGREEN, Baseus)", subtitle_style),
            Paragraph("<font size=7.5 color='#93c5fd'>2nd Year Software Project</font>", ParagraphStyle('SubR', parent=styles['Normal'], alignment=2, textColor=colors.HexColor("#93c5fd")))
        ]
    ]
    banner_table = Table(banner_content, colWidths=[380, 135])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), primary_color),
        ('PADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 8))

    # Store contact highlight strip
    store_info = [
        [
            Paragraph("<b>📍 Showroom:</b> 185/1/2B New Road, Ambalangoda 80300, Sri Lanka &nbsp;|&nbsp; <b>📞 Hotline:</b> +94 76 989 0079 &nbsp;|&nbsp; <b>✉️:</b> nvshopamba@gmail.com", ParagraphStyle('StoreInfo', fontName='Helvetica', fontSize=8, leading=10, textColor=colors.HexColor("#1e3a8a")))
        ]
    ]
    store_table = Table(store_info, colWidths=[515])
    store_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#eff6ff")),
        ('BORDER', (0,0), (-1,-1), 0.5, colors.HexColor("#bfdbfe")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(store_table)
    story.append(Spacer(1, 10))

    # SECTION 1: EXECUTIVE SUMMARY & STATUS
    story.append(Paragraph("1. Executive Summary & Completion Status", h1_style))
    story.append(Paragraph("NVSHOP.LK is a production-grade full-stack e-commerce web platform engineered for an authentic retail shop in Ambalangoda. It features a complete customer journey, real-time inventory management, dual-channel OTP verification (Email + Sri Lankan Mobile SMS), and order tracking with automated invoices.", body_style))
    story.append(Spacer(1, 6))

    status_data = [
        [
            Paragraph("Module / Domain", table_header_style),
            Paragraph("Status", table_header_style),
            Paragraph("Progress", table_header_style),
            Paragraph("Delivered Capabilities", table_header_style)
        ],
        [
            Paragraph("<b>Catalog & Browsing</b>", table_cell_bold),
            Paragraph("Completed", badge_style),
            Paragraph("<b>100%</b>", table_cell_bold),
            Paragraph("48 authentic products, 11 categories, real-time search, multi-criteria filtering", table_cell_style)
        ],
        [
            Paragraph("<b>Product Details & Gallery</b>", table_cell_bold),
            Paragraph("Completed", badge_style),
            Paragraph("<b>100%</b>", table_cell_bold),
            Paragraph("Multi-angle image switcher, Rs. 1000 OFF badge, dual actions (Add to Cart / Buy Now), specs", table_cell_style)
        ],
        [
            Paragraph("<b>Dual OTP Authentication</b>", table_cell_bold),
            Paragraph("Completed", badge_style),
            Paragraph("<b>100%</b>", table_cell_bold),
            Paragraph("<b>Notify.lk Sri Lanka SMS Gateway</b> + <b>Gmail SMTP HTML Email OTP</b> verification", table_cell_style)
        ],
        [
            Paragraph("<b>Shopping Cart & Promos</b>", table_cell_bold),
            Paragraph("Completed", badge_style),
            Paragraph("<b>100%</b>", table_cell_bold),
            Paragraph("Exact NVSHOP.LK Cart UI, free islandwide delivery progress bar (Rs. 10k threshold), NV10 coupon", table_cell_style)
        ],
        [
            Paragraph("<b>Checkout & Orders</b>", table_cell_bold),
            Paragraph("Completed", badge_style),
            Paragraph("<b>100%</b>", table_cell_bold),
            Paragraph("Full Sri Lankan address form, Cash on Delivery support, instant order creation", table_cell_style)
        ],
        [
            Paragraph("<b>Order Tracking & Invoices</b>", table_cell_bold),
            Paragraph("Completed", badge_style),
            Paragraph("<b>100%</b>", table_cell_bold),
            Paragraph("Live Status Stepper (PROCESSING &rarr; SHIPPED &rarr; DELIVERED), printable receipts", table_cell_style)
        ],
        [
            Paragraph("<b>Customer Profile & Warranty</b>", table_cell_bold),
            Paragraph("Completed", badge_style),
            Paragraph("<b>100%</b>", table_cell_bold),
            Paragraph("Order list, digital brand warranty certificates with serial numbers & remaining days calculation", table_cell_style)
        ],
        [
            Paragraph("<b>Product Comparison</b>", table_cell_bold),
            Paragraph("Completed", badge_style),
            Paragraph("<b>100%</b>", table_cell_bold),
            Paragraph("Side-by-side spec comparison table for up to 4 devices simultaneously", table_cell_style)
        ],
        [
            Paragraph("<b>Admin Management Suite</b>", table_cell_bold),
            Paragraph("Completed", badge_style),
            Paragraph("<b>95%</b>", table_cell_bold),
            Paragraph("Product CRUD, stock updates, order status switcher, sales revenue summary metrics", table_cell_style)
        ],
        [
            Paragraph("<b>External Integrations</b>", table_cell_bold),
            Paragraph("Completed", badge_style),
            Paragraph("<b>100%</b>", table_cell_bold),
            Paragraph("MySQL Database, Notify.lk REST API, Gmail SMTP (Port 587), Google Maps Showroom Link", table_cell_style)
        ],
    ]

    status_table = Table(status_data, colWidths=[110, 60, 50, 295])
    status_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('BORDER', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
    ]))
    story.append(status_table)
    story.append(Spacer(1, 10))

    # SECTION 2: TECHNOLOGY STACK
    story.append(Paragraph("2. Full-Stack Technology Architecture", h1_style))
    
    tech_data = [
        [
            Paragraph("<b>💻 Frontend (Client-Side)</b>", table_header_style),
            Paragraph("<b>⚙️ Backend (Server-Side)</b>", table_header_style)
        ],
        [
            Paragraph(
                "• <b>React 18</b> (Single Page Application architecture)<br/>"
                "• <b>Vite v8.0</b> (Lightning fast build tool and HMR)<br/>"
                "• <b>Zustand</b> (Global state stores for Cart, Auth, Wishlist, Compare)<br/>"
                "• <b>Tailwind CSS & Vanilla CSS</b> (Responsive modern UI)<br/>"
                "• <b>React Router DOM v6</b> (Client-side routing with aliases)<br/>"
                "• <b>Lucide React</b> (High-clarity vector icons)<br/>"
                "• <b>Axios & Fetch API</b> (REST API communication)",
                table_cell_style
            ),
            Paragraph(
                "• <b>Spring Boot v4.1.0 / Java 17 LTS</b><br/>"
                "• <b>Embedded Apache Tomcat 11</b> (Port 8080)<br/>"
                "• <b>Spring Security & BCrypt</b> (Password encryption & token auth)<br/>"
                "• <b>Spring Data JPA & Hibernate ORM 7</b> (Data persistence)<br/>"
                "• <b>HikariCP</b> (Connection pool with auto-reconnect)<br/>"
                "• <b>Jakarta Validation API</b> (@Valid, @NotBlank, @Email)<br/>"
                "• <b>MimeMessage JavaMailSender</b> (HTML email delivery)",
                table_cell_style
            )
        ],
        [
            Paragraph("<b>🗄️ Database Infrastructure</b>", table_header_style),
            Paragraph("<b>☁️ Live Third-Party Cloud Integrations</b>", table_header_style)
        ],
        [
            Paragraph(
                "• <b>MySQL (via XAMPP / MariaDB)</b> on Port 3306<br/>"
                "• <b>Database Name:</b> gpsd_project<br/>"
                "• <b>Core Relational Entities:</b> users, products, orders, order_items<br/>"
                "• Foreign key constraints and automated schema migration",
                table_cell_style
            ),
            Paragraph(
                "• <b>Notify.lk SMS REST API:</b> Live Sri Lankan SMS OTP delivery to Dialog, Mobitel, Airtel, and Hutch (User ID: 32620)<br/>"
                "• <b>Google Gmail SMTP (Port 587 TLS):</b> HTML verification & invoices<br/>"
                "• <b>Google Maps:</b> Direct showroom coordinates linking",
                table_cell_style
            )
        ]
    ]

    tech_table = Table(tech_data, colWidths=[255, 260])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f8fafc")),
        ('BACKGROUND', (0,2), (-1,2), colors.HexColor("#f8fafc")),
        ('BORDER', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(tech_table)

    story.append(PageBreak())

    # SECTION 3: 6-MEMBER GROUP PROJECT VIVA ALLOCATION
    story.append(Paragraph("3. 6-Member Group Project Viva Allocation Matrix", h1_style))
    story.append(Paragraph("To ensure full marks in the viva evaluation, all SRS requirements and project code are systematically distributed among 6 members:", body_style))
    story.append(Spacer(1, 6))

    viva_data = [
        [
            Paragraph("Member", table_header_style),
            Paragraph("Assigned Domain & Responsibilities", table_header_style),
            Paragraph("Key Code Files & Technical Concepts to Explain", table_header_style)
        ],
        [
            Paragraph("<b>Member 1</b>", table_cell_bold),
            Paragraph("<b>Architecture & Dual OTP Security</b><br/><font color='#64748b'>Backend lead</font>", table_cell_style),
            Paragraph(
                "• Spring Boot REST Controller architecture (<code>AuthController.java</code>)<br/>"
                "• BCrypt Password encryption & Security filter chain<br/>"
                "• <b>Notify.lk SMS REST API</b> live HTTP payload dispatch & SMS verification (<code>SmsService.java</code>)<br/>"
                "• <b>Gmail SMTP</b> TLS port 587 email verification dispatch (<code>MailService.java</code>)",
                table_cell_style
            )
        ],
        [
            Paragraph("<b>Member 2</b>", table_cell_bold),
            Paragraph("<b>Catalog, Search & Comparison</b><br/><font color='#64748b'>Catalog specialist</font>", table_cell_style),
            Paragraph(
                "• <code>ProductController.java</code> and <code>ProductService.java</code> data flow<br/>"
                "• Spring Data JPA Repository query methods with price & category criteria<br/>"
                "• Client-side dynamic search filtering and sorting algorithms in React (<code>Products.jsx</code>)<br/>"
                "• 4-device side-by-side spec comparison matrix (<code>Comparison.jsx</code>)",
                table_cell_style
            )
        ],
        [
            Paragraph("<b>Member 3</b>", table_cell_bold),
            Paragraph("<b>UI/UX, Product Specs & Warranty</b><br/><font color='#64748b'>Frontend UI designer</font>", table_cell_style),
            Paragraph(
                "• Responsive layout system using Tailwind CSS and CSS Grid<br/>"
                "• Product Details showcase: Rs. 1000 OFF badge, interactive gallery thumbnails (<code>ProductDetails.jsx</code>)<br/>"
                "• Zustand Wishlist store integration with local persistence (<code>Wishlist.jsx</code>)<br/>"
                "• Digital warranty certificate engine with serial numbers & remaining days (<code>UserProfile.jsx</code>)",
                table_cell_style
            )
        ],
        [
            Paragraph("<b>Member 4</b>", table_cell_bold),
            Paragraph("<b>Cart, Promo Engine & Checkout</b><br/><font color='#64748b'>Commerce workflow</font>", table_cell_style),
            Paragraph(
                "• Zustand Cart State management (<code>useCartStore</code>) for quantity & line totals<br/>"
                "• Free Islandwide Delivery progress calculation (Rs. 10,000 threshold bar in <code>Cart.jsx</code>)<br/>"
                "• Dynamic coupon validation engine (<code>NV10</code> / <code>WELCOME1000</code>)<br/>"
                "• Sri Lankan checkout form validation with Cash on Delivery selection (<code>Checkout.jsx</code>)",
                table_cell_style
            )
        ],
        [
            Paragraph("<b>Member 5</b>", table_cell_bold),
            Paragraph("<b>Order Pipeline & Live Tracking</b><br/><font color='#64748b'>Order automation</font>", table_cell_style),
            Paragraph(
                "• Order Entity One-to-Many mapping (<code>Order</code> &harr; <code>OrderItem</code>)<br/>"
                "• Automated transactional order processing (<code>OrderService.java</code>)<br/>"
                "• Real-time delivery status visual stepper (<code>PROCESSING</code> &rarr; <code>SHIPPED</code> &rarr; <code>DELIVERED</code> in <code>Orders.jsx</code>)<br/>"
                "• Automated MimeMessage HTML invoice generation sent to customer email",
                table_cell_style
            )
        ],
        [
            Paragraph("<b>Member 6</b>", table_cell_bold),
            Paragraph("<b>Admin Portal & DB Infrastructure</b><br/><font color='#64748b'>DB & Admin lead</font>", table_cell_style),
            Paragraph(
                "• MySQL schema design and HikariCP connection pooling configurations (<code>application.properties</code>)<br/>"
                "• Admin protected route authorization and credential validation<br/>"
                "• Full Product Inventory CRUD (Create, Read, Update, Delete in <code>Admin.jsx</code>)<br/>"
                "• Live Order status switcher and sales revenue summary metrics",
                table_cell_style
            )
        ],
    ]

    viva_table = Table(viva_data, colWidths=[65, 140, 310])
    viva_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('BORDER', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
    ]))
    story.append(viva_table)
    story.append(Spacer(1, 10))

    # SECTION 4: DEMO CREDENTIALS & QUICK LINKS
    story.append(Paragraph("4. Live Demo Endpoints & Credentials", h1_style))
    
    cred_data = [
        [
            Paragraph("Role / Service", table_header_style),
            Paragraph("URL / Port", table_header_style),
            Paragraph("Credentials & Instructions", table_header_style)
        ],
        [
            Paragraph("<b>Customer Web Portal</b>", table_cell_bold),
            Paragraph("<code>http://localhost:5173</code>", table_cell_style),
            Paragraph("Sign up with any +94 phone or email, or click <b>'Instant Preview with Demo Customer'</b>", table_cell_style)
        ],
        [
            Paragraph("<b>Admin Management Portal</b>", table_cell_bold),
            Paragraph("<code>http://localhost:5173/admin</code>", table_cell_style),
            Paragraph("Email: <code>admin@example.com</code> &nbsp;|&nbsp; Password: <code>admin123</code>", table_cell_style)
        ],
        [
            Paragraph("<b>Backend REST API</b>", table_cell_bold),
            Paragraph("<code>http://localhost:8080/api</code>", table_cell_style),
            Paragraph("Spring Boot 4.1 REST API (Products, Auth, Orders, Categories)", table_cell_style)
        ],
        [
            Paragraph("<b>MySQL Database</b>", table_cell_bold),
            Paragraph("<code>localhost:3306</code>", table_cell_style),
            Paragraph("Database: <code>gpsd_project</code> &nbsp;|&nbsp; User: <code>root</code> &nbsp;|&nbsp; Pass: <i>(blank)</i>", table_cell_style)
        ],
        [
            Paragraph("<b>Notify.lk SMS Gateway</b>", table_cell_bold),
            Paragraph("<code>app.notify.lk/api/v1/send</code>", table_cell_style),
            Paragraph("User ID: <code>32620</code> &nbsp;|&nbsp; Sender ID: <code>NotifyDEMO</code>", table_cell_style)
        ],
    ]

    cred_table = Table(cred_data, colWidths=[125, 130, 260])
    cred_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('BORDER', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
    ]))
    story.append(cred_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully built at: {filename}")

if __name__ == "__main__":
    out_pdf = r"c:\Users\ASUS TUF\Desktop\New folder (3)\GPSD\2nd-Year-Software-Project-main\NVSHOP_LK_Project_Overview.pdf"
    build_pdf(out_pdf)
