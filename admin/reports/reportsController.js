const reportsBusiness = require('./reportsBusiness');

// Route to fetch revenue report
const getRevenueReport = async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(500).json({ error: "Invalid date range provided." });

    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(500).json({ error: "Invalid date format provided." });
    }

    try {
      const revenue = await reportsBusiness.getRevenueReport(start, end);
      res.status(200).json({ revenue });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch revenue report" });
    }
  };

  // Route to fetch top products by revenue
  const getTopProductsByRevenue = async (req, res) => {
    const { startDate, endDate, limit } = req.query;
    // Validate the dates
    if (!startDate || !endDate) {
      res.status(500).json({ error: "Invalid date range provided." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(500).json({ error: "Invalid date format provided." });
    }
    try {

      const topProducts = await reportsBusiness.getTopProductsByRevenue(start, end, parseInt(limit) || 10);
      res.json({ topProducts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch top products" });
    }
  };

module.exports = {
    getRevenueReport,
    getTopProductsByRevenue,
}