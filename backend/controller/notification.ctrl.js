import Notification from "../models/notification.model.js";

const getNotification = async (req, res) => {
    try {
        const userId = req.user._id;

        const notification = await Notification
            .find({ to: userId })
            .populate({
                path: "from",
                select: "username profileImg"
            })

        await Notification.updateMany({ to: userId }, { read: true });

        res.status(200).json(notification);

    } catch (error) {
        console.log("error in getNotis controller: ", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}


const deleteNotification = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({ to: userId });

        res.status(200).json({
            message: "notification delete sucessfully"
        });

    } catch (error) {
        console.log("error in delete Notis controller: ", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}


const deleteOneNotification = async (req, res) => {
    try {
        const notisId = req.params;
        const userId = req.user._id;

        const notis = await Notification.findById(notisId);
        if (!notis) return res.status(404).json({ error: "no notification" });

        if (notis.to.toString() !== userId.toString()) {
            res.status(404).json({ error: "you are not allowed to delete this notis" });
        }

        await Notification.findByIdAndDelete(notis);
        res.status(200).json({ message: "notis delete successfully" })
    } catch (error) {
        console.log("error in delete one Notis controller: ", error.message);
        res.status(500).json({ error: "Internal server error" })

    }

}



export {
    getNotification,
    deleteNotification,
    deleteOneNotification
}