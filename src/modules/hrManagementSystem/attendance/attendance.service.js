import { client } from "../../../database/redis.connection.js";
import { staffModel } from "../../../database/model/staff.model.js";
import { deductionModel } from "../../../database/model/deduction.model.js";

export const checkIn = async (req, res) => {
  try {
    let { id, role } = req.user;

    if (role !== "staff" && role !== "admin") {
      return res
        .status(400)
        .json({ message: "You are not a authorized staff or admin" });
    }
    if (role === "admin") {
      if (!req.body.id) {
        return res.status(400).json({ message: "Staff user id is required" });
      }
      id = req.body.id;
    }
    let staff = await staffModel.findOne({ user: id });
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dayOfWeek = yesterday.getDay();
    if (dayOfWeek !== 5 && dayOfWeek !== 6) {
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      const yesterdayData = await client.hGetAll(
        `staff:${id}:date:${yesterdayStr}`,
      );
      if (yesterdayData.checkInTime && !yesterdayData.checkOutTime) {
        const month = yesterdayStr.slice(0, 7);
        await deductionModel.create({
          staff: staff._id,
          reason: "Absent (No checkout recorded)",
          amount: staff.dailySalary,
          month,
          date: yesterday,
        });
      }
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

    await client.expire(`staff:${id}:date:${today}`, 172800);
    return res.status(200).json({
      message: late ? "Checked in (Late)" : "Checked in on time",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    let { id, role } = req.user;

    if (role !== "staff" && role !== "admin") {
      return res
        .status(400)
        .json({ message: "You are not a authorized staff or admin" });
    }
    if (role === "admin") {
      if (!req.body.id) {
        return res.status(400).json({ message: "Staff user id is required" });
      }
      id = req.body.id;
    }
    let staffMember = await staffModel.findOne({ user: id });
    if (!staffMember)
      return res.status(404).json({ message: "Staff not found" });
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

    let totalWorkedHours = 0;

    if (checkOutHour24 >= checkInHour24) {
      let hourDiff = checkOutHour24 - checkInHour24;
      let minuteDiff =
        Math.abs(checkOutDate.getMinutes() - checkInFullDate.getMinutes()) / 60;

      totalWorkedHours = hourDiff + minuteDiff;
    }

    let month = today.slice(0, 7);
    if (totalWorkedHours < 8) {
      let missingHours = 8 - totalWorkedHours;
      let deductionAmount = (missingHours / 8) * staffMember.dailySalary;

      await deductionModel.create({
        staff: staffMember._id,
        reason: "Incomplete working hours",
        amount: deductionAmount,
        month,
      });
    }
    if (checkInData.isLate === "true") {
      await deductionModel.create({
        staff: staffMember._id,
        reason: "Late Arrival (After 9:00 AM)",
        amount: staffMember.dailySalary * 0.1,
        month: month,
        date: new Date(),
      });
    }
    let reportIndex = staffMember.monthlyReports.findIndex(
      (r) => r.month === month,
    );

    if (reportIndex === -1) {
      staffMember.monthlyReports.push({
        month: month,
        totalDaysWorked: 1,
      });
    } else {
      staffMember.monthlyReports[reportIndex].totalDaysWorked += 1;
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
      hoursWorked: totalWorkedHours,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
