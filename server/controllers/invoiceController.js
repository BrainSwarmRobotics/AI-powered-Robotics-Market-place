const PDFDocument = require('pdfkit');
const Order = require('../models/Order');

function formatPrice(n) {
  return `Rs ${Number(n ?? 0).toLocaleString('en-PK')}`;
}

// GET /api/orders/:id/invoice
exports.getInvoice = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // Header
    doc.fontSize(20).fillColor('#0E1F4B').text('Brainswarm Robotics', { continued: false });
    doc.fontSize(10).fillColor('#666666').text('Invoice');
    doc.moveDown(1.5);

    doc.fontSize(10).fillColor('#000000');
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-PK')}`);
    doc.text(`Payment Method: ${order.paymentMethod}`);
    doc.text(`Payment Status: ${order.paymentStatus}`);
    doc.text(`Order Status: ${order.status}`);
    doc.moveDown();

    // Shipping address
    doc.fontSize(12).fillColor('#0E1F4B').text('Shipping Address');
    doc.fontSize(10).fillColor('#000000');
    const addr = order.shippingAddress;
    doc.text(addr.street);
    doc.text([addr.city, addr.state, addr.postalCode].filter(Boolean).join(', '));
    if (addr.country) doc.text(addr.country);
    if (addr.phone) doc.text(`Phone: ${addr.phone}`);
    doc.moveDown();

    // Items
    doc.fontSize(12).fillColor('#0E1F4B').text('Items');
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#000000');

    order.items.forEach((item) => {
      doc.text(
        `${item.name}   x${item.qty}   ${formatPrice(item.price)} each   =   ${formatPrice(item.price * item.qty)}`
      );
    });

    doc.moveDown();
    doc.moveTo(doc.x, doc.y).lineTo(550, doc.y).strokeColor('#dddddd').stroke();
    doc.moveDown(0.5);

    doc.text(`Subtotal: ${formatPrice(order.subtotal)}`, { align: 'right' });
    doc.text(`Shipping: ${formatPrice(order.shipping)}`, { align: 'right' });
    doc.fontSize(12).fillColor('#0E1F4B').text(`Total: ${formatPrice(order.total)}`, { align: 'right' });

    doc.moveDown(2);
    doc.fontSize(9).fillColor('#999999').text('Thank you for shopping with Brainswarm Robotics.', {
      align: 'center',
    });

    doc.end();
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.end();
    }
  }
};