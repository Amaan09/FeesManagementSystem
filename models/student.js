var mongoose = require("mongoose");

var studentSchema = new mongoose.Schema({
    sl_no       : Number,
    roll_no     : Number,
    name        : String,
    class       : String,
    dob         : Date,
    father_name : String,
    mob_no      : Number,
    total_fees  : Number,
    fees_paid   : Number,
    balance     : Number
});

module.exports = mongoose.model("Student",studentSchema);