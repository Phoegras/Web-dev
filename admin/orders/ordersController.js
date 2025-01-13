const ordersBusiness = require('./ordersBusiness');

const getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.limit, 10) || 10;
        const status = req.query.status || undefined;
        const sortKey = req.query.sort || 'createdAt';
        const sortOrder = req.query.order || 'desc';

        const orders = await ordersBusiness.getAllOrders(page, pageSize, status, sortKey, sortOrder);
        const totalOrders = await ordersBusiness.getTotalOrder(status);
        const totalPages = Math.ceil(totalOrders / pageSize);

        res.render('orders', {
            orders,
            pagination: {
                currentPage: page,
                totalPages,
                totalOrders,
            },
        });
    } catch (error) {
        console.error('Error rendering orders page:', error.message);
        res.status(500).render('error', { message: 'Failed to load orders page' });
    }
};

const getOrdersApi = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.limit, 10) || 10;
        const status = req.query.status || undefined;
        const sortKey = req.query.sort || 'createdAt';
        const sortOrder = req.query.order || 'desc';

        const orders = await ordersBusiness.getAllOrders(page, pageSize, status, sortKey, sortOrder);
        const totalOrders = await ordersBusiness.getTotalOrder(status);
        const totalPages = Math.ceil(totalOrders / pageSize);

        res.status(200).json({
            success: true,
            orders,
            pagination: {
                currentPage: page,
                totalPages,
                totalOrders,
            },
        });
    } catch (error) {
        console.error('Error fetching orders as JSON:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
        });
    }
};

const getOrdersDetail = async (req, res) => {
    const { id } = req.params;

    try {
      const order = await ordersBusiness.getOrderDetail(id);
        res.render('order-detail', {
            order
        }
      )
    } catch (error) {
      console.error('Error in getOrderDetail:', error.message);
      res.status(500).json({
        success: false,
        message: error.message || 'Could not fetch order detail',
      });
    }
}

const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      const validStatuses = ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updatedOrder = await ordersBusiness.updateOrderStatus(id, status);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      return res.status(200).json({ message: "Order status updated successfully", order: updatedOrder });
    } catch (error) {
      console.error('Error updating order status:', error);
      return res.status(500).json({ message: "Error updating order status" });
    }
};

module.exports = {
    getOrdersDetail,
    getOrders,
    getOrdersApi,
    updateOrderStatus,
};
