const cron = require("node-cron");
const { subDays, startOfDay, endOfDay, getTime } = require("date-fns");
const sendEmail = require("./sendEmail");
const { ConnectionRequest } = require("../models/connectionRequest");
const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();

console.log(`${hours}:${minutes}:${seconds}`);

// This job will run at 8 AM in the morning everyday
cron.schedule("16 0 * * *", async () => {
  // Send emails to all people who got requests the previous day
  console.log("1");
  try {
    const yesterday = subDays(new Date(), 0);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];

    console.log(listOfEmails);

    for (const email of listOfEmails) {
      // Send Emails
      try {
        const res = await sendEmail.run(
          "New Friend Requests pending",
          "Hi " +
            email.split("@")[0].replace(/^./, (char) => char.toUpperCase()) +
            ", there are so many friend requests pending, please login to Tinder and accept or reject the requests."
        );
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
});
