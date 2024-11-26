const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");
//send connection Request api
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      //get data from the API

      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //validate the status as at DB level for all the Api for this specific api valiation done agian

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type : " + status,
        });
      }

      // // validate the to which user send request is in the DB
      const toUser = await User.findById(toUserId);
      console.log(toUser);
      if (!toUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      //validate login user not send the request again to same other user and if login user send requset already other user not able to send request to login user

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

      //save data to mongoDb

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message:
          status === "interested"
            ? req.user.firstName + " is interested in " + toUser.firstName
            : req.user.firstName + " ignored " + toUser.firstName,
        data,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

module.exports = { requestRouter };
