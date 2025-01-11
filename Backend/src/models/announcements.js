import mongoose from "mongoose";
 const announcementSchema = new mongoose.Schema({
    // ticketId: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     trim: true
    // },
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    rateBifercation: {
        type: String,
        required: false,
        trim: true
    },
    images:{
        paymentConfirmation:[
            {
                type: String
            }
        ],
        productImages:[
            {
                type: String
            }
        ]
    },
    days:{
        type: Number,
        required: false,
        trim: true
    },
    isApproved:{
        type: Boolean,
        default: false
    },
    isDisapproved :{
        type: Boolean,
        default: false
    },approvedOn:{
        type: Date,
        required: false
    },
    expiresin:{
        type: Date,
        required: false
    }
    
});
const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;

