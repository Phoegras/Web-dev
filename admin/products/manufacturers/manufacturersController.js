const { addManufacturer, getManufacturers, updateManufacturer, deleteManufacturer} = require('./manufacturersBusiness');

module.exports = {
    getAllManufacturers: async( req, res ) => {
        try {
            const manufacturers = await getManufacturers();
            res.render('manufacturer-manager',{ success: true, manufacturers, admin: req.user });
        } catch (error) {
            res.json({ success: false, message: error.message });
            console.log(error);
        }
    },

    addManufacturer: async( req, res ) => {
        const { name } = req.body;
        try {
            const manufacturer = await addManufacturer(name);
            res.json({ success: true, manufacturer });
        } catch (error) {
            res.json({ success: false, message: error.message });
            console.log(error);
        }
    },
   
    updateManufacturer: async( req, res ) => {
        const { id } = req.params;
        const { name } = req.body;
        try {
            const manufacturer = await updateManufacturer(id, name);
            res.json({ success: true, manufacturer });
        } catch (error) {
            res.json({ success: false, message: error.message });
            console.log(error);
        }
    },
    deleteManufacturer: async( req, res ) => {
        const { id } = req.params;
        try {
            const deletedManufacturer = await deleteManufacturer(id);
            res.json({ success: true, deletedManufacturer });
        } catch (error) {
            res.json({ success: false, message: error.message });
            console.log(error);
        }
    }
}