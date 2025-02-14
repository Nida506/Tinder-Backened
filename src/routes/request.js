const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");
const sendEmail = require("../utils/sendEmail");

// Send Connection Request API
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // Validate the status
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }

      // Check if the recipient user exists
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Check for existing connection requests
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection Request already exists",
        });
      }

      // Save the new connection request to MongoDB
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      // Send Email Notification
      const emailRes = await sendEmail.run(
        "A new friend request from " + req.user.firstName,
        status === "interested"
          ? `${req.user.firstName} is interested in ${toUser.firstName}`
          : `${req.user.firstName} ignored ${toUser.firstName}`
      );
      console.log("Email Response:", emailRes);

      res.json({
        message:
          status === "interested"
            ? `${req.user.firstName} is interested in ${toUser.firstName}`
            : `${req.user.firstName} ignored ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      console.error("Error in sending request:", err);
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = { requestRouter };
