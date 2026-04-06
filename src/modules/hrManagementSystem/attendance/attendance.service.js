import { client } from "../../../database/redis.connection.js";
import { staffModel } from "../../../database/model/staff.model.js";
import { deductionModel } from "../../../database/model/deduction.model.js";

export const checkIn = async (req, res) => {
  let { id, role } = req.user;

  if (role !== "staff" || role !== "admin") {
    return res
      .status(400)
      .json({ message: "You are not a authorized staff or admin" });
  }
  let checkInDate = new Date();
  let hours = checkInDate.getHours();
  const today = checkInDate.toISOString().split("T")[0];
  const existing = await client.hGet(
    `staff:${id}:date:${today}`,
    "checkInTime",
  );
  if (existing) {
    return res
      .status(400)
      .json({ message: "You have already checked in today" });
  }
  let late = true;
  if (hours < 9) {
    late = false;
  } else if (hours === 9) {
    if (checkInDate.getMinutes() == 0) {
      late = false;
    } else {
      late = true;
    }
  }

  await client.hSet(`staff:${id}:date:${today}`, {
    checkInTime: checkInDate.getTime().toString(),
    isLate: late.toString(),
    day: today,
  });
  // await client.set(`staff:${id}:date:${today}`, hours);
  // await client.set(`${id}:late`, false);
  // await client.set(`${id}:day`, day);

  await client.expire(`staff:${id}:date:${today}`, 86400);
  return res.status(200).json({
    message: late ? "Checked in (Late)" : "Checked in on time",
  });
};

export const checkOut = async (req, res) => {
  let { id, role } = req.user;

  if (role !== "staff" || role !== "admin") {
    return res
      .status(400)
      .json({ message: "You are not a authorized staff or admin" });
  }
  let staffMember = await staffModel.findById(id);

  let checkOutDate = new Date();
  const today = checkOutDate.toISOString().split("T")[0];
  const redisKey = `staff:${id}:date:${today}`;

  const checkInData = await client.hGetAll(redisKey);

  if (!checkInData.checkInTime) {
    return res.status(400).json({ message: "You haven't checked in today" });
  }
  if (checkInData.checkOutTime) {
    return res.status(400).json({ message: "Already checked out today" });
  }

  const checkInFullDate = new Date(parseInt(checkInData.checkInTime));
  let checkInHour24 = checkInFullDate.getHours();
  let checkInHour12 = checkInHour24 % 12 || 12;

  let checkOutHour24 = checkOutDate.getHours();
  let checkOutHour12 = checkOutHour24 % 12 || 12;

  let totalWorkingHours = 0;

  if (checkOutHour24 >= checkInHour24) {
    let hourDiff = checkOutHour24 - checkInHour24;
    let minuteDiff =
      (checkOutDate.getMinutes() - checkInFullDate.getMinutes()) / 60;

    totalWorkingHours = hourDiff + minuteDiff;
  }

  staffMember.totalWorkingHours += totalWorkingHours;

  if (totalWorkingHours < 8) {
    let month = today.split("-").slice(0, 2).join("-");
    await deductionModel.create({
      staff: id,
      reason: "Late",
      amount: staffMember.dailySalary,
      month,
      date: new Date(),
    });
  }

  await client.hSet(
    redisKey,
    "checkOutTime",
    checkOutDate.getTime().toString(),
  );
  await staffMember.save();

  return res.status(200).json({
    message: "Checked out successfully",
    checkIn: `${checkInHour12} ${checkInHour24 >= 12 ? "PM" : "AM"}`,
    checkOut: `${checkOutHour12} ${checkOutHour24 >= 12 ? "PM" : "AM"}`,
    hoursWorked: totalWorkingHours.toFixed(2),
  });
};
