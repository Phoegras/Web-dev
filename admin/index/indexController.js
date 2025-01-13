const reportBusiness = require('../reports/reportsBusiness');

async function getIndex(req, res) {
    const admin = req.user;

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    const limit = 10;

    try {
        const revenue = await reportBusiness.getRevenueReport(yesterday, today);

      const topProducts = await reportBusiness.getTopProductsByRevenue(yesterday, today, parseInt(limit) || 10);
      res.render('index', { admin, revenue, topProducts });

    } catch (error) {
      console.error(error);
      res.render('error', { message: "Failed to fetch top products" });
    }
}

module.exports = {
    getIndex,
}